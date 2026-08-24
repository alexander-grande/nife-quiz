// ============================================================
// EP DRILL — random procedure, typed verbatim, graded line by line.
// ============================================================
const $ = id => document.getElementById(id);
const STAT_KEY = "nife-ground-ep";
let order = [], pos = 0, graded = false;

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function stats() { try { return JSON.parse(localStorage.getItem(STAT_KEY) || "null") || { n: 0, perfect: 0, best: {} }; } catch (e) { return { n: 0, perfect: 0, best: {} }; } }
function renderStats() {
  const s = stats(); if (!s.n) { $("ep-stats").textContent = ""; return; }
  const bests = EPS.map(ep => s.best[ep.id] !== undefined ? `${ep.title.split(" ").slice(0, 2).join(" ")} ${s.best[ep.id]}%` : null).filter(Boolean).join(" · ");
  $("ep-stats").textContent = `${s.n} recited · ${s.perfect} perfect` + (bests ? ` · best: ${bests}` : "");
}
function current() { return EPS[order[pos]]; }
function show() {
  graded = false;
  const ep = current();
  $("ep-progress").textContent = `EP ${pos + 1} of ${order.length}`;
  $("ep-title").textContent = ep.title;
  $("ep-input").value = ""; $("ep-input").disabled = false; $("ep-input").focus();
  $("ep-result").className = "hidden"; $("ep-result").innerHTML = "";
  $("ep-submit").classList.remove("hidden"); $("ep-show").classList.remove("hidden"); $("ep-next").classList.add("hidden");
}
function renderLines(rows, reveal) {
  return `<div class="gs-lines">` + rows.map(r => {
    const cls = r.line.type === "decision" ? "dec" : "";
    if (!r.graded) return `<div class="gs-line skip ${cls}"><span class="mark">·</span><span class="exp">${r.expected}</span><span class="got">${reveal ? "" : (r.given || "")}</span></div>`;
    return `<div class="gs-line ${r.ok ? "ok" : "bad"} ${cls}"><span class="mark">${r.ok ? "✓" : "✗"}</span><span class="exp">${r.line.type === "step" ? "*" + r.line.n + ". " : "• "}${r.expected}</span><span class="got">${reveal ? "" : (r.given ? "you: " + r.given : "<em>missing</em>")}</span></div>`;
  }).join("") + `</div>`;
}
function grade() {
  if (graded) return;
  const ep = current(), text = $("ep-input").value;
  if (!text.trim()) { $("ep-input").focus(); return; }
  graded = true;
  const rows = gradeEP(ep, text);
  const g = rows.filter(r => r.graded), ok = g.filter(r => r.ok).length, pct = Math.round(ok / g.length * 100);
  const r = $("ep-result");
  r.className = "feedback " + (pct === 100 ? "good" : "bad");
  r.innerHTML = `<div class="fb-verdict">${ok} of ${g.length} lines (${pct}%)${pct === 100 ? " — verbatim. Bravo Zulu." : ""}</div>` + renderLines(rows, false);
  try { const s = stats(); s.n++; if (pct === 100) s.perfect++; s.best[ep.id] = Math.max(s.best[ep.id] || 0, pct); localStorage.setItem(STAT_KEY, JSON.stringify(s)); } catch (e) {}
  renderStats();
  $("ep-input").disabled = true; $("ep-submit").classList.add("hidden"); $("ep-show").classList.add("hidden");
  $("ep-next").classList.remove("hidden"); $("ep-next").focus();
}
function showEP() {
  const ep = current(); graded = true;
  const rows = ep.lines.map(l => ({ line: l, expected: epLineText(l), given: "", ok: true, graded: l.type !== "note" }));
  const r = $("ep-result"); r.className = "feedback"; r.innerHTML = `<div class="fb-verdict">${ep.title}</div>` + renderLines(rows, true);
  $("ep-input").disabled = true; $("ep-submit").classList.add("hidden"); $("ep-show").classList.add("hidden"); $("ep-next").classList.remove("hidden");
}
function next() { pos++; if (pos >= order.length) { order = shuffle(EPS.map((_, i) => i)); pos = 0; } show(); }
$("ep-submit").addEventListener("click", grade);
$("ep-show").addEventListener("click", showEP);
$("ep-next").addEventListener("click", next);
$("ep-input").addEventListener("keydown", e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") grade(); });
order = shuffle(EPS.map((_, i) => i)); renderStats(); show();
