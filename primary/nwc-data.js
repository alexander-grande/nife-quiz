// ============================================================
// PRIMARY — T-6B EP notes, warnings, cautions and indications.
// Transcribed from the class T-6B Flashcards (2026). The starred steps
// themselves come from T6_EPS (data.js, the official key), so load that
// first; this file only adds what the flashcards print around them.
// Per EP id:
//   counts — the "2W, 3C, 7N" tally printed on the card front
//   ann    — annunciators on the front: [color, text], color r (red
//            warning), a (amber caution), "" (plain word like OR), "-" gap
//   front  — bullet list on the front (Abort Start's abort criteria)
//   ind    — INDICATIONS line on the back
//   pre    — items printed before CORRECTIVE ACTION
//   at     — items after key line N (N = how many of T6_EPS lines come
//            before it), each {k: "W"|"C"|"N"|"IF", t}
// ============================================================
const T6_NWC = {
  "abort-start": {
    counts: "2C, 4N",
    front: [
      "ITT appears likely to exceed 1000°C (hot start)",
      "ITT appears likely to remain between 871–1000°C for > 5 seconds",
      "Normal N1 increase is halted (hung start)",
      "No rise in ITT within 10 sec after fuel flow indications (no start)",
      "BATT BUS warning",
      "PCL is moved or ST READY advisory extinguishes",
    ],
    pre: [
      { k: "N", t: "Note and report to maintenance the degree and duration of any overtemperature." },
    ],
    at: {
      1: [
        { k: "N", t: "If start is initiated with PCL in the OFF position, abort by reselecting AUTO/RESET on the STARTER switch. If start is initiated with PCL out of the OFF position, but not past the IDLE gate, abort by placing the PCL to OFF or reselecting AUTO/RESET on the STARTER switch. If the PCL is past the IDLE gate, abort by placing the PCL to OFF." },
        { k: "C", t: "If a start using external power is either aborted by the PMU or manually aborted for a hot, hung, or no start, do not attempt subsequent starts." },
        { k: "C", t: "Repeated PMU aborted start attempts are indicative of engine malfunction." },
        { k: "N", t: "During ground starts, certain parameters (weak battery, high OAT, high pre-start ITT, high DA, tailwind) may cause the PMU to abort a battery start attempt. Though these parameters are not directly monitored by the PMU, they cause a rate of rise in N1 and/or ITT that are indicative of an impending hung or hot start." },
        { k: "N", t: "If a battery start was aborted (PMU or manual abort), connect external power (if available) and perform Motoring Run Procedure. Subsequent starts may be attempted if no engine malfunctions are evident and no limits have been exceeded." },
      ],
    },
  },
  "emer-shutdown-ground": {
    counts: "",
    ind: "In the event of an engine fire, prop strike, or chip light; if the aircraft appears likely to depart the prepared surface; or should any other serious ground emergency occur.",
  },
  "emer-ground-egress": {
    counts: "5W, 2N",
    pre: [
      { k: "N", t: "In a situation requiring immediate ground egress, the ejection system has the capability for 0/0 ejection." },
    ],
    at: {
      1: [{ k: "W", t: "Failure to ensure the ISS mode selector is set to SOLO may result in the inadvertent ejection of one or both seats." }],
      2: [{ k: "W", t: "Failure to insert both ejection seat safety pins (if occupied) before ground egress may result in inadvertent activation of ejection sequence and subsequent injury or death when performing emergency ground egress." }],
      7: [
        { k: "W", t: "If the CFS malfunctions in conjunction with a canopy latch failure in the locked position, ejection may be the only option remaining to exit the aircraft. Aircrew shall remove the ejection seat safety pin and ensure shoulder straps, lap straps, and leg restraint garters are still attached prior to pulling the ejection handle." },
        { k: "W", t: "To prevent injury, ensure oxygen mask is on and visor is down prior to actuating the CFS." },
        { k: "W", t: "Each internal CFS handle activates only the CFS charge for the respective transparency. Both internal CFS handles must be activated in order to fracture both transparencies (if required)." },
      ],
      8: [{ k: "N", t: "Oxygen hose, emergency oxygen hose, communication leads, and anti-G suit hose will pull free while vacating cockpit and leg restraint lines will pull through leg restraint garter D rings if released with quick-release lever." }],
    },
  },
  "abort": {
    counts: "1W",
    at: {
      2: [{ k: "W", t: "After a stop which required maximum effort braking and if overheated brakes are suspected, do not taxi into or park in a congested area until brakes have had sufficient time to cool. Do not set parking brake." }],
    },
  },
  "eng-fail-after-takeoff": {
    counts: "2W, 2N",
    ind: "Total loss of power and fairly rapid reduction in airspeed.",
    pre: [
      { k: "W", t: "If insufficient runway remains to land straight ahead, consider immediate ejection." },
      { k: "W", t: "Do not sacrifice aircraft control while troubleshooting or lowering gear with emergency system." },
    ],
    at: {
      2: [{ k: "N", t: "The pilot should select IDLE to use the increased drag of the not yet feathered propeller or select OFF to reduce the sink rate." }],
      3: [{ k: "N", t: "With a loss of hydraulic pressure, landing gear and flaps cannot be lowered by normal means." }],
    },
  },
  "eng-fail-flight": {
    counts: "3W, 5N",
    ann: [["r", "GEN"], ["r", "FUEL PX"], ["r", "OIL PX"], ["r", "OBOGS FAIL"], ["-"], ["r", "PMU FAIL"], ["r", "CKPT PX"]],
    ind: "Loss of power and airspeed, rapid decay in N1, torque, and ITT, propeller movement toward feather due to loss of oil pressure. N1 0% within ~5 sec, TRQ indicates 0%. Secondary: rapidly decreasing ITT and lower than normal oil pressure.",
    pre: [
      { k: "N", t: "Zoom results with an engine still producing a usable torque (>6%) will be several hundred to several thousand feet higher in altitude gained." },
      { k: "N", t: "Each low altitude zoom capability chart depicted represents a no engine condition. Each chart assumes the pilot will not perform any action prior to actual engine failure." },
      { k: "N", t: "If experiencing uncommanded power changes/loss of power/uncommanded propeller feather or compressor stalls, refer to appropriate procedure." },
    ],
    at: {
      2: [{ k: "N", t: "Propeller will not feather unless the PCL is fully in OFF." }],
      3: [
        { k: "W", t: "If a suitable landing surface is available, turn immediately to intercept the nearest suitable point on the ELP. Any delay could result in insufficient gliding distance to reach a landing surface." },
        { k: "W", t: "Do not delay decision to eject below 2000' AGL." },
      ],
      4: [
        { k: "W", t: "Airstart procedure is not recommended below 2000' AGL, as primary attention should be to eject or safely recover the aircraft." },
        { k: "N", t: "Crosscheck N1 against other engine indications to assess condition of engine and determine if an airstart is warranted. At 125 KIAS, an engine which has flamed out will rotate below 8% N1 and indicate 0% N1. The engine oil pressure indicator may display oil pressures up to 4 psi with or without the engine seized." },
      ],
    },
  },
  "immediate-airstart": {
    counts: "4W, 4C, 1N",
    pre: [
      { k: "W", t: "Airstart attempts outside of the envelope (125–200 KIAS for sea level to 15,000', or 135–200 KIAS for 15,001 to 20,000') may be unsuccessful or result in engine overtemp." },
    ],
    at: {
      1: [
        { k: "W", t: "Do not delay ejection while attempting to airstart if below 2000' AGL." },
        { k: "W", t: "PCL must be in OFF to feather the propeller, and ensure proper starter, ignition, boost pump, and PMU operation during airstart." },
        { k: "C", t: "Ensure PCL is OFF, otherwise fuel may be prematurely introduced during start." },
      ],
      2: [{ k: "C", t: "If N1 does not rise within 5 seconds, discontinue the airstart attempt and proceed to \"IF UNSUCCESSFUL\" due to suspected mechanical failure." }],
      3: [
        { k: "W", t: "Movement of the PCL above IDLE before N1 stabilizes at approximately 67% will cause an increase in fuel flow which may cause engine failure due to a severe ITT overtemperature." },
        { k: "C", t: "If there is no rise in ITT within 10 seconds after fuel flow indications, place the PCL to OFF and abort the start." },
      ],
      11: [
        { k: "C", t: "Continuous operation with the BOOST PUMP switch in the ON position will cause damage to the engine driven low pressure fuel pump. Upon landing, notify maintenance of the duration of flight with the switch in the ON position." },
        { k: "N", t: "If generator will not reset, verify the STARTER switch is in NORM. The starter will drain battery power in 10 minutes if left in MANUAL." },
      ],
    },
  },
  "uncommanded-power": {
    counts: "2W, 3C, 7N",
    at: {
      1: [
        { k: "N", t: "Mid-range is a physical PCL angle that approximates the midway position between IDLE and MAX." },
        { k: "N", t: "A PCL position above IDLE provides the best chance for the engine to recover." },
        { k: "N", t: "A mid-range PCL minimizes the potential of engine overtorque and/or overtemp when PMU is turned off." },
      ],
      2: [
        { k: "C", t: "Potential to exceed limits if the PMU switch is turned OFF with ITT ≥ 820°C." },
        { k: "C", t: "Ground idle will not be available during landing rollout and taxi. Plan for increased landing distances due to higher IDLE N1 (approx 67%)." },
      ],
      3: [
        { k: "N", t: "With constant airspeed and torque, RPM can be considered stable if below 40% and no upward change for a 3 second period." },
        { k: "N", t: "If Np indicator is displaying red X's, switching the PMU to NORM and back OFF will reset the PMU and should restore the Np indication." },
        { k: "N", t: "Propeller should come out of feather within 15–20 seconds." },
      ],
      4: [
        { k: "W", t: "If ROD (on the VSI while stable at 125 KIAS with gear, flaps, and speed brake retracted and 4–6% torque) is greater than 1500'/min, increase torque as necessary (up to 131%) to achieve approximately 1350–1500'/min ROD. If engine power is insufficient to produce a ROD less than 1500'/min, set PCL to OFF." },
        { k: "N", t: "Consider moving PCL through full range of motion to determine power available." },
      ],
      7: [{ k: "C", t: "Consider leaving the engine operating with PCL at mid-range." }],
      8: [{ k: "W", t: "With the PROP SYS CB pulled and the PMU switch OFF, the feather dump solenoid will not be powered. The propeller will feather at a slower rate as oil pressure decreases and the feathering spring takes effect. Glide performance will be considerably reduced and it may not be possible to intercept or fly the ELP." }],
    },
  },
  "compressor-stalls": {
    counts: "1W, 1N",
    ind: "Abnormal engine noise, increasing ITT, decreasing N1 and torque. Possibly followed by fluctuations. Loud bangs, backfires, or sputtering engine.",
    at: {
      2: [{ k: "N", t: "Setting the DEFOG switch to ON automatically selects high bleed air inflow and will alleviate back pressure on the engine compressor." }],
      7: [{ k: "W", t: "When the engine is so underpowered that high rates of descent occur, any delay in shutting down the engine to feather the propeller may result in insufficient altitude to reach a suitable landing site." }],
    },
  },
  "departure": {
    counts: "2W, 1C, 1N",
    at: {
      2: [
        { k: "W", t: "Improperly positioning the control stick/elevator aft of the neutral position may significantly delay or prevent the aircraft from recovering from an OCF/spin which could result in loss of aircraft and/or crew." },
        { k: "N", t: "Cycling of control positions or applying anti-spin controls prematurely can aggravate aircraft motion and significantly delay recovery." },
      ],
      3: [{ k: "W", t: "Recommended minimum altitude for ejection is 6000' AGL." }],
      4: [{ k: "C", t: "Power-on and inverted departures or spins will result in high loads on the engine and torque shaft. If an inverted or power-on departure is encountered, land as soon as conditions permit. The pilot should suspect possible engine damage and may experience unusual engine operation accompanied by low oil pressure or CHIP detector warning. In all cases of inverted or power-on departures, the engine shall be inspected by qualified maintenance personnel after flight." }],
    },
  },
  "fire-in-flight": {
    counts: "4W",
    at: {
      1: [{ k: "W", t: "Illumination of the fire warning light accompanied by one or more of the following indications is confirmation of an engine fire: smoke, flames, engine vibration, unusual sounds, high ITT, and fluctuating oil pressure, oil temperature, or hydraulic pressure." }],
      9: [
        { k: "W", t: "A fire warning light with no accompanying indication is not a confirmed fire. Do not shut down an engine for an unconfirmed fire." },
        { k: "W", t: "High engine compartment temperatures resulting from a bleed air leak may cause illumination of the fire warning light. Reducing the PCL towards IDLE will decrease the amount of bleed air and possibly extinguish the fire warning light; however, advancing PCL might be required to intercept ELP. Regardless of reducing or advancing, continue to investigate for indications confirming engine fire." },
        { k: "W", t: "If the fire cannot be confirmed, the fire warning system may be at fault and should be tested as conditions permit. If only one fire loop annunciator is illuminated (top or bottom half only), a false fire indication may exist if the other loop tests good." },
      ],
    },
  },
  "smoke-fume": {
    counts: "3W, 5N",
    pre: [
      { k: "W", t: "Under varying conditions of fire and/or smoke where aircraft control is jeopardized, pilot has the option of actuating CFS or ejecting." },
      { k: "N", t: "If a faulty component can be identified as the source, turn defective unit off or pull respective circuit breaker. Circuit breakers for items on the hot battery bus are not accessible in flight." },
    ],
    at: {
      4: [
        { k: "N", t: "Selecting RAM/DUMP does not shut off bleed air inflow." },
        { k: "N", t: "Defog is turned off when RAM/DUMP is selected." },
        { k: "W", t: "OBOGS will be inop once the main battery is depleted or with battery failure." },
        { k: "W", t: "To prevent injury, ensure oxygen mask is on and visor is down prior to actuating the CFS system." },
        { k: "N", t: "Recover aircraft without electrical power if possible. If IMC penetration is required, turn the auxiliary battery on. Backup flight instrument and lighting, fire detection (FIRE 1 only), and VHF radio (tuning through standby VHF control unit) will be powered for approximately 30 minutes. Landing gear must be extended by emergency means. The flap lever is powered through the hot battery bus and should function as long as the main battery has not depleted. With normal flap extension and a loss of power to the battery bus, flaps will retract. Gear and flap indicators, as well as exterior lighting, will not be powered. Unless the faulty component has been isolated, further restoration of electrical power is not recommended." },
        { k: "N", t: "With the battery and generator off, the landing gear must be extended using the emergency landing gear extension system." },
      ],
    },
  },
  "chip-detector": {
    counts: "1C",
    ann: [["r", "CHIP"]],
    at: {
      1: [{ k: "C", t: "Higher power settings may aggravate the existing condition." }],
    },
  },
  "low-oil-pressure": {
    counts: "1C, 4N",
    ann: [["a", "OIL PX"], ["", "AND/OR"], ["r", "OIL PX"]],
    pre: [
      { k: "N", t: "Use this procedure for any of the following: red OIL PX annunciator illuminated, amber OIL PX annunciator illuminated, oil pressure fluctuations, oil temperature out of limits, or visibly confirmed leaking oil from the aircraft." },
      { k: "N", t: "If OIL PX warning illuminates and oil pressure indicates < 5 psi, check OIL TRX CB on the battery bus CB panel (left front console). If the CB is open, it may be reset." },
      { k: "N", t: "Due to the sensitivity of the signal conditioning unit, a single, momentary illumination of the amber OIL PX caution while maneuvering is possible but may not indicate a malfunction." },
      { k: "N", t: "Illumination of both red and amber OIL PX messages while the oil pressure gage indicates normal pressure indicates an SCU failure." },
    ],
    at: {
      5: [{ k: "C", t: "Higher power settings may aggravate the existing condition." }],
    },
  },
  "low-fuel-pressure": {
    counts: "1N, 1C",
    ann: [["r", "FUEL PX"]],
    at: {
      1: [{ k: "N", t: "If the FUEL PX warning remains illuminated, the engine driven high pressure fuel pump is suction feeding. Engine operation with high pressure pump suction feeding is limited to 10 hours." }],
      2: [{ k: "C", t: "Unless a greater emergency exists, do not reset BOOST PUMP CB (left front console) if open." }],
    },
  },
  "high-fuel-flow": {
    counts: "1W",
    at: {
      0: [{ k: "IF", t: "If fuel flow is 800 PPH or greater:" }],
      1: [{ k: "W", t: "Higher power settings accompanied by high ITT may aggravate the existing condition. However, if ITT is within limits, reducing power could result in engine flameout." }],
    },
  },
  "obogs-failure": {
    counts: "4W, 2C, 8N",
    ann: [["r", "OBOGS FAIL"], ["", "OR"], ["a", "OBOGS TEMP"]],
    pre: [
      { k: "C", t: "OBOGS TEMP indicates a failure of the OBOGS heat exchanger, and is considered a failure of the OBOGS system." },
    ],
    at: {
      1: [
        { k: "W", t: "Emergency O2 bottle provides approx 10 minutes of O2. If aircraft PA is > 10,000' MSL, ensure the aircraft reaches an altitude of ≤ 10K prior to exhaustion of the emergency O2 supply or the effects of hypoxia may incapacitate the crew." },
        { k: "W", t: "The OBOGS concentrator may malfunction resulting in zeolite dust in the breathing system without an illumination of OBOGS FAIL. Indications of this malfunction include respiratory irritation, coughing, or the presence of white dust in the oxygen mask. Inhalation of zeolite dust should be avoided." },
        { k: "C", t: "When breathing O2 under increased pressure, breathe at a rate and depth slightly less than normal to preclude hyperventilation." },
        { k: "N", t: "If physiological symptoms are recognized, immediate access to a pure and secure source of O2 is the best course of action to expedite recovery. If the cockpit altitude is > 10K, pulling the GREEN RING is required since ambient cockpit air has insufficient O2 pressure to support physiological requirements. At a cockpit altitude of ≤ 10K, pulling the GREEN RING is optional due to sufficient O2 pressure." },
        { k: "N", t: "When the emergency O2 system is actuated, high pressure air may make verbal communication with the other crewmember or ATC more difficult." },
        { k: "N", t: "Once activated, ejection seat emergency O2 cannot be shut off and will provide O2 flow until the cylinder is depleted. Since the emergency O2 system is not regulated, it is normal for pressure to gradually decrease to the point it feels like the O2 is depleted before reaching 10 minutes of use, however O2 is still being supplied." },
        { k: "N", t: "Sharply pull the green ring up and aft to activate the emergency O2 system. Several up and aft pull attempts may be required to fully activate flow." },
        { k: "N", t: "Pull force to activate the emergency O2 system may be as high as 40 lbs." },
      ],
      3: [
        { k: "N", t: "As the emergency O2 flow decreases, breathing through the CRU-60/P anti-suffocation valve will become increasingly noticeable and uncomfortable." },
        { k: "N", t: "Selecting RAM/DUMP does not shut off bleed air inflow." },
        { k: "N", t: "Defog is turned OFF when RAM/DUMP is selected." },
        { k: "W", t: "Oxygen mask must be on and secure before actuating CFS or initiating ejection." },
        { k: "W", t: "If physiological symptoms persist and the pilot(s) feel unsafe to land, maintain < 10K MSL as long as practical before considering ejection." },
      ],
    },
  },
  "eject": {
    counts: "3W, 1N",
    at: {
      1: [
        { k: "W", t: "To avoid injury, grasp handle and pull sharply toward abdomen, keeping elbows against the body." },
        { k: "W", t: "The emergency escape system incorporates an explosive CFS. The force of detonation blows numerous shards and small fragments outward from the canopy and into the cockpit. Some metallic fragments may be extremely hot and may cause burns upon contact with the skin. Aircrew should ensure exposed skin is covered, the oxygen mask is on, and visor down prior to ejection or actuating the CFS system to prevent injury from shards and hot fragments." },
        { k: "W", t: "When ejecting over mountainous terrain exceeding 8000' MSL, the manual override (MOR) handle should be used to manually separate from the seat and deploy the parachute." },
        { k: "N", t: "If ejecting at low speed, one or both sets of risers may remain velcroed together following seat separation. This may create a slight increase in descent rate and/or an uncommanded turn. Manually separate the risers if time permits. The steering lines (toggles) are located on the backside of each of the front risers. To counter any uncommanded turns, unstow the opposite steering line or use risers for controllability." },
      ],
    },
  },
  "forced-landing": {
    counts: "5W, 2C, 5N",
    pre: [
      { k: "W", t: "Aircraft may float while approaching touchdown with the prop feathered more than observed while conducting practice forced landing at 4–6% torque. Energy management is critical to achieving targeted touchdown position. Landing ground roll distance will increase with the prop feathered." },
      { k: "W", t: "Landing on an unprepared surface may cause structural damage making it impossible to open the canopy or fracture it using the CFS." },
      { k: "W", t: "Engine failure or shutdown will completely disable the bleed air system. Depending on environmental conditions, this may cause significant canopy icing and/or fogging, and severely hamper visibility, especially from the rear cockpit." },
      { k: "C", t: "Ejection is recommended if a suitable landing area is not available. If circumstances dictate an emergency landing and ejection is not possible or the ejection system malfunctions, the pilot may perform an ELP to an unprepared surface or ditch the aircraft. The aircraft structure can survive either type of forced landing; however, the risk of injury increases significantly due to crash loads and the complexity of ground or water egress." },
      { k: "C", t: "Inducing yaw (side slipping) with a known engine/oil malfunction could result in impaired windshield visibility due to oil leakage spraying onto the windshield." },
    ],
    at: {
      2: [
        { k: "W", t: "If landing on an unprepared surface or ditching, do not extend the landing gear. Flaps will not be available without emergency gear extension." },
        { k: "N", t: "Normal safe indications with electrical power, when the emergency extension system has been used to lower the gear, are two green main gear lights, two red main door lights, green nose gear light, and red light in handle." },
      ],
      4: [
        { k: "W", t: "Do not lower flaps LDG until landing is assured. Drag will increase dramatically once landing flaps are lowered." },
        { k: "N", t: "Selecting either TO or LDG flaps will extend the flaps to the commanded position if the landing gear has been extended using the emergency extension system and if battery power is available." },
        { k: "N", t: "Landing gear/flap retraction is not possible when the emergency extension system has been used." },
        { k: "N", t: "Nose wheel steering is unavailable with an inoperative engine. Maintain directional control with rudder and differential braking." },
        { k: "N", t: "Activating the ELT at a higher altitude will transmit emergency signal for a longer distance and could aid in rescue/recovery." },
      ],
    },
  },
  "pel": {
    counts: "4W, 2C, 2N",
    pre: [
      { k: "W", t: "If the engine should fail while flying the PEL, refer to the Engine Failure During Flight checklist, and transition to the Forced Landing procedure." },
      { k: "W", t: "If ROD (VSI while stable at 125 KIAS with gear, flaps, and speed brake retracted and 4–6% torque) is greater than 1500'/min, increase torque as necessary (up to 131%) to achieve approximately 1350–1500'/min ROD. If engine power is insufficient to produce a ROD less than 1500'/min, set PCL OFF." },
      { k: "W", t: "Once on profile, if engine is vibrating excessively, or if indications of failure are imminent, set PCL OFF." },
      { k: "W", t: "Engine failure or shutdown will completely disable the bleed air system. Depending on environmental conditions, this may cause significant canopy icing and/or fogging, severely hampering visibility, especially from the rear cockpit." },
      { k: "C", t: "Inducing yaw (side slipping) with a known engine/oil malfunction could result in impaired windshield visibility due to oil leakage spraying onto the windshield." },
      { k: "C", t: "At higher temperature and pressure altitudes, power response will be delayed. Airspeeds below 100 KIAS on ELP final, in combination with transitioning to a high flare, may lead to a hard landing resulting in landing gear component failure." },
    ],
    at: {
      3: [
        { k: "N", t: "Do not set the boost pump and ignition to ON for engine malfunctions, such as oil system, CHIP light, fire, or FOD. In these cases, turning the boost pump ON may provide an undesirable immediate relight." },
        { k: "N", t: "With uncontrollable high power, the pilot must shut down the engine once landing is assured." },
      ],
    },
  },
};

const NWC_LABEL = { W: "Warning", C: "Caution", N: "Note" };
const NWC_ESC = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// One NWC as HTML: "<b>Warning:</b> text", colored by kind.
function nwcItemHTML(it) {
  if (it.k === "IF") return `<div class="nwc-if">${NWC_ESC(it.t)}</div>`;
  return `<div class="nwc nwc-${it.k}"><b>${NWC_LABEL[it.k]}:</b> ${NWC_ESC(it.t)}</div>`;
}
// The card back: indications, then corrective action with the key's steps
// and every NWC where the flashcard prints it.
function nwcBackHTML(ep) {
  const d = T6_NWC[ep.id] || {}, at = d.at || {};
  let h = "";
  if (d.ind) h += `<p class="nwc-ind"><b>INDICATIONS:</b> ${NWC_ESC(d.ind)}</p>`;
  (d.pre || []).forEach(it => { h += nwcItemHTML(it); });
  h += `<div class="nwc-ca">CORRECTIVE ACTION:</div>`;
  ep.lines.forEach((l, i) => {
    (at[i] || []).forEach(it => { h += nwcItemHTML(it); });
    if (l.type === "step") h += `<div class="nwc-step${l.sub ? " sub" : ""}">${l.sub ? "" : "*"}${l.n}. ${NWC_ESC(epKeyText(l))}</div>`;
    else h += `<div class="nwc-if">${NWC_ESC(l.text)}</div>`;
  });
  (at[ep.lines.length] || []).forEach(it => { h += nwcItemHTML(it); });
  return h;
}
// Every NWC for an EP, in card order, with the step it follows
// ("before the procedure" or the step label).
function nwcList(ep) {
  const d = T6_NWC[ep.id] || {}, at = d.at || {}, out = [];
  (d.pre || []).forEach(it => it.k !== "IF" && out.push({ ...it, after: "" }));
  let last = "";
  for (let i = 0; i <= ep.lines.length; i++) {
    (at[i] || []).forEach(it => it.k !== "IF" && out.push({ ...it, after: last }));
    const l = ep.lines[i];
    if (l) last = l.type === "step" ? (l.sub ? "" : "*") + l.n + ". " + epKeyText(l) : l.text;
  }
  return out;
}
// "2W, 3C, 7N" computed from the data (checked against the printed tally)
function nwcTally(ep) {
  const c = { W: 0, C: 0, N: 0 };
  nwcList(ep).forEach(it => c[it.k]++);
  return ["W", "C", "N"].filter(k => c[k]).map(k => c[k] + k).join(", ");
}

// EP drill: every NWC for the EP just graded, under the step it follows.
function nwcReviewHTML(ep) {
  const list = nwcList(ep);
  if (!list.length) return "";
  let h = `<div class="nwc-review ep-after"><h4>Notes, warnings &amp; cautions <span class="t6-hint">(${nwcTally(ep)} — know the gist)</span></h4>`, last = null;
  list.forEach(it => {
    if (it.after !== last) { h += `<div class="nwc-after">${it.after ? "After " + NWC_ESC(it.after) : "Before the corrective action"}</div>`; last = it.after; }
    h += nwcItemHTML(it);
  });
  return h + `</div>`;
}
