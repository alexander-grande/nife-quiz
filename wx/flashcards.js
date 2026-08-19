// ============================================================
// FLASHCARDS — must-know facts for NIFE Aviation Weather, built from
// the "WEATHER Pumped and Dumped (NIFE 2025)" gouge deck and the SG.
// f = front, b = back, c = category.
// ============================================================
const CATEGORIES = ["Mnemonics & Dump Sheet", "Pressure & Altimetry", "Clouds & Fronts", "Hazards", "Reports & Advisories"];

const CARDS = [
  // ---- Mnemonics & Dump Sheet ----
  {c:"Mnemonics & Dump Sheet", f:"T.A.P.E.", b:"Air mass source regions:\nTropical\nArctic\nPolar\nEquatorial\n(Air masses are named by location, temperature, and moisture)"},
  {c:"Mnemonics & Dump Sheet", f:"F.O.C.T.", b:"The four methods of lifting:\nFrontal\nOrographic\nConvergence\nThermal (convective)"},
  {c:"Mnemonics & Dump Sheet", f:"H.I.M.E.L.T.", b:"Thunderstorm hazards:\nHail\nIcing\nMicrobursts\nExtreme turbulence\nLightning\nTornadoes\n(+ the gust front out ahead)"},
  {c:"Mnemonics & Dump Sheet", f:"SET AI (dump sheet!)", b:"The altimeter-error working order:\nSituation → Error → True altitude (MSL) → Absolute altitude (AGL) → Indicated altitude on deck\nMSL = assigned + error · AGL = MSL − field elev · On deck = field elev − error"},
  {c:"Mnemonics & Dump Sheet", f:"The frontal model table (dump sheet!)", b:"Warm front: 15 kts, toward NE, 90° shift SE→SW\nCold front: 20 kts, toward SE, 90° shift SW→NW\nOccluded: speed depends, toward NE, 180° shift SE→NW"},
  {c:"Mnemonics & Dump Sheet", f:"\"High to Low, Look Out Below\"", b:"Flying from high to low pressure (or warm to cold air): the altimeter reads HIGH — you are LOWER than indicated.\nLow to high: plenty of sky."},
  {c:"Mnemonics & Dump Sheet", f:"Buys Ballot's Law", b:"In the Northern Hemisphere, with the wind at your back, lower pressure is to your LEFT"},
  {c:"Mnemonics & Dump Sheet", f:"\"Out of the highs, into the lows\"", b:"Surface flow: air descends and diverges out of highs (clockwise, NH), converges and ascends into lows (counterclockwise).\nSurface winds cross the isobars at ~45°; gradient winds above 2,000' AGL parallel the isobars."},

  // ---- Pressure & Altimetry ----
  {c:"Pressure & Altimetry", f:"Atmosphere composition", b:"78% nitrogen, 21% oxygen, 1% other gases\nWater vapor: 0-5% by volume, separate from dry air\nNongaseous particles (dust, salt) = condensation nuclei"},
  {c:"Pressure & Altimetry", f:"The troposphere", b:"28,000' MSL (poles) to 55,000' MSL (equator); ~36,000' over the U.S.\nNearly all weather lives here. Temperature decreases and wind increases with altitude — up to 200 knots at the top.\nHigher in summer than winter."},
  {c:"Pressure & Altimetry", f:"Why the tropopause matters to aviators", b:"The strongest winds — the jet stream — occur just below it, bringing moderate to severe turbulence and wind shear.\nThe tropopause itself is the isothermal transition layer (temperature constant)."},
  {c:"Pressure & Altimetry", f:"Standard day + the two lapse rates", b:"29.92 in-Hg (1013.2 mb) and 15° C (59° F) at sea level\nTemperature: −2° C per 1,000 ft\nPressure: −1 in-Hg (34 mb) per 1,000 ft"},
  {c:"Pressure & Altimetry", f:"Altimeter error quick numbers", b:"1.00 in-Hg = 1,000 feet · 0.10 in-Hg = 100 feet\nTemperature: every 11° C off standard = 4% altimeter error\nNormal sea level pressures: 28 to 31 in-Hg"},
  {c:"Pressure & Altimetry", f:"Sea level pressure vs station pressure", b:"Station pressure: read directly at the field\nSLP: station pressure corrected to sea level (SP + field elevation via the lapse rate)\nSP is LESS than SLP when the station is above sea level"},
  {c:"Pressure & Altimetry", f:"The six altitudes", b:"Indicated: read off the altimeter\nCalibrated: indicated corrected for instrument error\nTrue (MSL): height above mean sea level\nAbsolute (AGL): height above terrain\nPressure: 29.92 set, above standard datum plane\nDensity: PA corrected for nonstandard temp — a performance index, not a height"},
  {c:"Pressure & Altimetry", f:"Hot & humid day — what happens?", b:"Air density DOWN → density altitude UP → thrust and lift DOWN → takeoff and landing distances LONGER\n(Cold and dry reverses all four)"},
  {c:"Pressure & Altimetry", f:"Dew point spread", b:"Spread = temperature − dew point.\nAt about 2° C (4° F) spread, RH is ~90% and moisture starts condensing into fog or clouds.\nDew point can never exceed the temperature."},

  // ---- Clouds & Fronts ----
  {c:"Clouds & Fronts", f:"Cloud height groups", b:"Low: surface to 6,500' AGL (no prefix)\nMiddle: 6,500-20,000' AGL (alto-)\nHigh: above 20,000' AGL (cirro-)\nSpecial: extensive vertical development\nClassified by the BASE height, not the top."},
  {c:"Clouds & Fronts", f:"Stratiform vs cumuliform", b:"Stratiform: stable air, smooth flight, continuous precipitation, poor visibility\nCumuliform: unstable air, rough flight, showery precipitation, good visibility between clouds\nNimbo-/nimbus = violent or heavy"},
  {c:"Clouds & Fronts", f:"Cumulonimbus vs nimbostratus", b:"Cumulonimbus: THE thunderstorm cloud — severe/extreme turbulence, hail, icing, lightning; heavy showers\nNimbostratus: thick, builds DOWNWARD to ~1,000' AGL bases — heavy continuous rain, moderate turbulence, NO thunder"},
  {c:"Clouds & Fronts", f:"The three precipitation characteristics", b:"Showers: sudden start/stop, abrupt changes — cumuliform\nContinuous: steady, gradual changes — stratiform\nIntermittent: starts and stops at least once in the hour — either cloud type"},
  {c:"Clouds & Fronts", f:"Stability by the lifted-parcel test", b:"Lifted air COLDER than surroundings → sinks back = stable\nWARMER → keeps rising = unstable (cumuliform, showers, turbulence)\nSAME temperature → stays put = neutral"},
  {c:"Clouds & Fronts", f:"The four frontal discontinuities", b:"Temperature, Dew point (moisture), Wind, and Pressure — used to locate and classify fronts.\nThe altimeter setting rises after frontal passage."},
  {c:"Clouds & Fronts", f:"Squall line", b:"A line of violent, fast-moving thunderstorms 50-300 miles AHEAD of a cold front, roughly parallel to it.\nDepicted as dashed, double-dotted red lines.\nNot the same as a gust front."},
  {c:"Clouds & Fronts", f:"Surface analysis chart front colors", b:"Cold: blue triangles\nWarm: red half circles\nStationary: alternating blue triangles / red half circles, opposite sides\nOccluded: purple, triangles and half circles mixed, same side"},
  {c:"Clouds & Fronts", f:"Occluded fronts", b:"Cold front overtakes a warm front (cold fronts are faster).\nNamed for which front stays in ground contact — COLD occlusions are most common.\nAligned NW-SE, move toward the NE, 180° wind shift."},

  // ---- Hazards ----
  {c:"Hazards", f:"Turbulence: intensities and durations", b:"Intensities: Light, Moderate, Severe, Extreme (extreme = declare an emergency and exit)\nDuration: Occasional < ⅓ of the time · Intermittent ⅓-⅔ · Continuous > ⅔\n(\"Trace\" is an ICING intensity, not turbulence)"},
  {c:"Hazards", f:"The four causes of turbulence", b:"Thermal (surface heating — drier surface, more turbulence)\nMechanical (terrain/buildings, ≤1,000' AGL for obstructions)\nFrontal (worst with fast cold fronts; not warm fronts)\nLarge-scale wind shear (CAT — usually above 15,000' MSL near the jet stream)"},
  {c:"Hazards", f:"Structural icing types and temperature bands", b:"Clear: 0 to −10° C, unstable/cumulus, large droplets — most severe, hardest to remove\nRime: −10 to −20° C, stable/stratus, tiny droplets freezing instantly — milky white\nMixed: −8 to −15° C — most frequently encountered\nFrost: on the ground; remove before flight (extends landing rollout too)"},
  {c:"Hazards", f:"What icing does to the aircraft", b:"INCREASES: drag, weight, stall speed, fuel consumption\nDECREASES: lift, thrust, range\nEscape: climb to colder than −20° C or descend to warmer temperatures"},
  {c:"Hazards", f:"Induction icing", b:"Forms in the engine air intake, where pressure drop cools the air — so it can occur at temperatures up to +10° C in high humidity.\nThe other engine icing type is compressor icing.\nPIREP icing intensities: trace, light, moderate, severe."},
  {c:"Hazards", f:"Fog: definition and the three requirements", b:"Based within 50' of the surface, over 20' thick, visibility below ⅝ SM.\nRequires: condensation nuclei, low temp/dew-point spread, light surface winds.\nRadiation fog burns off with the sun; advection fog does NOT — it needs a wind shift."},
  {c:"Hazards", f:"Thunderstorm formation and the gust front", b:"Four requirements: moisture, unstable air, lifting action, buildup through the freezing layer.\nGust front: dangerous gusty winds 5-20 miles ahead of the storm — never take off or land with a storm approaching.\nHail can be carried 10-20 miles downwind in clear air; lightning can strike outside the storm."},
  {c:"Hazards", f:"Microburst numbers", b:"Downdraft 2,000 to 6,000+ fpm · vortex ring winds 20-200 knots · only ¼-2½ miles across · lasts 5-10 minutes after ground contact\nVisual cues: virga, localized blowing dust, rain shafts, roll clouds\nMost dangerous during takeoff and landing"},
  {c:"Hazards", f:"Penetrating a microburst — the trap", b:"FIRST sign: IAS, AOA, and lift suddenly INCREASE from the headwind.\nThe instinct to pull power is fatal — moments later comes the tailwind and sink.\nCorrect reaction: maximum power, climbing attitude on the gyro."},
  {c:"Hazards", f:"Thunderstorm avoidance, in order", b:"1. Circumnavigate (best — 20 mi from severe storms)\n2. Over: 1,000' above the top per 10 kts of wind at the top\n3. Under: lower ⅓ between cloud base and ground\n4. Through (last resort): lower ⅓, straight through, no angle — the upper ⅔ is where hail and icing live"},

  // ---- Reports & Advisories ----
  {c:"Reports & Advisories", f:"METAR vs TAF", b:"METAR: hourly OBSERVATION (issued :55-:59 past the hour) — current conditions; the takeoff/landing criteria\nTAF: FORECAST issued every 6 hours, valid 24+ hours — the flight planning/destination tool"},
  {c:"Reports & Advisories", f:"METAR/TAF decode odds and ends", b:"\"9999\" = unlimited visibility (7+ SM)\nQNH2968INS = altimeter 29.68\n\"$\" at the end = maintenance check required on the equipment\nWind 27006KT = FROM 270° at 6 knots"},
  {c:"Reports & Advisories", f:"TAF change groups", b:"FM = rapid, permanent change from the stated date/time\nBECMG = gradual, permanent change — complete by the END time\nTEMPO = temporary conditions during the listed period, then back to prevailing"},
  {c:"Reports & Advisories", f:"Sky coverage and ceilings", b:"FEW 1/8-2/8 · SCT 3/8-4/8 · BKN 5/8-7/8 · OVC 8/8\nCeiling = lowest BKN or OVC layer, or vertical visibility (VV) into a total obscuration\nVV = indefinite ceiling — kills slant range visibility on approach"},
  {c:"Reports & Advisories", f:"The visibility family", b:"Prevailing: greatest visibility over at least HALF the horizon circle — the one on METARs/TAFs\nFlight: forward from the cockpit in flight\nSlant range: distance on final when the runway environment is in sight\nRVR: looking down the runway, in feet"},
  {c:"Reports & Advisories", f:"The five REQUIRED PIREPs", b:"1. Weather on an IFR approach differs from the latest observation\n2. Wind shear on departure or arrival\n3. When requested by ATC in flight\n4. Unusual or unforeseen weather\n5. Executing a missed approach"},
  {c:"Reports & Advisories", f:"Convective SIGMET", b:"Implies severe or greater turbulence, severe icing, and low-level wind shear.\nIssued hourly at H+55, valid up to 2 hours.\nAlways thunderstorm-related — that's what makes it \"convective.\""},
  {c:"Reports & Advisories", f:"Non-convective SIGMET vs AIRMET", b:"SIGMET: severe icing, severe/extreme turbulence, dust/sand below 3 SM, volcanic ash — valid 4 hrs (6 for hurricanes)\nAIRMET: less severe — moderate turbulence, LLWS below 2,000' AGL, surface winds >30 kts, widespread IFR — issued every 6 hrs, ≥3,000 sq mi"},
  {c:"Reports & Advisories", f:"Severe weather watches", b:"Severe Thunderstorm Watch: hail ≥1 inch, gusts ≥58 mph (50 kts), and/or a tornado\nTornado Watch adds multiple/intense tornado threat\nTypical watch: 20,000-40,000 sq miles, ~6-8 hours, from the Storm Prediction Center"},
  {c:"Reports & Advisories", f:"Radar and satellite limitations", b:"Ground radar: line-of-sight only; strongest echoes from large drops and hail; NEXRAD does NOT show icing, and mosaic imagery is 15-20 minutes older than the display says\nSatellite: not ground based; whiter clouds = thicker clouds"}
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
