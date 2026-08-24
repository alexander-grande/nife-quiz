// ============================================================
// GROUND SCHOOL — NIFE Cessna Limits / EPs (quiz sheet, Feb 2024)
// Transcribed from the official quiz answer key. Every drill on the
// Ground School pages grades against this file.
// ============================================================

// ---- Limits: the table. Each cell is one "box" an instructor could ask. ----
// id, ask (how the drill phrases it), a (exact text), plus the row/column it
// lives in so the fillable sheet can be rebuilt in the same layout.
const LIMITS = [
  // Instrument table — columns: min / normal / caution / max
  { id: "tach-normal", row: "Tachometer", col: "Normal", ask: "Tachometer — normal range", a: "2100-2450 RPM" },
  { id: "tach-max", row: "Tachometer", col: "Max", ask: "Tachometer — maximum", a: "2700 RPM" },
  { id: "oilt-normal", row: "Oil Temp", col: "Normal", ask: "Oil temperature — normal range", a: "100-245 °F" },
  { id: "oilt-max", row: "Oil Temp", col: "Max", ask: "Oil temperature — maximum", a: "245 °F" },
  { id: "oilp-min", row: "Oil Press", col: "Min", ask: "Oil pressure — minimum", a: "25 PSI" },
  { id: "oilp-normal", row: "Oil Press", col: "Normal", ask: "Oil pressure — normal range", a: "60-90 PSI" },
  { id: "oilp-max", row: "Oil Press", col: "Max", ask: "Oil pressure — maximum", a: "115 PSI" },
  { id: "oilq-min", row: "Oil Quantity", col: "Min", ask: "Oil quantity — minimum", a: "6 qts" },
  { id: "oilq-normal", row: "Oil Quantity", col: "Normal", ask: "Oil quantity — normal range", a: "6-7 qts" },
  { id: "oilq-max", row: "Oil Quantity", col: "Max", ask: "Oil quantity — maximum", a: "8 qts" },
  { id: "carb-caution", row: "Carb. Air Temp", col: "Caution", ask: "Carburetor air temperature — caution range", a: "-15 to 5 °C" },
  { id: "starter", row: "Starter Duty Cycle", col: "wide", ask: "Starter duty cycle", a: "Crank 10 sec, Cool 20 sec, after 3 cycles 10 min cooling", words: ["crank", "cool", "cycles", "cooling"] },
  // Single-value limits
  { id: "max-weight", row: "Max Weight", col: "single", ask: "Maximum gross weight", a: "2550 lbs" },
  { id: "baggage", row: "Baggage Allowance", col: "single", ask: "Baggage allowance", a: "120 lbs" },
  { id: "fuel", row: "Fuel Capacity", col: "single", ask: "Fuel capacity", a: "43 gal" },
  { id: "xwind", row: "Max Crosswind", col: "single", ask: "Maximum crosswind component", a: "15 kts" },
  { id: "aob", row: "Max Angle of Bank", col: "single", ask: "Maximum angle of bank", a: "60°" },
  { id: "ceiling", row: "Service Ceiling", col: "single", ask: "Service ceiling", a: "14,200 ft" },
  { id: "wingspan", row: "Wingspan", col: "single", ask: "Wingspan", a: "36 ft" },
  { id: "llf-up", row: "Limit Load Factors: Flaps Up", col: "single", ask: "Limit load factors — flaps up", a: "3.8 to -1.52 Gs" },
  { id: "llf-down", row: "Limit Load Factors: Flaps Down", col: "single", ask: "Limit load factors — flaps down", a: "3 to 0 Gs" },
  // V-speeds
  { id: "vne", row: "V<sub>NE</sub>", plain: "VNE", col: "single", ask: "V<sub>NE</sub> (never exceed)", a: "158 KIAS" },
  { id: "vno", row: "V<sub>NO</sub>", plain: "VNO", col: "single", ask: "V<sub>NO</sub> (max structural cruising)", a: "127 KIAS" },
  { id: "va", row: "V<sub>A</sub>", plain: "VA", col: "single", ask: "V<sub>A</sub> (maneuvering)", a: "105 KIAS" },
  { id: "vfe", row: "V<sub>FE</sub>", plain: "VFE", col: "single", ask: "V<sub>FE</sub> (max flaps extended)", a: "85 KIAS" },
  { id: "vy", row: "V<sub>Y</sub>", plain: "VY", col: "single", ask: "V<sub>Y</sub> (best rate of climb)", a: "73 KIAS" },
  { id: "vx", row: "V<sub>X</sub>", plain: "VX", col: "single", ask: "V<sub>X</sub> (best angle of climb)", a: "62 KIAS" },
  { id: "vglide", row: "V<sub>glide</sub>", plain: "Vglide", col: "single", ask: "V<sub>glide</sub> (best glide)", a: "68 KIAS" },
  { id: "vr", row: "V<sub>R</sub>", plain: "VR", col: "single", ask: "V<sub>R</sub> (rotation)", a: "55 KIAS" },
  { id: "vs", row: "V<sub>S</sub>", plain: "VS", col: "single", ask: "V<sub>S</sub> (stall, clean)", a: "50 KIAS" },
  { id: "vso", row: "V<sub>SO</sub>", plain: "VSO", col: "single", ask: "V<sub>SO</sub> (stall, landing configuration)", a: "40 KIAS" },
];

// Rows of the instrument table in sheet order, with which columns hold a box.
const INSTRUMENT_ROWS = [
  { row: "Tachometer", cells: { Normal: "tach-normal", Max: "tach-max" } },
  { row: "Oil Temp", cells: { Normal: "oilt-normal", Max: "oilt-max" } },
  { row: "Oil Press", cells: { Min: "oilp-min", Normal: "oilp-normal", Max: "oilp-max" } },
  { row: "Oil Quantity", cells: { Min: "oilq-min", Normal: "oilq-normal", Max: "oilq-max" } },
  { row: "Carb. Air Temp", cells: { Caution: "carb-caution" } },
];

// ---- Emergency procedures. Lines are graded in order. ----
// type "step": numbered critical memory item (item + action, action may be "")
// type "decision": bullet decision-continuation line
// type "note": explanatory line printed on the sheet (graded leniently, optional)
const EPS = [
  { id: "eng-fail-takeoff", title: "ENG FAIL AFTER TAKEOFF / FORCED LANDING", lines: [
    { type: "step", n: 1, item: "Airspeed", action: "68 KIAS" },
    { type: "step", n: 2, item: "Turn Towards Nearest Suitable Landing Site", action: "" },
    { type: "step", n: 3, item: "Fuel Selector", action: "OFF" },
    { type: "step", n: 4, item: "Mixture", action: "IDLE CUTOFF" },
    { type: "step", n: 5, item: "Flaps", action: "AS REQUIRED" },
    { type: "step", n: 6, item: "Mags", action: "OFF" },
    { type: "step", n: 7, item: "Master", action: "OFF" },
    { type: "step", n: 8, item: "Doors", action: "UNLATCHED" },
  ]},
  { id: "eng-fail-flight", title: "ENGINE FAILURE IN FLIGHT", lines: [
    { type: "step", n: 1, item: "Airspeed", action: "68 KIAS" },
    { type: "step", n: 2, item: "Turn Towards Nearest Suitable Landing Site", action: "" },
    { type: "decision", text: "If Restart Will Be Attempted" },
    { type: "step", n: 3, item: "Fuel Selector", action: "BOTH" },
    { type: "step", n: 4, item: "Mixture", action: "FULL RICH" },
    { type: "step", n: 5, item: "Throttle", action: "FULL" },
    { type: "step", n: 6, item: "Carb Heat", action: "ON" },
    { type: "step", n: 7, item: "Mags", action: "BOTH (Start if prop stopped)" },
    { type: "step", n: 8, item: "Master", action: "ON" },
    { type: "step", n: 9, item: "Primer", action: "IN/LOCKED" },
  ]},
  { id: "eng-fire-flight", title: "ENGINE FIRE IN FLIGHT", lines: [
    { type: "step", n: 1, item: "Fuel Selector", action: "OFF" },
    { type: "step", n: 2, item: "Mixture", action: "IDLE CUTOFF" },
    { type: "step", n: 3, item: "Declare", action: "MAYDAY" },
    { type: "step", n: 4, item: "Master", action: "OFF" },
    { type: "step", n: 5, item: "Cabin Heat / Air", action: "OFF" },
    { type: "step", n: 6, item: "Turn Towards Nearest Suitable Landing Site", action: "" },
  ]},
  { id: "abort-takeoff", title: "ABORT TAKEOFF", lines: [
    { type: "step", n: 1, item: "Throttle", action: "IDLE" },
    { type: "step", n: 2, item: "Brakes", action: "AS REQ" },
    { type: "step", n: 3, item: "Maintain Directional Control", action: "" },
    { type: "decision", text: "IF DUE TO FIRE/ENG FAIL" },
    { type: "step", n: 4, item: "Emergency Shutdown on Deck", action: "EXECUTE" },
  ]},
  { id: "emerg-shutdown", title: "EMERGENCY SHUTDOWN ON DECK", lines: [
    { type: "step", n: 1, item: "Fuel Selector", action: "OFF" },
    { type: "step", n: 2, item: "Mixture", action: "IDLE CUTOFF" },
    { type: "step", n: 3, item: "Mags", action: "OFF" },
    { type: "step", n: 4, item: "Master", action: "OFF" },
    { type: "step", n: 5, item: "Aircraft", action: "EVACUATE AS REQ" },
  ]},
  { id: "eng-fire-start", title: "ENGINE FIRE DURING START", lines: [
    { type: "step", n: 1, item: "Cranking", action: "CONTINUE" },
    { type: "note", text: "Continue until engine starts or until mags selected off." },
    { type: "decision", text: "IF ENGINE STARTS" },
    { type: "step", n: 2, item: "Throttle", action: "1700 RPM (5 sec)" },
    { type: "step", n: 3, item: "Emergency Shutdown On Deck", action: "EXECUTE" },
    { type: "decision", text: "IF ENGINE FAILS TO START" },
    { type: "step", n: 4, item: "Throttle", action: "FULL" },
    { type: "step", n: 5, item: "Emergency Shutdown on Deck", action: "EXECUTE" },
  ]},
  { id: "elec-fire-flight", title: "ELEC FIRE IN FLIGHT", lines: [
    { type: "step", n: 1, item: "Master", action: "OFF" },
    { type: "step", n: 2, item: "Avionics Power Switch", action: "OFF" },
    { type: "step", n: 3, item: "All Electrical Equipment", action: "OFF" },
    { type: "step", n: 4, item: "Vents / Cabin Air", action: "CLOSED" },
    { type: "decision", text: "IF FIRE REMAINS" },
    { type: "step", n: 5, item: "Fire Extinguisher", action: "ACTIVATE AS REQ" },
    { type: "step", n: 6, item: "Cabin Windows", action: "OPEN AS REQ" },
    { type: "step", n: 7, item: "Land As Soon As Possible", action: "" },
  ]},
];

// ---- Grading helpers ----
// Limits: an answer is right when it contains the same numbers, in order, as
// the key (units and punctuation optional). Text-only keys also require their
// key words. So "60 to 90", "60–90 psi", and "60-90" all match "60-90 PSI".
function numsOf(s) {
  return (String(s).replace(/[–—]/g, "-").replace(/,(?=\d{3})/g, "")
    .replace(/(\d)\s*-\s*(?=\d)/g, "$1 ")       // a dash between digits is a range, not a sign
    .match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
}
function gradeLimit(cell, given) {
  const g = String(given || "").trim();
  if (!g) return false;
  const want = numsOf(cell.a), got = numsOf(g);
  if (want.length !== got.length || want.some((v, i) => v !== got[i])) return false;
  if (cell.words) { const low = g.toLowerCase(); if (!cell.words.every(w => low.includes(w))) return false; }
  return true;
}

// EP text: normalize a typed line so casing, punctuation, numbering, bullets,
// and the common abbreviations don't count against the student.
function normEP(s) {
  return String(s || "").toLowerCase()
    .replace(/[*•·]/g, " ")
    .replace(/^\s*\d+[.):]?\s*/, "")            // leading step number
    .replace(/\bas required\b/g, "as req")
    .replace(/\bkias\b/g, "")
    .replace(/\bdegrees?\b/g, "")
    .replace(/\btowards\b/g, "toward")
    .replace(/[^a-z0-9/ ]+/g, " ")
    .replace(/\s+/g, " ").trim();
}
function epLineText(line) {
  if (line.type === "step") return (line.item + " " + line.action).trim();
  return line.text;
}
// similarity 0..1 (Levenshtein on normalized strings)
function similarity(a, b) {
  if (a === b) return 1; if (!a.length || !b.length) return 0;
  const m = a.length, n = b.length, d = new Array(n + 1);
  for (let j = 0; j <= n; j++) d[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = d[0]; d[0] = i;
    for (let j = 1; j <= n; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; }
  }
  return 1 - d[n] / Math.max(m, n);
}
// Align the student's lines to the expected lines in order (DP), then judge
// each expected line: ok if its matched line is >= 0.8 similar.
function gradeEP(ep, text) {
  const exp = ep.lines.map(l => normEP(epLineText(l)));
  const got = String(text || "").split(/\n+/).map(normEP).filter(Boolean);
  const m = exp.length, n = got.length;
  const S = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const P = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const sim = similarity(exp[i - 1], got[j - 1]);
    const diag = S[i - 1][j - 1] + sim, up = S[i - 1][j], left = S[i][j - 1];
    if (diag >= up && diag >= left) { S[i][j] = diag; P[i][j] = 1; } else if (up >= left) { S[i][j] = up; P[i][j] = 2; } else { S[i][j] = left; P[i][j] = 3; }
  }
  const match = new Array(m).fill(null);
  let i = m, j = n;
  while (i > 0 && j > 0) { if (P[i][j] === 1) { match[i - 1] = j - 1; i--; j--; } else if (P[i][j] === 2) i--; else j--; }
  const rawLines = String(text || "").split(/\n+/).map(s => s.trim()).filter(Boolean);
  return ep.lines.map((line, k) => {
    const gi = match[k];
    const sim = gi === null ? 0 : similarity(exp[k], got[gi]);
    return { line, expected: epLineText(line), given: gi === null ? "" : rawLines[gi], sim, ok: sim >= 0.8, graded: line.type !== "note" };
  });
}
