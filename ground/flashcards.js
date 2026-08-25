// ============================================================
// FLASHCARDS — must-know facts for NIFE Ground School
// (CRM, mishaps, investigations, reporting, ORM, aeromedical).
// Source: NIFE Ground School class study set (Quizlet).
// f = front, b = back, c = category.
// ============================================================
var CATEGORIES = ["CRM Skills", "Mishaps", "Investigations & Reporting", "ORM", "Physiology & G"];

var CARDS = [
  // ---- CRM Skills ----
  {c:"CRM Skills", f:"Crew Day", b:"12 hours"},
  {c:"CRM Skills", f:"Crew Resource Management (CRM)", b:"The effective use of all available resources by individuals, crews, and teams to safely and efficiently accomplish the mission or task"},
  {c:"CRM Skills", f:"The Seven Critical Skills", b:"Decision Making\nAssertiveness\nMission Analysis\nCommunication\nLeadership\nAdaptability / Flexibility\nSituational Awareness"},
  {c:"CRM Skills", f:"Decision Making", b:"Ability to choose a course of action using logical and sound judgment based on all available information"},
  {c:"CRM Skills", f:"Factors that influence good decision making", b:"Teamwork\nPre-flight brief\nSituational awareness\nEffective communication\nHealthy, alert crewmembers\nExperience"},
  {c:"CRM Skills", f:"Assertiveness", b:"Willingness or readiness to actively participate, state, and maintain a position until convinced by the facts that other options are better"},
  {c:"CRM Skills", f:"Barriers that influence Assertiveness", b:"Position of authority\nExperience\nRank\nQualifications\nPersonal characteristics"},
  {c:"CRM Skills", f:"Solutions that influence Assertiveness", b:"Making suggestions\nAsking questions\nConfront ambiguities\nMaintain position when challenged\nState opinions\nAccept the most conservative response to the situation until more information is available"},
  {c:"CRM Skills", f:"Mission Analysis", b:"Ability to develop short term, long term, and contingency plans and to coordinate, allocate, and monitor crew and aircraft resources"},
  {c:"CRM Skills", f:"Three Phases of Mission Analysis", b:"1) Pre-mission\n2) In-flight\n3) Post-mission"},
  {c:"CRM Skills", f:"Communication", b:"Ability to clearly and accurately send and acknowledge information, instructions, or commands and provide useful feedback"},
  {c:"CRM Skills", f:"Factors that influence good communication", b:"Communicate clearly\nConvey information accurately\nTimely\nRequest verification or feedback\nVerbalize plans"},
  {c:"CRM Skills", f:"Leadership", b:"The ability to direct and coordinate the activities of the other crew members or wingmen, and to motivate the crew to work together as a team"},
  {c:"CRM Skills", f:"Traits of good leadership", b:"Direct and coordinate the crew\nDelegate tasks\nEnsure the crew understands expectations\nFocus attention on crucial aspects\nKeep crew informed of mission information\nProvide feedback on performance\nCreate and maintain a professional atmosphere"},
  {c:"CRM Skills", f:"Adaptability / Flexibility", b:"The ability to alter a course of action based on new information, maintain constructive behavior under pressure, and adapt to internal and external changes"},
  {c:"CRM Skills", f:"Situational Awareness", b:"Degree of accuracy by which one's perception of the current environment mirrors reality"},
  {c:"CRM Skills", f:"Factors that influence Situational Awareness", b:"Insufficient communication\nFatigue / stress\nTask overload\nTask underload\n'Press on regardless' philosophy\nDegraded operating conditions"},

  // ---- Mishaps ----
  {c:"Mishaps", f:"Naval Aviation Mishap", b:"Unplanned event or series of events, directly involving a defined naval aircraft or UAV, that results in damage to DOD or non-DOD property and/or injury or illness to DOD or non-DOD personnel"},
  {c:"Mishaps", f:"Intent for Flight — Fixed Wing", b:"BEGINS when brakes are released (not for taxi) and/or takeoff power is applied, or at the first motion of a cat shot after signaled by the pilot\nCONTINUES until the aircraft taxis free of the runway/landing area or is captured by another recovery system"},
  {c:"Mishaps", f:"Intent for Flight — Helo / Tilt-Rotor", b:"BEGINS when takeoff power is applied\nCONTINUES until the skids/landing gear support the aircraft's weight at the termination of flight"},
  {c:"Mishaps", f:"Aviation mishap subcategories", b:"Flight Mishap\nFlight Related Mishap\nAviation Ground Mishap"},
  {c:"Mishaps", f:"Levels of Mishap Severity", b:"Class A, B, C, D, E"},
  {c:"Mishaps", f:"Class A Mishap", b:"$2.5 million or more in damage, and/or total loss of an aircraft\nDeath or permanent total disability of personnel"},
  {c:"Mishaps", f:"Class B Mishap", b:"$600,000 up to $2.5 million\nPermanent partial disability, or 3 or more personnel hospitalized for inpatient care"},
  {c:"Mishaps", f:"Class C Mishap", b:"$60,000 up to $600,000\nOr 1 or more lost workdays of personnel"},
  {c:"Mishaps", f:"Class D Mishap", b:"$25,000 up to $60,000\nOr any recordable injury requiring more than just basic first aid"},
  {c:"Mishaps", f:"Class E Mishap", b:"Any cost up to $25,000, or any injury including first aid care\nNOT privileged — equivalent to a HAZREP"},

  // ---- Investigations & Reporting ----
  {c:"Investigations & Reporting", f:"Types of mishap investigations", b:"Aviation Mishap Safety Investigation\nInteragency Investigation\nJAGMAN Investigation\nField Naval Aviator Evaluation Board (FNAEB) / Field Flight Performance Board (FFPB)"},
  {c:"Investigations & Reporting", f:"Aviation Mishap Safety Investigation", b:"Aircraft Mishap Board (AMB) convened and investigation conducted to determine contributing factors in order to prevent reoccurrence"},
  {c:"Investigations & Reporting", f:"Interagency Investigation", b:"National Transportation Safety Board (NTSB) and Federal Aviation Administration (FAA) can participate in naval aviation mishap investigations whenever mishaps involve civil aircraft and/or FAA functions, facilities, or personnel"},
  {c:"Investigations & Reporting", f:"JAGMAN Investigation", b:"Investigation for the purpose of identifying possible negligence and liability"},
  {c:"Investigations & Reporting", f:"FNAEB (USN) / FFPB (USMC)", b:"Administrative board convened for Class A or B flight mishaps if the aircrew's performance is in question\nEvaluates performance, potential, and motivation for continued service as a Naval Aviator before return to flight duties"},
  {c:"Investigations & Reporting", f:"Privileged Information", b:"Allows those involved to tell the truth without fear of reprisal"},
  {c:"Investigations & Reporting", f:"Four types of accident/incident reporting", b:"Anymouse\nASAP\nHAZREPs\nSITREPs"},
  {c:"Investigations & Reporting", f:"IMSAFE checklist", b:"Illness\nMedication\nStress\nAlcohol\nFatigue\nEating"},
  {c:"Investigations & Reporting", f:"Three types of wildlife hazard programs", b:"BASH\nBAM\nAHAS"},

  // ---- ORM ----
  {c:"ORM", f:"Operational Risk Management (ORM)", b:"Process of dealing with risk associated with military operations"},
  {c:"ORM", f:"Three levels of ORM", b:"In-depth\nDeliberate\nTime Critical"},
  {c:"ORM", f:"Time Critical Risk Management — ABCD Model", b:"Assess situation\nBalance resources\nCommunicate to others\nDo and Debrief event"},
  {c:"ORM", f:"Four Basic Principles of ORM", b:"Accept risk when benefits outweigh the costs\nAccept no unnecessary risk\nAnticipate and manage risk by planning\nMake risk decisions at the right level"},
  {c:"ORM", f:"Five Steps of ORM", b:"1) Identify hazards\n2) Assess hazards\n3) Make risk decisions\n4) Implement controls\n5) Supervise"},
  {c:"ORM", f:"Hazard", b:"Any condition with the potential to negatively impact mission accomplishment or cause injury, death, or property damage"},
  {c:"ORM", f:"Probability", b:"Measure of the likelihood that, given exposure to a hazard, a potential consequence will occur"},
  {c:"ORM", f:"Severity", b:"Assessment of the potential consequence that can occur as a result of a hazard"},

  // ---- Physiology & G ----
  {c:"Physiology & G", f:"Gravity-Induced Loss of Consciousness (GLOC)", b:"Medical condition that occurs when an individual experiences a temporary loss of consciousness or faints due to changes in acceleration forces, particularly during high-speed / high-G maneuvers"},
  {c:"Physiology & G", f:"Risk associated with the Push-Pull effect", b:"Individual is more vulnerable to the effects of GLOC\nBlood can pool more easily because of a lack of clamping at the periphery, and compensating reflexes are unable to 'spool up'"},
  {c:"Physiology & G", f:"Psychological techniques to improve physical performance", b:"Adequate sleep\nThought and attention control\nArousal control"},
  {c:"Physiology & G", f:"Techniques to improve G tolerance", b:"Training\nConditioning\nHydration\nPhysical fitness\nAcclimatization"}
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
