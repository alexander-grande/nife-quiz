// Per-test configuration for the STAN Exam Practice Test — consumed by ../quiz.js
// Kept separate from unit.js so the STAN test gets its own section names and
// its own attempt history (nife-stan-hist-0) without touching the ground school test.
const UNIT = {
  name: "STAN Exam",
  histPrefix: "nife-stan-hist-",
  chRe: /Sec (\d)/,
  chPrefix: "Sec ",
  chapters: {
    1: "SOP Weather, Altitudes & Field Limits",
    2: "Airspace, Comms & Required Equipment",
    3: "Aircraft Systems & Limits",
    4: "FTI Maneuvers & Procedures",
    5: "CRM, ORM & Aeromedical",
    6: "Mishaps, Investigations & Reporting"
  }
};
