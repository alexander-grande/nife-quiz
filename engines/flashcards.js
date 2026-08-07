// ============================================================
// FLASHCARDS — mnemonics and must-know facts for NIFE Engines
// (NAVAVSCOLSCOM-SG-200, Unit 3/5). f = front, b = back, c = category.
// ============================================================
const CATEGORIES = ["Mnemonics", "Numbers & Limits", "Fuel & Oil", "Electrical & Hydraulics", "Engines & Starts"];

const CARDS = [
  // ---- Mnemonics ----
  {c:"Mnemonics", f:"VFFV", b:"The four MECHANICAL MALFUNCTIONS that can cause a compressor stall:\nVariable inlet guide vanes / stator vanes\nFuel control unit (FCU)\nForeign Object Damage (FOD)\nVariable exhaust nozzle"},
  {c:"Mnemonics", f:"VDBV", b:"The four DESIGN FEATURES that minimize compressor stalls:\nVariable inlet guide vanes / stator vanes\nDual / twin / split-spool compressor\nBleed valves\nVariable exhaust nozzle"},
  {c:"Mnemonics", f:"SEAM", b:"Purposes of the hydraulic ACCUMULATOR:\nShock absorber\nEmergency use\nAssistance in peak operations\nMaintains pressure during shutdown (with the check valve)"},
  {c:"Mnemonics", f:"SHAFT", b:"Purposes of the hydraulic RESERVOIR:\nStorage\nHeat dissipation\nAeration removal\nForeign matter trap\nThermal expansion"},
  {c:"Mnemonics", f:"ICE-TG", b:"Order of the airspeeds:\nIndicated → Calibrated → Equivalent → True → Ground"},
  {c:"Mnemonics", f:"The “4-H Club”", b:"Worst conditions for takeoff and landing:\nHigh, Hot, Heavy, and Humid"},

  // ---- Numbers & Limits ----
  {c:"Numbers & Limits", f:"Standard day conditions", b:"29.92 in-Hg and 15 °C at sea level"},
  {c:"Numbers & Limits", f:"How much can thrust vary on a hot or cold day?", b:"Up to 20% from standard rated thrust"},
  {c:"Numbers & Limits", f:"Where does the isothermal layer begin, and why does it matter?", b:"~36,000 ft. Temperature stabilizes there, so it no longer offsets the density drop — thrust decreases MORE rapidly above it"},
  {c:"Numbers & Limits", f:"Primary vs secondary air in the combustion chamber", b:"Primary: 25%, used for combustion\nSecondary: 75%, used for cooling and flame control"},
  {c:"Numbers & Limits", f:"How much energy does the gas generator turbine extract?", b:"~75% of the total energy leaving the burner (to drive the compressor and accessories)"},
  {c:"Numbers & Limits", f:"Turbofan thrust split", b:"Fan: 30–60% of total thrust\nGas generator exhaust: the remaining 40–70%"},
  {c:"Numbers & Limits", f:"Turboprop thrust split and speed limit", b:"~90% from the propeller, ~10% from exhaust gases\nLimited to approximately 450 knots"},
  {c:"Numbers & Limits", f:"Afterburner numbers", b:"Thrust increase of 50% or more, for ~300% more fuel\nOn a turbojet it burns SECONDARY air from the burner section (turbofan: secondary + bypass air)"},
  {c:"Numbers & Limits", f:"Compression ratios: centrifugal vs axial", b:"Centrifugal: 6:1 to 7:1\nModern axial: approaching 15:1 (near 25:1 on high-performance engines)"},
  {c:"Numbers & Limits", f:"Takeoff and landing speed margins", b:"Minimum takeoff speed: 20% above power-off stall speed\nLanding speed: 30% above stall speed"},
  {c:"Numbers & Limits", f:"Which rated thrust has a time limit?", b:"Military Rated Thrust (MRT) — normally 30 minutes\nNRT has no limit; CRT (afterburner) is not based on turbine temperature"},
  {c:"Numbers & Limits", f:"How much bleed air is available for accessories?", b:"1 to 4% of total airflow, bled through ports along the compressor case and at the end of the diffuser"},
  {c:"Numbers & Limits", f:"Typical military hydraulic system pressure", b:"~3,000 PSI"},
  {c:"Numbers & Limits", f:"T-6B reduction gearbox speeds", b:"Power turbine output of over 30,000 RPM reduced to a propeller speed of 2,000 RPM (two-stage planetary drive)"},
  {c:"Numbers & Limits", f:"TSFC ranking, highest to lowest", b:"Turbojet (worst) → Turbofan → Turboprop (best)\nHigher bypass ratio = lower TSFC"},
  {c:"Numbers & Limits", f:"Bypass ratios: fighter vs cargo aircraft", b:"Fighters (F/A-18): low bypass, near 1:1\nCargo/airliners: high bypass for low TSFC and heavy takeoffs"},
  {c:"Numbers & Limits", f:"Boundary layer thickness at the leading edge", b:"Usually no more than 1 millimeter"},
  {c:"Numbers & Limits", f:"What pressure does the breather pressurizing valve maintain?", b:"~29.92 in-Hg in the oil tank and bearing compartments — open at sea level, closes gradually with altitude"},

  // ---- Fuel & Oil ----
  {c:"Fuel & Oil", f:"Fuel flash points, lowest to highest", b:"Avgas: −45 °F\nJP-4: −35 °F\nJP-8: 100 °F\nJP-5: 140 °F"},
  {c:"Fuel & Oil", f:"Why is JP-5 used aboard ship?", b:"High flash point (140 °F) and low volatility — meets Navy shipboard storage safety requirements"},
  {c:"Fuel & Oil", f:"Avgas dye colors", b:"Avgas 100LL: blue\nAvgas 100: green"},
  {c:"Fuel & Oil", f:"Fuel flow gauge reads in…", b:"Pounds per hour (PPH), from the transmitter at the FCU outlet"},
  {c:"Fuel & Oil", f:"The four inputs the FCU computing system senses", b:"Compressor Inlet Temperature (CIT)\nCompressor RPM\nTurbine temperature (ITT)\nPCL position"},
  {c:"Fuel & Oil", f:"At engine shutdown, what cuts off fuel and what drains the manifolds?", b:"The FCU cuts off fuel flow\nThe P&D valve drains the combustion manifolds (prevents fires, hot starts, and gum deposits)"},
  {c:"Fuel & Oil", f:"The three subsystems of a dry sump lubrication system", b:"Pressure, scavenge, and breather pressurizing"},

  // ---- Electrical & Hydraulics ----
  {c:"Electrical & Hydraulics", f:"Transformer rectifier vs inverter", b:"TR: converts AC into DC\nInverter: converts DC into AC (the backup AC source if the generator fails)"},
  {c:"Electrical & Hydraulics", f:"Which equipment goes on which bus?", b:"Essential bus: flight safety (primary attitude gyro)\nPrimary bus: mission equipment (radar)\nMonitor/secondary bus: convenience (cabin lighting)\nThe DC essential bus charges the battery"},
  {c:"Electrical & Hydraulics", f:"What does the constant speed drive (CSD) do?", b:"Provides a constant generator input RPM regardless of engine RPM — keeping AC voltage and frequency steady"},
  {c:"Electrical & Hydraulics", f:"Pressure regulator vs unloader valve", b:"Regulator: diverts EXCESS pump flow back to the reservoir to hold set pressure\nUnloader: diverts ALL pump flow back once preset pressure is reached\nRequired with constant displacement pumps"},
  {c:"Electrical & Hydraulics", f:"What does a hydraulic fuse do?", b:"Detects a rupture or leak and prevents excessive fluid loss while letting the remaining subsystems operate"},

  // ---- Engines & Starts ----
  {c:"Engines & Starts", f:"Brayton cycle vs Otto cycle", b:"Both: intake, compression, combustion, exhaust\nBrayton (gas turbine): all four occur SIMULTANEOUSLY, throughout the engine\nOtto (reciprocating): SEQUENTIALLY, within a single piston"},
  {c:"Engines & Starts", f:"Gas turbine starting sequence", b:"Airflow → Ignition → Fuel\n(Starter spins the compressor first — prevents an explosion at light-off)"},
  {c:"Engines & Starts", f:"The four abnormal starts", b:"Hot: max turbine temperature exceeded\nHung: temperature rising, RPM stuck below normal\nFalse: RPM below normal, temperature within limits\nWet: no initial light-off — an ignition problem and the MOST DANGEROUS"},
  {c:"Engines & Starts", f:"Ignitor plugs", b:"Normally two per engine\nThe constrained-gap plug arcs beyond the chamber liner face, so it runs cooler than the annular-gap plug"},
  {c:"Engines & Starts", f:"What is a free (power) turbine?", b:"A turbine aft of the gas generator turbines that is NOT mechanically connected to the compressor — it drives the prop/rotor via its own shaft"},
  {c:"Engines & Starts", f:"Turboprop beta range", b:"Ground operations only: PCL from flight idle to max reverse, mechanically linked to the pitch change assembly\nAlpha is the flight range (the T-6B has no beta range)"},
  {c:"Engines & Starts", f:"Afterburner components and their jobs", b:"Spray bars: introduce fuel\nFlame holders: create eddies for stable combustion\nScreech liner: corrugated, perforated sleeve that absorbs violent pressure fluctuations"},
  {c:"Engines & Starts", f:"The three components of every gas generator", b:"Compressor, combustion chamber, turbine\n(Add an inlet and exhaust to make a turbojet)"},
  {c:"Engines & Starts", f:"Compressor stall: indications and first reaction", b:"Indications (PCL constant): RPM decrease, ITT increase, loud bangs\nFirst reaction: reduce aircraft attitude to lower the inlet's angle of attack, THEN retard the PCL"}
];

// ============================================================
// LOGIC
// ============================================================
let deck = [];
let idx = 0;
let flipped = false;
let activeCat = "All";

const $f = id => document.getElementById(id);

function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  deck = shuffleArr(activeCat === "All" ? CARDS : CARDS.filter(c => c.c === activeCat));
  idx = 0;
  flipped = false;
  renderCard();
}

function renderCard() {
  const card = deck[idx];
  $f("fc-cat").textContent = card.c;
  $f("fc-front-text").textContent = card.f;
  $f("fc-back-text").textContent = card.b;
  $f("fc-inner").classList.toggle("flipped", flipped);
  $f("fc-counter").textContent = (idx + 1) + " / " + deck.length;
  $f("btn-fc-prev").disabled = idx === 0;
  $f("btn-fc-next").disabled = idx === deck.length - 1;
}

function flip() { flipped = !flipped; renderCard(); }
function next() { if (idx < deck.length - 1) { idx++; flipped = false; renderCard(); } }
function prev() { if (idx > 0) { idx--; flipped = false; renderCard(); } }

// category chips
const catBar = $f("cat-bar");
["All", ...CATEGORIES].forEach(cat => {
  const btn = document.createElement("button");
  btn.className = "word" + (cat === "All" ? " picked" : "");
  btn.textContent = cat;
  btn.addEventListener("click", () => {
    activeCat = cat;
    catBar.querySelectorAll(".word").forEach(b => b.classList.toggle("picked", b === btn));
    buildDeck();
  });
  catBar.appendChild(btn);
});

$f("fc-card").addEventListener("click", flip);
$f("btn-fc-next").addEventListener("click", e => { e.stopPropagation(); next(); });
$f("btn-fc-prev").addEventListener("click", e => { e.stopPropagation(); prev(); });
$f("btn-fc-shuffle").addEventListener("click", buildDeck);

document.addEventListener("keydown", e => {
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
  else if (e.key === "ArrowRight") next();
  else if (e.key === "ArrowLeft") prev();
});

buildDeck();
