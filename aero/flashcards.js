// ============================================================
// FLASHCARDS — must-know facts for NIFE Aerodynamics
// (NAVAVSCOLSCOM-SG-200, Module/Unit 2, 01AUG2020).
// f = front, b = back, c = category.
// ============================================================
var CATEGORIES = ["Definitions & Airspeeds", "Lift & Airfoils", "Drag & L/DMAX", "Stalls & Spins", "Performance & Power Curve", "Maneuvering & Hazards"];

var CARDS = [
  // ---- Definitions & Airspeeds ----
  {c:"Definitions & Airspeeds", f:"Equilibrium vs trimmed flight", b:"Equilibrium: sum of FORCES and sum of MOMENTS about the CG both = zero\nTrimmed: sum of moments = zero only\nEquilibrium is ALWAYS trimmed; trimmed is only MAYBE equilibrium"},
  {c:"Definitions & Airspeeds", f:"General Gas Law", b:"P = ρRT\nPressure constant → density and temperature inversely related\nDensity constant + temperature up → pressure up (pressure cooker)"},
  {c:"Definitions & Airspeeds", f:"Average lapse rate", b:"Temperature falls 2 °C (3.57 °F) per 1,000 ft\nContinues up to approximately 36,000 ft"},
  {c:"Definitions & Airspeeds", f:"Three things reduced when air density drops", b:"POWER — the engine takes in less air\nTHRUST — the propeller is less efficient in thin air\nLIFT — thin air exerts less force on the airfoils"},
  {c:"Definitions & Airspeeds", f:"Humidity and density", b:"Humidity up → density DOWN\nWater molecules displace an equal number of air molecules but have less mass"},
  {c:"Definitions & Airspeeds", f:"ICE-TG (order of the airspeeds)", b:"Indicated → Calibrated → Equivalent → True → Ground\nCAS = IAS corrected for instrument error\nEAS = CAS corrected for compressibility\nTAS = EAS corrected for density\nGS = TAS ± wind component"},
  {c:"Definitions & Airspeeds", f:"Bernoulli's equation", b:"PT = PS + q  (q = ½ρV²)\nStatic pressure = potential energy; dynamic pressure = kinetic energy\nTotal pressure is constant in a closed system — one rises, the other falls"},
  {c:"Definitions & Airspeeds", f:"Continuity equation", b:"A1V1 = A2V2\nArea and velocity are INVERSELY related at any point in a streamtube"},
  {c:"Definitions & Airspeeds", f:"TAS vs IAS with altitude", b:"Climbing at constant IAS → TAS increases (density is falling)\nTAS = IAS only at sea level on a standard day"},

  // ---- Lift & Airfoils ----
  {c:"Lift & Airfoils", f:"The lift equation", b:"L = ½ ρ V² S CL\nEight factors: density, velocity, surface area, compressibility, aspect ratio, viscosity, AOA, camber\n(the last five are folded into CL)"},
  {c:"Lift & Airfoils", f:"CL factors the pilot can directly control", b:"AOA — the most important and easiest to change\nCamber — changed with the flaps\n(No control over viscosity or compressibility)"},
  {c:"Lift & Airfoils", f:"AOA vs velocity in level flight", b:"INVERSELY related — increase AOA, velocity must decrease\nOtherwise lift exceeds weight and the airplane climbs"},
  {c:"Lift & Airfoils", f:"CLmax / critical AOA", b:"Greatest coefficient of lift = the most effective AOA\nAny AOA increase beyond it DECREASES CL (the stall region)\nStalling AOA is constant for a given airfoil"},
  {c:"Lift & Airfoils", f:"What flaps do", b:"Increase positive camber (chord line changes)\nStalling (CLmax) AOA DECREASES\nFlatter takeoff/landing attitudes improve visibility"},
  {c:"Lift & Airfoils", f:"Airfoil geometry terms", b:"Mean camber line: halfway between upper and lower surfaces\nChordline: straight line through leading and trailing edges\nCamber: max distance between MCL and chordline\nPositively cambered airfoil lifts at zero AOA; symmetric does not"},
  {c:"Lift & Airfoils", f:"Chordwise vs spanwise flow", b:"Chordwise (perpendicular to the leading edge): the ONLY flow accelerated over the wing → the only flow that makes lift\nSpanwise (root to tip): produces no lift, feeds the wingtip vortices"},
  {c:"Lift & Airfoils", f:"AOA vs pitch attitude vs angle of incidence", b:"AOA: relative wind to chordline\nPitch attitude: longitudinal axis to horizon\nIncidence: longitudinal axis to chordline (fixed by design)\nNEVER infer AOA, flight path, or relative wind from pitch attitude"},
  {c:"Lift & Airfoils", f:"The three axes", b:"Longitudinal (nose-tail): ROLL\nLateral (wingtip-wingtip): PITCH\nVertical: YAW\nAll three intersect at the center of gravity"},
  {c:"Lift & Airfoils", f:"Aerodynamic center", b:"Point on the chordline where all CHANGES in aerodynamic force take place\n~25% chord on a subsonic airfoil (point of max thickness / most positive camber)"},
  {c:"Lift & Airfoils", f:"Directions of lift and drag", b:"Lift: PERPENDICULAR to the relative wind\nDrag: PARALLEL to and in the same direction as the relative wind"},

  // ---- Drag & L/DMAX ----
  {c:"Drag & L/DMAX", f:"Total drag", b:"DT = DP + DI (parasite + induced)\nParasite dominates above L/DMAX, induced dominates below it"},
  {c:"Drag & L/DMAX", f:"Parasite drag components", b:"FORM drag: flow separation → low-pressure wake (easiest to reduce — streamline the shape)\nFRICTION drag: skin friction (hardest to reduce — glossy flat finish, no rivet heads)\nParasite drag ∝ V²: double the speed → 4x the drag"},
  {c:"Drag & L/DMAX", f:"Induced drag", b:"The by-product of lift: vortices and downwash tilt the lift vector aft\nVaries INVERSELY with airspeed\nReduced by increasing density, velocity, or wingspan — or with winglets, tip tanks, missile rails"},
  {c:"Drag & L/DMAX", f:"L/DMAX facts", b:"Bottom of the total drag curve = minimum total drag\nParasite drag = induced drag there\nMost EFFICIENT AOA (wing efficiency, not engine)\nNOT maximum lift, NOT maximum speed\nFlown for max range (props) and max glide range"},
  {c:"Drag & L/DMAX", f:"Boundary layer", b:"Layer of airflow slowed by viscosity; ~1 mm thick at the leading edge\nLaminar: little friction, separates EASILY\nTurbulent: more friction, adheres better — DELAYS separation"},
  {c:"Drag & L/DMAX", f:"Pressure gradients on the airfoil", b:"FAVORABLE: leading edge → point of max thickness (helps the boundary layer)\nADVERSE: max thickness → trailing edge (impedes it; strongest at high AOA)\nSeparation point moving forward → suction lost → CL drops → stall"},
  {c:"Drag & L/DMAX", f:"Ground effect", b:"Within about ONE WINGSPAN of the surface\nWeaker vortices → less downwash → less induced drag and less thrust required\nNo direct effect on parasite drag\nExcess speed at the flare → 'float'"},

  // ---- Stalls & Spins ----
  {c:"Stalls & Spins", f:"Stall: definition, cause, recovery", b:"Definition: an increase in AOA produces a DECREASE in CL\nOnly cause: excessive AOA (beyond CLmax AOA)\nOnly required recovery action: decrease AOA below CLmax AOA"},
  {c:"Stalls & Spins", f:"Stall speed (VS)", b:"Minimum TRUE airspeed to maintain level flight at CLmax AOA\nGreatest factors: weight, altitude, power, maneuvering, configuration"},
  {c:"Stalls & Spins", f:"Stall speed relationships", b:"Weight down (burn fuel / dump / drop ordnance) → VS down\nAltitude up → TRUE VS up, INDICATED VS unchanged\nPower-on VS < power-off VS (vertical thrust component + propwash lift)\nFlaps down → VS down"},
  {c:"Stalls & Spins", f:"Two requirements for a spin", b:"1) The airplane must be STALLED\n2) YAW must be present\nWithout both, no spin — yaw can be pilot induced or from wake turbulence"},
  {c:"Stalls & Spins", f:"Spin aerodynamics (autorotation)", b:"Inside (down-going) wing: higher AOA, MORE stalled, MORE drag\nOutside (up-going) wing: lower AOA, less stalled, less drag\nThe drag differential sustains the yaw → self-propagating roll + yaw"},
  {c:"Stalls & Spins", f:"Spin recovery", b:"Correct BOTH causes:\nReduce AOA — break the stall\nOpposite rudder — stop the yaw"},
  {c:"Stalls & Spins", f:"Takeoff and landing speed margins", b:"Minimum takeoff speed: 20% above POWER-OFF stall speed\nLanding speed: 30% above stall speed (low altitude + low power = bigger margin)"},

  // ---- Performance & Power Curve ----
  {c:"Performance & Power Curve", f:"The 4-H Club", b:"Worst takeoff/landing conditions: High, Hot, Heavy, Humid\nThree or more present → expect extended distances\nIndicated takeoff airspeed stays CONSTANT regardless of density"},
  {c:"Performance & Power Curve", f:"Max angle vs max rate of climb", b:"ANGLE (AOC): most altitude per DISTANCE — short field, obstacle clearance\nRATE (ROC): most altitude per TIME — expedite to an assigned altitude"},
  {c:"Performance & Power Curve", f:"Max endurance vs max range on the power curve", b:"ENDURANCE: bottom of the curve — minimum fuel flow; slower than L/DMAX; AOA greater than L/DMAX AOA\nRANGE: origin-tangent point — L/DMAX AOA and velocity; FASTER than max endurance"},
  {c:"Performance & Power Curve", f:"Altitude and cruise performance", b:"Higher altitude → colder → turbine engines more fuel efficient\nFuel flow DECREASES even though the throttle is physically advanced\nBoth max range and max endurance IMPROVE with altitude"},
  {c:"Performance & Power Curve", f:"Glide profiles (engine failed)", b:"Max glide RANGE: L/DMAX AOA — minimum angle of descent, minimum drag\nMax glide ENDURANCE: minimum power deficit — slower than L/DMAX, AOA greater than L/DMAX AOA"},
  {c:"Performance & Power Curve", f:"Regions of normal and reverse command", b:"NORMAL (faster than max endurance): throttle and velocity DIRECTLY related\nREVERSE (slower than max endurance): INVERSELY related — flying slower needs MORE throttle (induced drag)\nTakeoff and landing occur in or near reverse command; most aviation accidents happen there"},
  {c:"Performance & Power Curve", f:"'Behind the power curve' trap", b:"Slowing in reverse command: pulling back raises power required → deficit → descent → pilot pulls more → bigger deficit until full throttle cannot overcome it\nCorrect response: ADD THROTTLE to stay level as you slow; more AOA only aggravates it"},
  {c:"Performance & Power Curve", f:"Landing rollout braking", b:"AERODYNAMIC braking first: hold pitch attitude, expose surface to the relative wind (parasite drag), saves the brakes\nThen RAISE FLAPS → weight transfers to the wheels → MECHANICAL (wheel) braking finishes the roll"},
  {c:"Performance & Power Curve", f:"Crosswind takeoff/landing controls", b:"RUDDER: primary directional control (nosewheel helps until the rudder is effective)\nAILERONS INTO THE WIND: not for steering — they counter lateral stability's attempt to roll the airplane"},
  {c:"Performance & Power Curve", f:"Weight and balance basics", b:"Moment = weight × arm (lb-in), measured from the datum\nCG must stay in the CG range (forward/aft limits)\nCG too far forward → nose-heavy; too far aft → tail-heavy — possibly uncontrollable"},

  // ---- Maneuvering & Hazards ----
  {c:"Maneuvering & Hazards", f:"Load factor", b:"n = L / W — measured in Gs\nLevel turn: only the VERTICAL lift component opposes weight\nMust increase total lift (pull AOA) or the airplane descends"},
  {c:"Maneuvering & Hazards", f:"Limit load, elastic limit, ultimate load", b:"LIMIT load: max with NO risk of permanent deformation (designed below the elastic limit of components)\nELASTIC limit: max load on a component without permanent deformation\nULTIMATE load: 150% of limit load — exceed it and structural failure is IMMINENT"},
  {c:"Maneuvering & Hazards", f:"Overstress / Over-G", b:"Exceeding the limit load — damage may be INVISIBLE\nInternal parts (hydraulic actuators, engine mounts) can fail before the airframe\nALWAYS report an overstress to maintenance"},
  {c:"Maneuvering & Hazards", f:"V-n diagram", b:"Load factor (Gs) vs INDICATED airspeed\nValid for one weight, altitude, and configuration\nBounded by: accelerated stall lines (left), limit load factors (top/bottom), redline VNE (right)"},
  {c:"Maneuvering & Hazards", f:"Maneuver point / maneuver speed (Va)", b:"Where the accelerated stall line meets the limit load line\nVa = LOWEST airspeed at which the limit load can be reached\nBelow Va the airplane STALLS before it can be overstressed\nAlso: max turn rate, min turn radius, turbulent-air penetration speed"},
  {c:"Maneuvering & Hazards", f:"What can set redline airspeed (VNE)?", b:"MCRIT (shock wave damage)\nAirframe temperature (friction heating / creep)\nExcessive structural loads on control surfaces\nControllability limits (forces too high or aeroelastic loss of authority)"},
  {c:"Maneuvering & Hazards", f:"Slip vs skid", b:"SLIP: too little rudder; ball INSIDE the turn; radius UP, rate DOWN; stall → rolls toward wings level\nSKID: too much rudder; ball OUTSIDE (centrifugal force); radius DOWN, rate UP; stall → rolls INVERTED\nFix either: 'step on the ball'"},
  {c:"Maneuvering & Hazards", f:"P-factor and slipstream swirl", b:"P-FACTOR: needs high power + thrust axis displaced from the relative wind → down-going (right) blade makes more thrust → nose yaws LEFT\nSLIPSTREAM SWIRL: corkscrew propwash raises the vertical stab's AOA → tail pulled right, nose yaws LEFT\nBoth corrected with RIGHT rudder"},
  {c:"Maneuvering & Hazards", f:"Wake turbulence: strength and behavior", b:"Strongest generator: HEAVY, SLOW, CLEAN (flaps shift lift to the root and weaken tip vortices)\nSink 400-500 fpm, level off ~900 ft below the flight path\nOn the ground: drift outward ~5 kt; a 4-6 kt crosswind holds the upwind vortex in the touchdown zone\nCaution on parallel runways < 2,500 ft apart"},
  {c:"Maneuvering & Hazards", f:"Wake turbulence: when does the hazard exist?", b:"From nosewheel LIFTOFF (rotation) until nosewheel TOUCHDOWN — vortices exist whenever lift is produced, by EVERY aircraft regardless of size\nAfter a 'caution wake turbulence' call: wait at least 2 minutes, and stay above the preceding aircraft's flight path"},
  {c:"Maneuvering & Hazards", f:"Wind shear", b:"A sudden change in wind direction and/or speed over a short distance\nHeadwind loss → IAS and lift drop instantly (gain → they rise) until the aircraft restabilizes\nMost dangerous at slow airspeed + low altitude (takeoff and landing)"}
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
