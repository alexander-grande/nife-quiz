// ============================================================
// FILLABLE LIMITS / EPs SHEET — renders the quiz sheet from data.js,
// grades every box, reveals answers, remembers the best score.
// ============================================================
const $ = id => document.getElementById(id);
const byId = Object.fromEntries(LIMITS.map(l => [l.id, l]));
const COLS = ["Min", "Normal", "Caution", "Max"];
const STAT_KEY = "nife-ground-sheet";

function limitInput(id) { return `<span class="gs-field"><input type="text" data-limit="${id}" aria-label="${byId[id].ask.replace(/<[^>]+>/g, "")}"></span>`; }

function renderLimits() {
  let rows = "";
  INSTRUMENT_ROWS.forEach(r => {
    rows += `<tr><td class="gs-label">${r.row}</td>` + COLS.map(c => r.cells[c] ? `<td>${limitInput(r.cells[c])}</td>` : `<td class="gs-dead"></td>`).join("") + "</tr>";
  });
  rows += `<tr><td class="gs-label">Starter Duty Cycle</td><td colspan="4">${limitInput("starter")}</td></tr>`;
  $("inst-body").innerHTML = rows;
  let single = "";
  LIMITS.filter(l => l.col === "single").forEach(l => {
    const label = l.row.startsWith("Limit Load") ? l.row.replace("Limit Load Factors: ", "Limit load factor — ") : l.row;
    single += `<tr><td class="gs-label">${label}</td><td>${limitInput(l.id)}</td></tr>`;
  });
  $("single-body").innerHTML = single;
}

function renderEPs() {
  $("eps").innerHTML = EPS.map(ep => `<section class="gs-ep" aria-label="${ep.title}"><h3>${ep.title}</h3>` +
    ep.lines.map((l, i) => {
      const k = `${ep.id}:${i}`;
      if (l.type === "note") return `<div class="gs-step note">${l.text}</div>`;
      if (l.type === "decision") return `<div class="gs-step decision"><span class="gs-n">${l.plain ? "" : "&bull;"}</span><span class="gs-field"><input type="text" data-ep="${k}" data-part="text" placeholder="Decision line…" aria-label="${ep.title} decision line ${i + 1}"></span></div>`;
      return `<div class="gs-step"><span class="gs-n">*${l.n}.</span>` +
        `<span class="gs-field"><input type="text" data-ep="${k}" data-part="item" placeholder="Item" aria-label="${ep.title} step ${l.n} item"></span>` +
        `<span class="gs-field"><input type="text" data-ep="${k}" data-part="action" placeholder="${l.action ? "Action" : "(none)"}" aria-label="${ep.title} step ${l.n} action"></span></div>`;
    }).join("") + "</section>").join("");
}

function clearMarks() { document.querySelectorAll("input.gs-ok, input.gs-bad").forEach(i => i.classList.remove("gs-ok", "gs-bad")); document.querySelectorAll(".gs-key").forEach(k => k.remove()); }
function mark(input, ok, key) { input.classList.add(ok ? "gs-ok" : "gs-bad"); if (!ok && key) { const s = document.createElement("span"); s.className = "gs-key"; s.textContent = key; input.parentElement.appendChild(s); } }

function checkSheet() {
  clearMarks();
  let lOK = 0, lN = 0, eOK = 0, eN = 0;
  document.querySelectorAll("input[data-limit]").forEach(inp => {
    const cell = byId[inp.dataset.limit]; const ok = gradeLimit(cell, inp.value); lN++; if (ok) lOK++; mark(inp, ok, cell.a);
  });
  EPS.forEach(ep => ep.lines.forEach((l, i) => {
    if (l.type === "note") return;
    const k = `${ep.id}:${i}`;
    if (l.type === "decision") {
      const inp = document.querySelector(`input[data-ep="${k}"]`); const ok = epMatch(inp.value, l.text); eN++; if (ok) eOK++; mark(inp, ok, l.text); return;
    }
    const item = document.querySelector(`input[data-ep="${k}"][data-part="item"]`), act = document.querySelector(`input[data-ep="${k}"][data-part="action"]`);
    const okI = similarity(normEP(item.value), normEP(l.item)) >= 0.7;
    const okA = l.action ? similarity(normEP(act.value), normEP(l.action)) >= 0.85 : normEP(act.value) === "";
    eN++; if (okI && okA) eOK++;
    mark(item, okI, l.item); mark(act, okA, l.action || "(nothing)");
  }));
  const pct = Math.round((lOK + eOK) / (lN + eN) * 100);
  $("sheet-score").textContent = `Limits ${lOK}/${lN} · EP steps ${eOK}/${eN} · ${pct}%`;
  try { const s = JSON.parse(localStorage.getItem(STAT_KEY) || "null") || { best: 0, n: 0 }; s.n++; s.best = Math.max(s.best, pct); localStorage.setItem(STAT_KEY, JSON.stringify(s)); } catch (e) {}
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function reveal() {
  clearMarks();
  document.querySelectorAll("input[data-limit]").forEach(inp => { inp.value = byId[inp.dataset.limit].a; });
  EPS.forEach(ep => ep.lines.forEach((l, i) => {
    const k = `${ep.id}:${i}`;
    if (l.type === "decision") { document.querySelector(`input[data-ep="${k}"]`).value = l.text; }
    else if (l.type === "step") { document.querySelector(`input[data-ep="${k}"][data-part="item"]`).value = l.item; document.querySelector(`input[data-ep="${k}"][data-part="action"]`).value = l.action; }
  }));
  $("sheet-score").textContent = "Answer key shown — clear the sheet to try again.";
}

function clearSheet() { clearMarks(); document.querySelectorAll("input").forEach(i => { i.value = ""; }); $("sheet-score").textContent = ""; }

renderLimits(); renderEPs();
$("btn-check").addEventListener("click", checkSheet);
$("btn-check2").addEventListener("click", checkSheet);
$("btn-reveal").addEventListener("click", reveal);
$("btn-clear").addEventListener("click", clearSheet);
$("btn-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
// Enter moves to the next box instead of doing nothing
document.addEventListener("keydown", e => {
  if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;
  e.preventDefault();
  const all = [...document.querySelectorAll("main input[type=text]")]; const i = all.indexOf(e.target);
  if (i >= 0 && i < all.length - 1) all[i + 1].focus();
});
