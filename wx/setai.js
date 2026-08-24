// ============================================================
// SET AI ALTIMETRY DRILL
// Generates unlimited altimeter-error problems and grades the
// full SET AI worksheet from the Student Guide (Topic 1):
//   S — Situation (higher→lower or lower→higher pressure)
//   E — Error: 0.10 in-Hg = 100 ft (1.00 in-Hg = 1,000 ft)
//   T — True/MSL altitude = assigned ∓ error
//   A — Absolute/AGL altitude = MSL − field elevation
//   I — Indicated altitude on deck = field elevation ± error
// High to Low, Look Out Below · Low to High, Plenty of Sky
// ============================================================

const $ = id => document.getElementById(id);
const STAT_KEY = "nife-wx-setai";

let P = null;          // current problem
let situation = null;  // "hl" | "lh" (user's pick)
let solved = false;

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genProblem() {
  // Altimeter settings in a realistic band, always different from each
  // other so every problem has a definite situation and nonzero error.
  let dep, arr;
  do {
    dep = (2884 + rand(0, 216)) / 100;
    arr = (2884 + rand(0, 216)) / 100;
  } while (Math.abs(dep - arr) < 0.05);
  const assigned = rand(30, 100) * 100;        // 3,000–10,000 ft
  const field = rand(1, 20) * 100;             // 100–2,000 ft
  const err = Math.round(Math.abs(dep - arr) * 1000);
  const hl = arr < dep;                        // flying into lower pressure
  const msl = hl ? assigned - err : assigned + err;
  return {
    dep, arr, assigned, field, err, hl,
    msl,
    agl: msl - field,
    deck: hl ? field + err : field - err,
  };
}

function newProblem() {
  P = genProblem();
  situation = null;
  solved = false;
  $("gv-dep").textContent = P.dep.toFixed(2);
  $("gv-arr").textContent = P.arr.toFixed(2);
  $("gv-alt").textContent = P.assigned.toLocaleString();
  $("gv-field").textContent = P.field.toLocaleString();
  document.querySelectorAll("[data-sit]").forEach(b => b.classList.remove("selected"));
  document.querySelectorAll(".ws-step").forEach(r => r.classList.remove("row-right", "row-wrong"));
  document.querySelectorAll(".ws-step input").forEach(i => { i.value = ""; i.disabled = false; });
  $("sit-row").classList.remove("row-right", "row-wrong");
  $("solution").classList.add("hidden");
  $("verdict-line").textContent = "";
  renderStats();
}

function markRow(el, ok) {
  el.classList.remove("row-right", "row-wrong");
  el.classList.add(ok ? "row-right" : "row-wrong");
  return ok;
}

function numVal(id) {
  const raw = $(id).value.replace(/[,\s]/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function checkWork() {
  let right = 0;
  const sitOk = situation !== null && (situation === "hl") === P.hl;
  markRow($("sit-row"), sitOk); if (sitOk) right++;
  if (markRow($("row-err").closest(".ws-step"), numVal("row-err") === P.err)) right++;
  if (markRow($("row-msl").closest(".ws-step"), numVal("row-msl") === P.msl)) right++;
  if (markRow($("row-agl").closest(".ws-step"), numVal("row-agl") === P.agl)) right++;
  if (markRow($("row-deck").closest(".ws-step"), numVal("row-deck") === P.deck)) right++;
  const all = right === 5;
  $("verdict-line").textContent = all
    ? "All 5 correct — nicely done."
    : right + " of 5 correct — fix the red rows and check again, or show the solution.";
  $("verdict-line").style.color = all ? "var(--green-text)" : "var(--red-text)";
  if (all && !solved) { solved = true; bumpStats(true); renderStats(); }
  return all;
}

function showSolution() {
  if (!solved) { solved = true; bumpStats(false); renderStats(); }
  const dir = P.hl
    ? "higher pressure into LOWER pressure — “High to Low, Look Out Below”: you are LOWER than indicated"
    : "lower pressure into HIGHER pressure — “Low to High, Plenty of Sky”: you are HIGHER than indicated";
  const sign = P.hl ? "−" : "+";
  const deckSign = P.hl ? "+" : "−";
  $("solution").innerHTML =
    `<div class="review-h" style="margin-top:0;">Worked solution</div>` +
    `<p><b>S — Situation.</b> ${P.dep.toFixed(2)} → ${P.arr.toFixed(2)} in-Hg: ${dir}.</p>` +
    `<p><b>E — Error.</b> |${P.dep.toFixed(2)} − ${P.arr.toFixed(2)}| = ${Math.abs(P.dep - P.arr).toFixed(2)} in-Hg. ` +
    `At 1,000 ft per 1.00 in-Hg &rarr; <b>${P.err.toLocaleString()} ft</b>.</p>` +
    `<p><b>T — True/MSL altitude.</b> Assigned ${sign} error = ${P.assigned.toLocaleString()} ${sign} ${P.err.toLocaleString()} = <b>${P.msl.toLocaleString()} ft MSL</b>.</p>` +
    `<p><b>A — Absolute/AGL altitude.</b> MSL − field elevation = ${P.msl.toLocaleString()} − ${P.field.toLocaleString()} = <b>${P.agl.toLocaleString()} ft AGL</b>.</p>` +
    `<p><b>I — Indicated altitude on deck.</b> Field elevation ${deckSign} error = ${P.field.toLocaleString()} ${deckSign} ${P.err.toLocaleString()} = <b>${P.deck.toLocaleString()} ft</b>.</p>`;
  $("solution").classList.remove("hidden");
  // fill and grade the sheet so every row shows its correct value
  $("row-err").value = P.err;
  $("row-msl").value = P.msl;
  $("row-agl").value = P.agl;
  $("row-deck").value = P.deck;
  situation = P.hl ? "hl" : "lh";
  document.querySelectorAll("[data-sit]").forEach(b =>
    b.classList.toggle("selected", b.dataset.sit === situation));
  checkWork();
}

// ---------- session stats ----------
function loadStats() {
  try { return JSON.parse(localStorage.getItem(STAT_KEY) || "{\"done\":0,\"solo\":0}"); }
  catch (e) { return { done: 0, solo: 0 }; }
}
function bumpStats(unaided) {
  try {
    const s = loadStats();
    s.done++; if (unaided) s.solo++;
    localStorage.setItem(STAT_KEY, JSON.stringify(s));
  } catch (e) { /* no storage */ }
}
function renderStats() {
  const s = loadStats();
  $("drill-stats").textContent = s.done
    ? `${s.done} problem${s.done > 1 ? "s" : ""} completed on this browser · ${s.solo} without the solution`
    : "";
}

// ---------- wiring ----------
document.querySelectorAll("[data-sit]").forEach(btn => {
  btn.addEventListener("click", () => {
    situation = btn.dataset.sit;
    document.querySelectorAll("[data-sit]").forEach(b => b.classList.toggle("selected", b === btn));
    $("sit-row").classList.remove("row-right", "row-wrong");
  });
});
$("btn-check").addEventListener("click", checkWork);
$("btn-solve").addEventListener("click", showSolution);
$("btn-new").addEventListener("click", newProblem);
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.tagName === "INPUT") checkWork();
});

newProblem();
