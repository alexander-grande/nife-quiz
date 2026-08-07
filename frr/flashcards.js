// ============================================================
// FLASHCARDS — must-know facts for NIFE Flight Rules & Regulations
// (NAVAVSCOLSCOM-SG-200 Unit 5, Q-9B-0178, 08NOV24). f = front, b = back.
// ============================================================
const CATEGORIES = ["Pubs & Priority", "Light Signals & Airfield", "Airspace", "Speeds & Minimums", "Aeromedical & CNAF Rules"];

const CARDS = [
  // ---- Pubs & Priority ----
  {c:"Pubs & Priority", f:"Priority of regulations (highest to lowest)", b:"1. Aircraft NATOPS Flight Manual\n2. CNAF M-3710.7\n3. FLIPs\n4. FAR Part 91"},
  {c:"Pubs & Priority", f:"NATOPS words: shall / should / may / will", b:"Shall = mandatory\nShould = recommended\nMay (and “need not”) = optional\nWill = futurity only, never a requirement"},
  {c:"Pubs & Priority", f:"Who publishes the AIM, and is it regulatory?", b:"The FAA. It is NON-regulatory, but consistent with FAR Part 91"},
  {c:"Pubs & Priority", f:"FLIPs — released by / where / applies to", b:"DoD / worldwide / all DoD aircraft\n(Includes en route charts, supplements, approach plates, general & area planning)"},
  {c:"Pubs & Priority", f:"The five areas where the Navy may depart from FAR Part 91", b:"Aircraft speed\nMinimum fuel\nAlternate airport weather\nSpecial mission\nLow-level mission requirements"},
  {c:"Pubs & Priority", f:"FAA vs CNAF definition of Pilot in Command", b:"FAA: responsible for the operation and safety of the aircraft during flight time; final authority\nCNAF: ASSIGNED BY THE UNIT COMMANDER (or delegated authority) for the safe, orderly flight and WELL-BEING OF THE CREW"},
  {c:"Pubs & Priority", f:"Mode 3 vs Mode C vs ADS-B Out", b:"Mode 3: four-digit code identifying the aircraft to ATC\nMode C: pressure altitude for deconfliction\nADS-B Out: broadcasts GPS position, altitude, ground speed to ground stations and aircraft once per second (In = weather/traffic to cockpit)"},
  {c:"Pubs & Priority", f:"Flight Service Station functions", b:"Pilot briefings, en route communications, some search and rescue, relays ATC clearances, originates NOTAMs, broadcasts weather, processes flight plans"},
  {c:"Pubs & Priority", f:"The Control Tower's three stations — and what ATIS is NOT", b:"Clearance Delivery, Ground, and Tower\nATIS is NOT a tower station — it is a continuous broadcast of recorded non-control information\nTower is the SOLE source of takeoff and landing clearance"},
  {c:"Pubs & Priority", f:"DD-175-1 weather brief validity", b:"3.0 hours past brief time, or ETD + 30 minutes — whichever is EARLIER"},
  {c:"Pubs & Priority", f:"DD Form 1801 vs FAA Form 7233-1", b:"DD 1801: non-local flights from U.S. airfields WITH a military operations department\nFAA 7233-1: U.S. airfields WITHOUT one\nAt a nonmilitary field, close your flight plan with FSS — canceling IFR does NOT close it"},
  {c:"Pubs & Priority", f:"Primary purpose of a flight plan", b:"Establishing a baseline for lost communication and lost/missing aircraft procedures"},

  // ---- Light Signals & Airfield ----
  {c:"Light Signals & Airfield", f:"Aldis lamp: STEADY GREEN", b:"In flight: cleared to land\nOn ground: cleared for takeoff"},
  {c:"Light Signals & Airfield", f:"Aldis lamp: FLASHING GREEN", b:"In flight: return for landing\nOn ground: cleared to taxi"},
  {c:"Light Signals & Airfield", f:"Aldis lamp: STEADY RED", b:"In flight: give way to other aircraft and continue circling\nOn ground: stop"},
  {c:"Light Signals & Airfield", f:"Aldis lamp: FLASHING RED", b:"In flight: airport unsafe — do not land\nOn ground: taxi clear of the runway"},
  {c:"Light Signals & Airfield", f:"Aldis lamp: FLASHING WHITE and ALTERNATING RED/GREEN", b:"Flashing white: return to starting point (ground only — not used in flight)\nAlternating red & green: exercise extreme caution (both)"},
  {c:"Light Signals & Airfield", f:"Runway numbering", b:"Magnetic azimuth of the centerline, rounded to the nearest ten degrees, from the direction of approach"},
  {c:"Light Signals & Airfield", f:"Airport sign color schemes", b:"Mandatory instruction: white on RED\nLocation: yellow on black with yellow border\nDirection/destination/information: black on YELLOW\nDistance remaining: white on black"},
  {c:"Light Signals & Airfield", f:"Runway and taxiway light colors", b:"Runway edge: white\nThreshold: green (approach side) / red overrun\nTaxiway edge: blue\nTaxiway centerline: green"},
  {c:"Light Signals & Airfield", f:"VASI indications", b:"Red over white: on glideslope\nAll white: too high\nAll red: too low"},
  {c:"Light Signals & Airfield", f:"PAPI vs VASI installation", b:"PAPI: SINGLE row of two or four lights, normally LEFT of the runway; visible ~5 mi day / up to 20 mi night\nVASI: near bar and far bar"},
  {c:"Light Signals & Airfield", f:"RCLS color sequence (last 3,000')", b:"White until the last 3,000'\nAlternating white and red for 2,000'\nRed for the final 1,000'\n(TDZL: two rows of WHITE bars for ~3,000' or to the midpoint)"},
  {c:"Light Signals & Airfield", f:"Military vs civilian rotating beacon", b:"Military: dual-peaked (two quick) white flashes alternating with green\nCivilian: single white flash alternating with green"},
  {c:"Light Signals & Airfield", f:"Windsock vs tetrahedron", b:"Windsock: large end points INTO the wind; free-swinging, shows velocity\nTetrahedron: spar points in the DIRECTION OF LANDING; aligned with the active runway, does NOT move with the wind"},
  {c:"Light Signals & Airfield", f:"Hold short line vs nonmovement area boundary", b:"Hold short: FOUR yellow lines (two solid, two dashed) — solid on the holding side; no part of the aircraft past it\nNonmovement boundary: TWO yellow lines — solid on the nonmovement side, dashed on the movement side"},
  {c:"Light Signals & Airfield", f:"Waveoff signal", b:"Means “DO NOT LAND” — mandatory except in an emergency"},
  {c:"Light Signals & Airfield", f:"Displaced threshold — what is the pavement behind it good for?", b:"Takeoffs in either direction, landings from the opposite direction only"},

  // ---- Airspace ----
  {c:"Airspace", f:"Class A airspace", b:"18,000' MSL up to and including FL600, including 12 nm off the coast\nIFR only — no VFR or VFR-on-top"},
  {c:"Airspace", f:"Class B airspace", b:"Surface to 10,000' MSL around the busiest airports\nRequires ATC clearance, private pilot minimum (or designated aviator), Mode C\nVFR mins: 3 SM, CLEAR OF CLOUDS"},
  {c:"Airspace", f:"Class C airspace dimensions", b:"Core: 5 nm radius, surface to 4,000' AGL\nShelf: 10 nm radius, 1,200' to 4,000' AGL\nEntry: two-way comms established = ATC responds with your SPECIFIC CALL SIGN"},
  {c:"Airspace", f:"Class D airspace", b:"Surface to 2,500' AGL\nExists only when the control tower is operating"},
  {c:"Airspace", f:"Class E airspace", b:"Begins at 14,500' MSL unless designated lower (700'/1,200' AGL), excluding airspace below 1,500' AGL\nNo specific pilot, equipment, or entry requirements — controlled airspace you volunteer for"},
  {c:"Airspace", f:"Victor airways vs jet routes", b:"Victor: 1,200' AGL up to but not including 18,000' MSL; 8 nm wide (4 each side)\nJet routes: 18,000' MSL to FL450; no defined width\nFL450 cap prevents NAVAID frequency interference"},
  {c:"Airspace", f:"Where is Mode C required?", b:"Class A, B, C\nAll airspace at/above 10,000' MSL\nWithin 30 nm of a Class B airport (surface to 10,000')\nAbove Class B/C ceilings up to 10,000'"},
  {c:"Airspace", f:"ADS-B Out requirement — and its unique exclusion", b:"Required in the same airspace as Mode C at/above 10,000' MSL, but EXCLUDES airspace at and below 2,500' AGL"},
  {c:"Airspace", f:"Special use airspace: which need permission?", b:"Prohibited: entry prohibited\nRestricted: prior approval from using/controlling authority required\nWarning: international airspace, NO permission required\nMOA: separates military training from IFR traffic\nAlert: equal responsibility for collision avoidance"},
  {c:"Airspace", f:"Right-of-way priority", b:"Aircraft in distress over everything\nThen by maneuverability, least first: Balloon > Glider > Airship > Airplane/Helicopter\nOvertaken aircraft has right of way; overtake by altering RIGHT\nHead-on: BOTH alter right"},

  // ---- Speeds & Minimums ----
  {c:"Speeds & Minimums", f:"FAR speed limits", b:"Below 10,000' MSL: 250 KIAS\nBeneath the lateral limits of Class B (and within 4 nm / 2,500' of a Class C or D primary airport): 200 KIAS"},
  {c:"Speeds & Minimums", f:"Maximum holding airspeeds", b:"Propeller (incl. turboprop): 175 KIAS\nTurbojet at or below 14,000' MSL: 230 KIAS\nTurbojet above 14,000' MSL: 265 KIAS\nHelicopter: 80 KIAS"},
  {c:"Speeds & Minimums", f:"VFR takeoff minimums and the definition of a ceiling", b:"Ceiling at least 1,000' AGL and visibility 3 SM or greater\nCeiling = lowest BROKEN or OVERCAST layer"},
  {c:"Speeds & Minimums", f:"VFR cruising altitudes (above 3,000' AGL)", b:"Magnetic course 0-179: ODD thousands + 500\nMagnetic course 180-359: EVEN thousands + 500\nAt or below 3,000' AGL: any altitude\nIFR: same semicircles, whole thousands — used for planning and in uncontrolled airspace"},
  {c:"Speeds & Minimums", f:"Class G VFR minimums (the 1-mile cases)", b:"Day, below 1,200' AGL: 1 SM, clear of clouds\nDay, above 1,200' and below 10,000' MSL: 1 SM, 500/1,000/2,000\nNight (below 10,000'): 3 SM, 500/1,000/2,000"},
  {c:"Speeds & Minimums", f:"VFR minimums at or above 10,000' MSL", b:"5 SM visibility\n1,000' below, 1,000' above, 1 SM horizontal from clouds"},
  {c:"Speeds & Minimums", f:"Aerobatic flight definition and where it's legal", b:"Definition: bank >60°, pitch >±45°, or >2.0 g (a NATOPS-conforming break doesn't count)\nLegal: at or above 1,500' AGL with 3 SM, not over congested areas/open-air assemblies, not in Class B/C/D/E for an airport or Federal airways\nTraining Command minimum: 5,000' AGL"},
  {c:"Speeds & Minimums", f:"CNAF minimum altitudes", b:"VFR fixed-wing: 500' above terrain or water\nIFR outside controlled airspace: 1,000' above highest obstacle within 22 miles of route; 2,000' over mountainous terrain\nFAR congested area: 1,000' above highest obstacle within 2,000' radius"},
  {c:"Speeds & Minimums", f:"Fuel reserve requirement", b:"Takeoff to destination plus 10% of planned fuel — never less than 20 minutes of flight\n(Turbine fixed-wing: computed at max endurance at 10,000' MSL)"},
  {c:"Speeds & Minimums", f:"Avoiding civil aircraft, noise-sensitive areas, and wildlife", b:"Civil/commercial aircraft: 500' vertically and/or 1 SM laterally\nNoise-sensitive, wilderness, and wildlife areas: avoid below 3,000' AGL"},

  // ---- Aeromedical & CNAF Rules ----
  {c:"Aeromedical & CNAF Rules", f:"Position lights", b:"Red left wing, green right wing, white aft\nOn 30 min before official sunset until 30 min after official sunrise — and any time visibility < 3 SM"},
  {c:"Aeromedical & CNAF Rules", f:"Anti-collision lights", b:"On before engine start until engine shutdown\nMay be off in clouds and when they hurt ground operations"},
  {c:"Aeromedical & CNAF Rules", f:"The alcohol rules", b:"12 hours from the mission brief (not takeoff) — but adherence does NOT guarantee freedom from effects\nVestibular effects can last 48 hours even at zero BAC\nAny detectable BAC or symptomatic hangover = grounded"},
  {c:"Aeromedical & CNAF Rules", f:"The three separate 12-hour aeromedical rules", b:"Alcohol: 12 hours brief-to-bottle\nImmunizations/injections: 12 hours (unless FS clears sooner)\nNutrition: eat within 12 hours preceding end of flight"},
  {c:"Aeromedical & CNAF Rules", f:"Crew rest and wakefulness numbers", b:"Opportunity for 8 hours uninterrupted sleep per 24-hour period\nPerformance drops after 16 hours awake; declines rapidly to 75% or less after 18"},
  {c:"Aeromedical & CNAF Rules", f:"Blood donation, caffeine, time zones", b:"450 cc blood: no flying or chamber runs for 4 DAYS\nCaffeine: 450 mg/day max (3-4 cups drip coffee)\nTime zones: 1 accommodation day per zone crossed IN EXCESS OF THREE"},
  {c:"Aeromedical & CNAF Rules", f:"Who approves drugs vs supplements? And the most treatable fatigue cause?", b:"Prescription and OTC drugs: Flight Surgeon\nNutritional/dietary supplements: BUMED\nMost treatable cause of fatigue: DEHYDRATION"},
  {c:"Aeromedical & CNAF Rules", f:"Overwater equipment rules", b:"Life preservers: worn below 1,000' over water (excluding normal departures/approaches)\nSEBD: carried by helicopter, tilt rotor, E-2, and C-2 aircrew overwater"},
  {c:"Aeromedical & CNAF Rules", f:"IMC per CNAF — beyond the weather minimums", b:"IMC also exists any time a visible horizon is not distinguishable"},
  {c:"Aeromedical & CNAF Rules", f:"Flat hatting and the careless/reckless standard", b:"Flat hatting: low altitude and/or high speed maneuvers for thrill purposes — prohibited\nCareless/reckless: it is not enough that no one IS endangered — what matters is what the affected person on the ground THINKS"},
  {c:"Aeromedical & CNAF Rules", f:"Unusual maneuvers in Class B, C, or D airspace", b:"Don't perform them, don't request them if not essential to the flight\nATC is not permitted to approve such a request — or to ask you to perform one"},
  {c:"Aeromedical & CNAF Rules", f:"Emergency deviation authority", b:"Both the FAR and CNAF M-3710.7 allow deviation from the rules during emergencies requiring immediate action — but be ready to answer to proper authorities"}
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
