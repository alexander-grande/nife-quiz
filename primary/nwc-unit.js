// Config for the T-6B EP Notes, Warnings & Cautions test — consumed by ../quiz.js.
// Sections are the 20 EPs (ref "EP N — …"); the setup screen can narrow a run
// to one EP through UNIT.subset().
const UNIT = {
  name: "T-6B EP NWCs",
  histPrefix: "nife-primary-nwc-hist-",
  chRe: /EP (\d+)/,
  chPrefix: "EP ",
  chWord: "EP",
  chapters: Object.fromEntries(T6_EPS.map((ep, i) => [i + 1, ep.short || ep.title])),
  subset() {
    const sel = document.getElementById("nwc-ep");
    const n = sel ? +sel.value : 0;
    if (!n) return null;
    const pool = TESTS[0].questions.map((q, i) => (q.ref.match(/EP (\d+)/) || [])[1] == n ? i : -1).filter(i => i >= 0);
    return { pool, label: "EP " + n + " only" };
  },
};
