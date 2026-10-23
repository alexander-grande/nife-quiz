// ============================================================
// T-6B LIMITS SHEET — page 5 of the key with every blank fillable.
// The layout lives in limits-sheet.html; each [[id]] there becomes a
// box graded against T6_LIMITS with gradeLimit (../ground/data.js).
// ============================================================
const $ = id => document.getElementById(id);
const STAT_KEY = "nife-primary-limits-sheet";
const byId = Object.fromEntries(T6_LIMITS.map(l => [l.id, l]));
const plain = s => s.replace(/<[^>]+>/g, "");

function box(id) {
  const c = byId[id];
  if (!c) throw new Error(`limits-sheet: no limit "${id}" in T6_LIMITS`);
  const w = Math.max(4, c.a.replace(c.unit, "").trim().length + 2);   // sized to the key, like the blank on paper
  return `<span class="lim-f${c.text ? " lim-line" : ""}"><input type="text" data-lim="${id}"${c.text ? "" : ` style="width:${w}ch"`} aria-label="${plain(c.ask)}" autocomplete="off" spellcheck="false"></span>`;
}
$("lim-doc").innerHTML = $("lim-doc").innerHTML.replace(/\[\[([\w-]+)\]\]/g, (m, id) => box(id));
const inputs = () => [...document.querySelectorAll("input[data-lim]")];

function clearMarks() { inputs().forEach(i => i.classList.remove("gs-ok", "gs-bad")); document.querySelectorAll(".lim-key").forEach(k => k.remove()); }
function check() {
  clearMarks();
  let ok = 0;
  inputs().forEach(inp => {
    const c = byId[inp.dataset.lim], good = gradeLimit(c, inp.value);
    inp.classList.add(good ? "gs-ok" : "gs-bad");
    if (good) ok++;
    else { const k = document.createElement("span"); k.className = "lim-key"; k.textContent = c.a; inp.parentElement.appendChild(k); }
  });
  const n = inputs().length, pct = Math.round(ok / n * 100);
  $("sheet-score").textContent = `Limits ${ok}/${n} · ${pct}%`;
  try { const s = JSON.parse(localStorage.getItem(STAT_KEY) || "null") || { best: 0, n: 0 }; s.n++; s.best = Math.max(s.best, pct); localStorage.setItem(STAT_KEY, JSON.stringify(s)); } catch (e) {}
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function reveal() { clearMarks(); inputs().forEach(i => { i.value = byId[i.dataset.lim].a; }); $("sheet-score").textContent = "Answer key shown — clear the sheet to try again."; }
function clearSheet() { clearMarks(); inputs().forEach(i => { i.value = ""; }); $("sheet-score").textContent = ""; }

$("btn-check").addEventListener("click", check);
$("btn-check2").addEventListener("click", check);
$("btn-reveal").addEventListener("click", reveal);
$("btn-clear").addEventListener("click", clearSheet);
$("btn-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
// Tab and Enter go down each column of the engine table (all of TORQUE,
// then ITT, …), then through the rest of the sheet in page order.
const cellAt = inp => { const td = inp.closest("td"); return [td.cellIndex, td.parentElement.rowIndex]; };
const ORDER = [...document.querySelectorAll(".lim-table input")]
  .map((inp, k) => ({ inp, k, at: cellAt(inp) }))
  .sort((a, b) => a.at[0] - b.at[0] || a.at[1] - b.at[1] || a.k - b.k)   // column, then row, then order within the cell
  .map(x => x.inp)
  .concat(inputs().filter(i => !i.closest(".lim-table")));
document.addEventListener("keydown", e => {
  if ((e.key !== "Enter" && e.key !== "Tab") || !e.target.matches("input[data-lim]")) return;
  const i = ORDER.indexOf(e.target), j = e.key === "Tab" && e.shiftKey ? i - 1 : i + 1;
  if (j < 0 || j >= ORDER.length) { if (e.key === "Enter") e.preventDefault(); return; }   // Tab off either end leaves the sheet as usual
  e.preventDefault();
  ORDER[j].focus();
});
