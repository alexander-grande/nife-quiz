// ============================================================
// LIMITS DRILL — one box at a time, shuffled deck of all limits.
// ============================================================
const $ = id => document.getElementById(id);
const STAT_KEY = "nife-ground-limits";
let deck = [], pos = 0, missed = [], right = 0, answered = false;

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function stats() { try { return JSON.parse(localStorage.getItem(STAT_KEY) || "null") || { asked: 0, right: 0 }; } catch (e) { return { asked: 0, right: 0 }; } }
function bump(ok) { try { const s = stats(); s.asked++; if (ok) s.right++; localStorage.setItem(STAT_KEY, JSON.stringify(s)); } catch (e) {} renderStats(); }
function renderStats() { const s = stats(); $("drill-stats").textContent = s.asked ? `All-time on this browser: ${s.right}/${s.asked} (${Math.round(s.right / s.asked * 100)}%)` : ""; }

function start(pool) {
  deck = shuffle(pool || LIMITS); pos = 0; missed = []; right = 0;
  $("drill-done").classList.add("hidden"); $("drill-form").closest(".center-box").classList.remove("hidden");
  show();
}
function show() {
  answered = false;
  const cell = deck[pos];
  $("drill-progress").textContent = `Question ${pos + 1} of ${deck.length}`;
  $("drill-ask").innerHTML = cell.ask + "?";
  $("drill-unit").textContent = cell.unit || "";
  $("drill-input").placeholder = cell.unit ? "Number…" : "Type the limit…";
  $("drill-input").value = ""; $("drill-input").disabled = false; $("drill-submit").disabled = false;
  $("drill-result").className = "feedback hidden"; $("drill-result").innerHTML = "";
  $("drill-next").classList.add("hidden");
  $("drill-input").focus();
}
function submit() {
  if (answered) return;
  const cell = deck[pos], given = $("drill-input").value.trim();
  if (!given) { $("drill-input").focus(); return; }
  answered = true;
  const ok = gradeLimit(cell, given);
  if (ok) right++; else missed.push(cell);
  bump(ok);
  const r = $("drill-result");
  r.className = "feedback " + (ok ? "good" : "bad");
  r.innerHTML = `<div class="fb-verdict">${ok ? "Correct." : "Not quite."}</div><div><span class="ans-tag">Answer:</span> <b>${cell.a}</b></div>`;
  $("drill-input").disabled = true; $("drill-submit").disabled = true;
  $("drill-next").classList.remove("hidden"); $("drill-next").focus();
}
function next() {
  if (pos < deck.length - 1) { pos++; show(); return; }
  $("drill-form").closest(".center-box").classList.add("hidden");
  $("drill-done").classList.remove("hidden");
  $("drill-summary").textContent = `${right} of ${deck.length} correct (${Math.round(right / deck.length * 100)}%).` + (missed.length ? ` Missed: ${missed.map(m => m.ask.replace(/<[^>]+>/g, "")).join(", ")}.` : " Every box. That's the standard.");
  $("drill-missed").classList.toggle("hidden", missed.length === 0);
}
$("drill-form").addEventListener("submit", e => { e.preventDefault(); submit(); });
$("drill-next").addEventListener("click", next);
$("drill-skip").addEventListener("click", () => { if (!answered) { missed.push(deck[pos]); bump(false); } next(); });
$("drill-restart").addEventListener("click", () => start());
$("drill-missed").addEventListener("click", () => start(missed));
document.addEventListener("keydown", e => { if (e.key === "Enter" && answered && !$("drill-next").classList.contains("hidden")) { e.preventDefault(); next(); } });
renderStats(); start();
