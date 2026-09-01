// ============================================================
// SPOKEN — turning a speech transcript into something gradeable.
// Pure functions: no DOM, no browser APIs, no EP-specific state.
// Depends on normEP / epLineText / similarity from ground/data.js.
// ============================================================

const NUM = { zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,
  twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,
  twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90 };
// Every entry below was observed in a real recitation during the spike — never
// guessed. Recognition is good on this vocabulary; these are the exceptions.
const HOMOPHONE = {
  "may day": "mayday",        // "Declare MAYDAY" came back as two words, every time
  // "unlocked" is ambiguous and only means something in context. After "doors"
  // it is UNLATCHED (a rare word recognition reaches past). After "primer" it
  // is recognition collapsing "in and locked" into one word. A bare word map
  // fixed one of these and broke the other, so both are keyed on the item.
  "doors unlocked": "doors unlatched",
  "primer unlocked": "primer in locked",
  "primer unlock": "primer in locked",
  "car heat": "carb heat",    // "Carb Heat ON" -> "car heat on" (scraped a pass at 0.92)
  "carburetor heat": "carb heat",
  "carburettor heat": "carb heat",
};
function words2num(s) {
  const out = []; let acc = null, sum = 0;
  const push = () => { if (acc !== null || sum) { out.push(String(sum + (acc || 0))); acc = null; sum = 0; } };
  for (const t of s.split(/\s+/)) {
    const w = t.replace(/[^a-z0-9]/g, "");
    if (w in NUM) acc = (acc || 0) + NUM[w];
    // "seventeen hundred" and "17 hundred" are the same thing to a listener,
    // and now that numbers must match exactly, the digit form has to work too.
    else if (w === "hundred" || w === "thousand") {
      if (acc === null && out.length && /^\d+$/.test(out[out.length - 1])) acc = parseInt(out.pop(), 10);
      if (w === "hundred") acc = (acc || 1) * 100;
      else { sum += (acc || 1) * 1000; acc = null; }
    }
    else { push(); out.push(t); }
  }
  push(); return out.join(" ");
}
function normSpoken(s) {
  let t = String(s || "").toLowerCase()
    .replace(/\b([a-z])\.\s*(?=[a-z]\.)/g, "$1")     // k.i.a.s. -> kias
    .replace(/\b([a-z])\.(?![a-z])/g, "$1")
    .replace(/\b([a-z])(?:\s+([a-z])){2,}\b/g, m => m.replace(/\s+/g, ""))   // k i a s -> kias
    .replace(/\bslash\b/g, " ")                     // "cabin heat slash air" == "Cabin Heat / Air"
    .replace(/\b(uh|um|er|erm)\b/g, " ");
  t = words2num(t);
  for (const k in HOMOPHONE) t = t.replace(new RegExp("\\b" + k + "\\b", "g"), HOMOPHONE[k]);
  return t.replace(/\s+/g, " ").trim();
}
// The mic hears the callout through the speakers. Strip that echo off the FRONT
// of the transcript by matching words, not by dropping whole results: when you
// answer instantly the echo and your first line arrive fused into one result,
// so any boundary based on result index takes your opening words with it.
//
// Safe when there is no echo at all (headphones): an EP title looks nothing
// like its own first step, so nothing matches and nothing is removed.
function stripEcho(text, announced) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const target = normEP(announced || "");
  if (!words.length || !target) return String(text || "");
  const span = Math.min(words.length, target.split(" ").length + 4);
  let bestLen = 0, bestSim = 0;
  for (let len = 1; len <= span; len++) {
    const sim = similarity(normEP(words.slice(0, len).join(" ")), target);
    if (sim > bestSim) { bestSim = sim; bestLen = len; }
  }
  return bestSim >= 0.6 ? words.slice(bestLen).join(" ") : String(text || "");
}

// Recognition breaks the word stream at whatever pauses it noticed, which is
// not where the EP's lines break. So we do the splitting: a DP that hands each
// expected line the run of words that maximizes total similarity across the
// WHOLE recitation, with zero words allowed for a line you never said.
//
// Greedy left-to-right was tried first and cascades badly — skip one step and
// every line after it misaligns, so one fumble is reported as four. The global
// pass keeps a skipped line's damage to that line.
function segmentSpoken(text, ep) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = ep.lines, m = lines.length, n = words.length;
  if (!n) return lines.map(() => "").join("\n");
  const targets = lines.map(l => normEP(epLineText(l)));
  const maxLen = targets.map(t => Math.min(n, Math.ceil(Math.max(1, t.split(" ").length) * 2.5) + 3));
  // A chunk this dissimilar to a line is not evidence for that line, so it earns
  // nothing — the words are still consumed, but they buy no score. Without this
  // floor the DP maximises a SUM and will happily tear a good line in half to
  // sprinkle the scraps onto lines you never said: skipping two adjacent steps
  // put "mixture idle" on Mixture (0.63) and the orphaned "cutoff" on Mags
  // (0.38), out-scoring the correct 1.00 assignment and inventing a third miss.
  const MATCH_FLOOR = 0.5;
  const NEG = -Infinity, memo = new Map();
  const cand = (a, b) => { const k = a + ":" + b; let v = memo.get(k); if (v === undefined) { v = normEP(words.slice(a, b).join(" ")); memo.set(k, v); } return v; };
  const S = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(NEG));
  const L = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  S[0][0] = 0;
  for (let i = 1; i <= m; i++) for (let j = 0; j <= n; j++) {
    let best = NEG, bl = 0; const hi = Math.min(j, maxLen[i - 1]);
    for (let len = 0; len <= hi; len++) {
      const prev = S[i - 1][j - len]; if (prev === NEG) continue;
      let add = 0;
      if (len) { const sim = similarity(cand(j - len, j), targets[i - 1]); if (sim >= MATCH_FLOOR) add = sim; }
      const sc = prev + add;
      if (sc > best) { best = sc; bl = len; }
    }
    S[i][j] = best; L[i][j] = bl;
  }
  let end = n;
  if (S[m][end] === NEG) for (let j = n; j >= 0; j--) if (S[m][j] !== NEG) { end = j; break; }
  const out = new Array(m).fill(""); let j = end;
  for (let i = m; i >= 1; i--) { const len = L[i][j]; out[i - 1] = len ? words.slice(j - len, j).join(" ") : ""; j -= len; }
  if (end < n) out[m - 1] = (out[m - 1] + " " + words.slice(end).join(" ")).trim();
  return out.join("\n");
}

