// ============================================================
// EP DRILL — random procedure; step numbers and decision bullets are
// given, the student fills in each line. Graded line by line.
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
function inputs() { return [...document.querySelectorAll("#ep-lines input")]; }

function show() {
  graded = false;
  const ep = current();
  $("ep-progress").textContent = `EP ${pos + 1} of ${order.length}`;
  $("ep-title").textContent = ep.title;
  $("ep-lines").innerHTML = ep.lines.map((l, i) => {
    if (l.type === "note") return `<div class="gs-step note">${l.text}</div>`;
    const marker = l.type === "decision" ? (l.plain ? "" : "&bull;") : `*${l.n}.`;
    return `<div class="gs-step decision"><span class="gs-n">${marker}</span><span class="gs-field"><input type="text" data-i="${i}" aria-label="${ep.title} line ${i + 1}" autocomplete="off" spellcheck="false"></span></div>`;
  }).join("");
  $("ep-result").className = "hidden"; $("ep-result").innerHTML = "";
  $("ep-submit").classList.remove("hidden"); $("ep-show").classList.remove("hidden"); $("ep-next").classList.add("hidden");
  const first = inputs()[0]; if (first) first.focus();
}
function markAll(reveal) {
  const ep = current(); let ok = 0, n = 0;
  inputs().forEach(inp => {
    const line = ep.lines[+inp.dataset.i]; const expected = epLineText(line);
    inp.disabled = true;
    if (reveal) { inp.value = expected; return; }
    const good = epMatchLine(inp.value, line); n++; if (good) ok++;
    inp.classList.add(good ? "gs-ok" : "gs-bad");
    if (!good) { const k = document.createElement("span"); k.className = "gs-key"; k.textContent = expected; inp.parentElement.appendChild(k); }
  });
  return { ok, n };
}
function grade() {
  if (graded) return;
  if (!inputs().some(i => i.value.trim())) { inputs()[0].focus(); return; }
  graded = true;
  const ep = current(), { ok, n } = markAll(false), pct = Math.round(ok / n * 100);
  const r = $("ep-result");
  r.className = "feedback " + (pct === 100 ? "good" : "bad");
  r.innerHTML = `<div class="fb-verdict">${ok} of ${n} lines (${pct}%)${pct === 100 ? " — verbatim. Bravo Zulu." : ""}</div>`;
  try { const s = stats(); s.n++; if (pct === 100) s.perfect++; s.best[ep.id] = Math.max(s.best[ep.id] || 0, pct); localStorage.setItem(STAT_KEY, JSON.stringify(s)); } catch (e) {}
  renderStats();
  $("ep-submit").classList.add("hidden"); $("ep-show").classList.add("hidden");
  $("ep-next").classList.remove("hidden"); $("ep-next").focus();
}
function showEP() {
  graded = true; markAll(true);
  const r = $("ep-result"); r.className = "feedback"; r.innerHTML = `<div class="fb-verdict">Answer key shown — not scored.</div>`;
  $("ep-submit").classList.add("hidden"); $("ep-show").classList.add("hidden"); $("ep-next").classList.remove("hidden"); $("ep-next").focus();
}
function next() { pos++; if (pos >= order.length) { order = shuffle(EPS.map((_, i) => i)); pos = 0; } show(); }
$("ep-submit").addEventListener("click", grade);
$("ep-show").addEventListener("click", showEP);
$("ep-next").addEventListener("click", next);
document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  if (e.target.matches("#ep-lines input")) {
    e.preventDefault();
    const all = inputs(), i = all.indexOf(e.target);
    if (i < all.length - 1) all[i + 1].focus(); else grade();
  } else if (graded && !$("ep-next").classList.contains("hidden") && e.target.tagName !== "BUTTON") { next(); }
});
order = shuffle(EPS.map((_, i) => i)); renderStats(); show();
