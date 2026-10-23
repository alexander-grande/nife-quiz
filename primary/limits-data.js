// ============================================================
// PRIMARY — T-6B operating limits: every blank on page 5 of the
// T-6B EP & OP Limits Key (01 Aug 23, Change 2). Graded with gradeLimit
// from ../ground/data.js (same numbers in the same order; units optional),
// so load that first.
// id, ask (how the drill phrases it; ends in "…" or shows ____ when it
// reads as a fill-in), a (the key), unit (shown beside the drill box),
// words (key words a text answer must contain — "30 sec" vs "30 min")
// ============================================================
const T6_LIMITS = [
  // Engine operating limits table — TAKEOFF/MAX
  { id: "to-torque", unit: "%", ask: "Takeoff/Max — torque", a: "100 %" },
  { id: "to-itt", unit: "°C", ask: "Takeoff/Max — ITT max", a: "820 °C" },
  { id: "to-n1", unit: "%", ask: "Takeoff/Max — N<sub>1</sub> max", a: "104 %" },
  { id: "to-np", unit: "%", ask: "Takeoff/Max — N<sub>P</sub> max", a: "100 %" },
  { id: "to-oilp", unit: "psi", ask: "Takeoff/Max — oil pressure", a: "90 to 120 psi" },
  { id: "to-oilt", unit: "°C", ask: "Takeoff/Max — oil temperature", a: "10 to 105 °C" },
  // IDLE
  { id: "idle-torque", unit: "%", ask: "Idle — torque (ground)", a: "1 to 10 %" },
  { id: "idle-itt", unit: "°C", ask: "Idle — ITT max", a: "750 °C" },
  { id: "idle-n1-gnd", unit: "%", ask: "Idle — N<sub>1</sub> (ground)", a: "60 to 61 %" },
  { id: "idle-n1-flt", unit: "%", ask: "Idle — N<sub>1</sub> minimum (flight)", a: "67 %" },
  { id: "idle-np", unit: "%", ask: "Idle — N<sub>P</sub> (ground)", a: "46 to 50 %" },
  { id: "idle-oilp", unit: "psi", ask: "Idle — oil pressure minimum", a: "90 psi" },
  { id: "idle-oilt-gnd", unit: "°C", ask: "Idle — oil temperature (ground)", a: "-40 to 105 °C" },
  { id: "idle-oilt-flt", unit: "°C", ask: "Idle — oil temperature (flight)", a: "10 to 105 °C" },
  { id: "idle-oilt-7", unit: "°C", ask: "Idle — oil temperature acceptable for ground operation at and below 20% torque (note 7)", a: "106 to 110 °C" },
  // START
  { id: "start-itt", unit: "°C", ask: "Start — ITT range", a: "871-1000 °C" },
  { id: "start-itt-sec", unit: "sec", ask: "Start — time allowed at 871–1000 °C ITT", a: "5 sec" },
  { id: "start-oilp", unit: "psi", ask: "Start — oil pressure max", a: "200 psi" },
  { id: "start-oilt", unit: "°C", ask: "Start — oil temperature minimum", a: "-40 °C" },
  // TRANSIENT
  { id: "tr-torque", unit: "%", ask: "Transient — torque", a: "101 to 107 %" },
  { id: "tr-torque-sec", unit: "sec", ask: "Transient — time allowed at 101–107 % torque", a: "5 sec" },
  { id: "tr-itt", unit: "°C", ask: "Transient — ITT range", a: "821-870 °C" },
  { id: "tr-itt-sec", unit: "sec", ask: "Transient — time allowed at 821–870 °C ITT", a: "20 sec" },
  { id: "tr-n1", unit: "%", ask: "Transient — N<sub>1</sub> max", a: "104 %" },
  { id: "tr-np", unit: "%", ask: "Transient — N<sub>P</sub>", a: "110 %" },
  { id: "tr-np-sec", unit: "sec", ask: "Transient — time allowed at 110 % N<sub>P</sub>", a: "20 sec" },
  { id: "tr-oilp", unit: "psi", ask: "Transient — oil pressure", a: "40 to 130 psi" },
  { id: "tr-oilt", unit: "°C", ask: "Transient — oil temperature", a: "106 to 110 °C" },
  { id: "tr-oilt-min", unit: "min", ask: "Transient — time allowed at 106–110 °C oil temperature", a: "10 minutes" },
  // Notes
  // "+/-" is printed on the key with a blank either side (no ± key to type)
  { id: "n2", unit: "%", ask: "With PMU OFF, permissible maximum N<sub>P</sub> is ____ +/- 2 %", a: "100 %" },
  { id: "n2-tol", unit: "%", ask: "With PMU OFF, permissible maximum N<sub>P</sub> is 100 +/- ____ %", a: "2 %" },
  { id: "n4", unit: "% Np", ask: "Avoid stabilized ground operation from…", a: "62 to 80 % Np" },
  { id: "n5-psi", unit: "psi", ask: "Oil pressure permitted only during aerobatics or spins, with PCL at IDLE, for a few seconds (note 5)", a: "15 to 40 psi" },
  { id: "n5-sec", unit: "sec", ask: "How long 15–40 psi oil pressure is permitted with PCL at IDLE (note 5)", a: "5 sec" },
  { id: "n6-normal", unit: "psi", ask: "Normal oil pressure during steady state conditions", a: "90 to 120 psi" },
  { id: "n6-low", unit: "psi", ask: "Oil pressure at flight idle or above that is indicative of an oil system malfunction: less than…", a: "90 psi" },
  { id: "n7", unit: "% torque", ask: "Note 7 (idle oil temp 106–110 °C) is acceptable for ground operation at and below…", a: "20 %" },
  { id: "n8-gov", unit: "%", ask: "The PMU will govern maximum torque at ____ +/- 2 %", a: "100 %" },
  { id: "n8-gov-tol", unit: "%", ask: "The PMU will govern maximum torque at 100 +/- ____ %", a: "2 %" },
  { id: "n8-malf", unit: "%", ask: "Torque above this at a constant PCL setting and steady flight is indicative of a governing system malfunction", a: "102 %" },
  { id: "n10-range", unit: "%", ask: "With the PMU on, torque possible following rapid PCL movement or aerobatic maneuvers", a: "102 to 107 %" },
  { id: "n10-malf", unit: "%", ask: "With the PMU on, torque above this is a limiting system malfunction", a: "107 %" },
  // Airspeed limitations
  { id: "vle-vfe", unit: "KIAS", ask: "Maximum airspeed gear down (V<sub>LE</sub>) & flap down (V<sub>FE</sub>)", a: "150 KIAS" },
  { id: "vmo", unit: "KIAS", ask: "Max operating (V<sub>MO</sub>)", a: "316 KIAS" },
  { id: "mmo", unit: "Mach", ask: "Max Mach (M<sub>MO</sub>)", a: "0.67 Mach" },
  { id: "turb", unit: "KIAS", ask: "Turbulent air penetration speed, maximum", a: "207 KIAS" },
  // Starter cycle limitations — the unit is part of the blank, so it is graded
  { id: "starter-cycles", unit: "", ask: "Starter duty cycle is limited to four ____ cycles", a: "20 sec", words: ["sec"] },
  { id: "cool-1", unit: "", ask: "Cooling period after the first starter cycle", a: "30 sec", words: ["sec"] },
  { id: "cool-2", unit: "", ask: "Cooling period after the second starter cycle", a: "2 min", words: ["min"] },
  { id: "cool-3", unit: "", ask: "Cooling period after the third starter cycle", a: "5 min", words: ["min"] },
  { id: "cool-4", unit: "", ask: "Cooling period after the fourth starter cycle", a: "30 min", words: ["min"] },
  // Flight maneuvering limitations
  { id: "inverted", unit: "sec", ask: "Inverted flight", a: "60 sec" },
  { id: "zero-g", unit: "sec", ask: "Intentional zero G flight", a: "5 sec" },
  { id: "neg-g", unit: "sec", ask: "Negative G operations", a: "60 sec" },
  { id: "neg-25", unit: "sec", ask: "Do not exceed -2.5 G for longer than…", a: "30 sec" },
  { id: "pos-g-upright", unit: "sec", ask: "Minimum positive Gs upright before additional negative Gs", a: "60 sec" },
  // Acceleration limitations
  { id: "g-sym-clean", unit: "Gs", ask: "Acceleration limits — symmetric, clean", a: "+7.0 to -3.5 Gs" },
  { id: "g-sym-gear", unit: "Gs", ask: "Acceleration limits — symmetric, gear & flaps extended", a: "+2.5 to 0.0 Gs" },
  { id: "g-asym-clean", unit: "Gs", ask: "Acceleration limits — asymmetric, clean", a: "+4.7 to -1.0 Gs" },
  { id: "g-asym-gear", unit: "Gs", ask: "Acceleration limits — asymmetric, gear & flaps extended", a: "+2.0 to 0.0 Gs" },
  { id: "uncoord-g", unit: "G", ask: "Uncoordinated rolling maneuvers initiated at…", a: "-1 G" },
  { id: "uncoord-bank", unit: "°", ask: "Uncoordinated rolling maneuvers initiated at -1 G shall be limited to a bank angle change of…", a: "180°" },
  // Other limitations
  { id: "batt-start", unit: "volts", ask: "Minimum voltage for battery start", a: "23.5 volts" },
  { id: "xw-dry", unit: "knots", ask: "Max crosswind — dry runway", a: "25 knots" },
  { id: "xw-wet", unit: "knots", ask: "Max crosswind — wet runway", a: "10 knots" },
  { id: "xw-icy", unit: "knots", ask: "Max crosswind — icy runway", a: "5 knots" },
  { id: "tailwind", unit: "knots", ask: "Max tailwind component for takeoff", a: "10 knots" },
  { id: "fuel-flow", unit: "PPH", ask: "Maximum fuel flow (or less)", a: "799 PPH" },
  { id: "ice-ft", unit: "feet", ask: "The aircraft is approved only for transit through how many feet of ice", a: "5000 feet" },
  { id: "ice-type", unit: "", ask: "The aircraft is approved only for transit through 5000 feet of what kind of ice", a: "light rime", words: ["light", "rime"] },
  { id: "min-batt", unit: "volts", ask: "Minimum battery voltage", a: "22.0 volts" },
  { id: "hyd-low", unit: "psi", ask: "Hydraulic caution — below…", a: "1800 psi" },
  { id: "hyd-high", unit: "psi", ask: "Hydraulic caution — above…", a: "3500 psi" },
  { id: "fuel-caution", unit: "lbs", ask: "Fuel caution light — below how many pounds in the respective wing tank", a: "110 lbs" },
  { id: "press", unit: "psi", ask: "Cockpit pressurization schedule limit: ____ +/- 0.2 psi", a: "3.6 psi" },
  { id: "press-tol", unit: "psi", ask: "Cockpit pressurization schedule limit: 3.6 +/- ____ psi", a: "0.2 psi" },
];
