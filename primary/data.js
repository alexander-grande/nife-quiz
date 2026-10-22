// ============================================================
// PRIMARY — T-6B EPs (boldface): all 20, EPs 1–20.
// Transcribed from the T-6B EP & OP Limits Key (01 Aug 23, Change 2). Grading
// helpers (normEP, epMatchLine, …) come from ../ground/data.js, so load
// that first. Same line format as the Cessna EPs:
// type "step": numbered item + action (action "" = one box for the line)
//   sub: true = a lettered sub-step (a. b. c.) under the step above, no *
// type "decision": given bold "IF …" line, not graded on the sheet
// ============================================================
const T6_EPS = [
  { id: "abort-start", short: "Abort Start", title: "ABORT START PROCEDURE", lines: [
    { type: "step", n: 1, item: "PCL - OFF or STARTER Switch - AUTO/RESET", action: "" },
  ]},
  { id: "emer-shutdown-ground", short: "Emer Shutdown", title: "EMERGENCY ENGINE SHUTDOWN ON THE GROUND", lines: [
    { type: "step", n: 1, item: "PCL", action: "OFF" },
    { type: "step", n: 2, item: "Firewall Shutoff Handle", action: "PULL" },
    { type: "step", n: 3, item: "Emergency Ground Egress", action: "AS REQUIRED" },
  ]},
  { id: "emer-ground-egress", short: "Ground Egress", title: "EMERGENCY GROUND EGRESS", lines: [
    { type: "step", n: 1, item: "ISS Mode Selector", action: "SOLO" },
    { type: "step", n: 2, item: "Seat Safety Pin", action: "INSTALL (BOTH)" },
    { type: "step", n: 3, item: "Parking Brake", action: "AS REQUIRED" },
    { type: "step", n: 4, item: "Canopy", action: "OPEN" },
    { type: "decision", text: "IF CANOPY CANNOT BE OPENED OR SITUATION REQUIRES RIGHT SIDE EGRESS:" },
    { type: "step", n: 5, item: "CFS Handle Safety Pin", action: "REMOVE (BOTH)" },
    { type: "step", n: 6, item: "CFS Handle", action: "ROTATE 90 DEGREES COUNTERCLOCKWISE AND PULL (BOTH)" },
    { type: "step", n: 7, item: "Upper Fittings, Lower Fittings, and Leg Restraint Garters", action: "RELEASE (BOTH)" },
    { type: "step", n: 8, item: "BAT, GEN, and AUX BAT Switches", action: "OFF" },
    { type: "step", n: 9, item: "Evacuate Aircraft", action: "" },
  ]},
  { id: "abort", short: "Abort", title: "ABORT", lines: [
    { type: "step", n: 1, item: "PCL", action: "IDLE" },
    { type: "step", n: 2, item: "Brakes", action: "AS REQUIRED" },
  ]},
  { id: "eng-fail-after-takeoff", short: "Eng Fail Takeoff", title: "ENGINE FAILURE IMMEDIATELY AFTER TAKEOFF (SUFFICIENT RUNWAY REMAINING STRAIGHT AHEAD)", lines: [
    { type: "step", n: 1, item: "Airspeed", action: "110 KNOTS (MINIMUM)" },
    { type: "step", n: 2, item: "PCL", action: "AS REQUIRED" },
    { type: "step", n: 3, item: "EMER LDG GR Handle", action: "PULL (AS REQUIRED)" },
    { type: "step", n: 4, item: "Flaps", action: "AS REQUIRED" },
  ]},
  { id: "eng-fail-flight", short: "Eng Fail Flight", title: "ENGINE FAILURE DURING FLIGHT", lines: [
    { type: "step", n: 1, item: "Zoom/Glide", action: "125 KNOTS (MINIMUM)" },
    { type: "step", n: 2, item: "PCL", action: "OFF" },
    { type: "step", n: 3, item: "Intercept ELP", action: "" },
    { type: "step", n: 4, item: "Airstart", action: "ATTEMPT IF WARRANTED" },
    { type: "decision", text: "IF CONDITIONS DO NOT WARRANT AN AIRSTART:" },
    { type: "step", n: 5, item: "Firewall Shutoff Handle", action: "PULL" },
    { type: "step", n: 6, item: "Execute Forced Landing or Eject", action: "" },
  ]},
  { id: "immediate-airstart", short: "Airstart", title: "IMMEDIATE AIRSTART (PMU NORM)", lines: [
    { type: "step", n: 1, item: "PCL", action: "OFF" },
    { type: "step", n: 2, item: "Starter Switch", action: "AUTO/RESET" },
    { type: "step", n: 3, item: "PCL", action: "IDLE, ABOVE 13% N1" },
    { type: "step", n: 4, item: "Engine Instruments", action: "MONITOR ITT, N1, AND OIL PRESSURE" },
    { type: "decision", text: "IF AIRSTART IS UNSUCCESSFUL:" },
    { type: "step", n: 5, item: "PCL", action: "OFF" },
    { type: "step", n: 6, item: "Firewall Shutoff Handle", action: "PULL" },
    { type: "step", n: 7, item: "Execute Forced Landing or Eject", action: "" },
    { type: "decision", text: "IF AIRSTART IS SUCCESSFUL:" },
    { type: "step", n: 8, item: "PCL", action: "AS REQUIRED AFTER N1 REACHES IDLE RPM (APPROXIMATELY 67% N1)" },
    { type: "step", n: 9, item: "PEL", action: "EXECUTE" },
  ]},
  { id: "uncommanded-power", short: "Uncommanded Power", title: "UNCOMMANDED POWER CHANGES / LOSS OF POWER / UNCOMMANDED PROPELLER FEATHER", lines: [
    { type: "step", n: 1, item: "PCL", action: "MID RANGE" },
    { type: "step", n: 2, item: "PMU Switch", action: "OFF" },
    { type: "step", n: 3, item: "PROP SYS Circuit Breaker (Left Front Console)", action: "PULL, IF Np STABLE BELOW 40%" },
    { type: "step", n: 4, item: "PCL", action: "AS REQUIRED" },
    { type: "decision", text: "IF POWER IS SUFFICIENT FOR CONTINUED FLIGHT:" },
    { type: "step", n: 5, item: "PEL", action: "EXECUTE" },
    { type: "decision", text: "IF POWER IS INSUFFICIENT TO COMPLETE PEL:" },
    { type: "step", n: 6, item: "PROP SYS Circuit Breaker", action: "RESET, AS REQUIRED" },
    { type: "step", n: 7, item: "PCL", action: "OFF" },
    { type: "step", n: 8, item: "Firewall Shutoff Handle", action: "PULL" },
    { type: "step", n: 9, item: "Execute Forced Landing or Eject", action: "" },
  ]},
  { id: "compressor-stalls", short: "Compressor Stalls", title: "COMPRESSOR STALLS", lines: [
    { type: "step", n: 1, item: "PCL", action: "SLOWLY RETARD BELOW STALL THRESHOLD" },
    { type: "step", n: 2, item: "Defog Switch", action: "ON" },
    { type: "step", n: 3, item: "PCL", action: "SLOWLY ADVANCE (AS REQUIRED)" },
    { type: "decision", text: "IF POWER IS SUFFICIENT FOR CONTINUED FLIGHT:" },
    { type: "step", n: 4, item: "PEL", action: "EXECUTE" },
    { type: "decision", text: "IF POWER IS INSUFFICIENT TO COMPLETE PEL:" },
    { type: "step", n: 5, item: "PCL", action: "OFF" },
    { type: "step", n: 6, item: "Firewall Shutoff Handle", action: "PULL" },
    { type: "step", n: 7, item: "Execute Forced Landing or Eject", action: "" },
  ]},
  { id: "departure", short: "Departure", title: "INADVERTENT DEPARTURE FROM CONTROLLED FLIGHT", lines: [
    { type: "step", n: 1, item: "PCL", action: "IDLE" },
    { type: "step", n: 2, item: "Controls", action: "NEUTRAL" },
    { type: "step", n: 3, item: "Altitude", action: "CHECK" },
    { type: "step", n: 4, item: "Recover from Unusual Attitude", action: "" },
  ]},
  { id: "fire-in-flight", short: "Fire in Flight", title: "FIRE IN FLIGHT", lines: [
    { type: "decision", text: "IF FIRE IS CONFIRMED:" },
    { type: "step", n: 1, item: "PCL", action: "OFF" },
    { type: "step", n: 2, item: "Firewall Shutoff Handle", action: "PULL" },
    { type: "decision", text: "IF FIRE IS EXTINGUISHED:" },
    { type: "step", n: 3, item: "Forced Landing", action: "EXECUTE" },
    { type: "decision", text: "IF FIRE DOES NOT EXTINGUISH OR FORCED LANDING IS IMPRACTICAL:" },
    { type: "step", n: 4, item: "Eject (BOTH)", action: "" },
    { type: "decision", text: "IF FIRE IS NOT CONFIRMED:" },
    { type: "step", n: 5, item: "PEL", action: "EXECUTE" },
  ]},
  { id: "smoke-fume", short: "Smoke/Elec Fire", title: "SMOKE AND FUME ELIMINATION / ELECTRICAL FIRE", lines: [
    { type: "step", n: 1, item: "OBOGS", action: "CHECK (BOTH)" },
    { type: "step", n: "a", sub: true, item: "OBOGS Supply Lever", action: "ON" },
    { type: "step", n: "b", sub: true, item: "OBOGS Concentration Lever", action: "MAX" },
    { type: "step", n: "c", sub: true, item: "OBOGS Pressure Lever", action: "EMERGENCY" },
  ]},
  { id: "chip-detector", short: "Chip Detector", title: "CHIP DETECTOR WARNING", lines: [
    { type: "step", n: 1, item: "PCL", action: "MINIMUM NECESSARY TO INTERCEPT ELP; AVOID UNNECESSARY PCL MOVEMENTS" },
    { type: "step", n: 2, item: "PEL", action: "EXECUTE" },
  ]},
  { id: "low-oil-pressure", short: "Low Oil Press", title: "OIL SYSTEM MALFUNCTION OR LOW OIL PRESSURE", lines: [
    { type: "decision", text: "IF ONLY AMBER OIL PX CAUTION ILLUMINATES:" },
    { type: "step", n: 1, item: "Terminate Maneuver", action: "" },
    { type: "step", n: 2, item: "Check Oil Pressure; if Oil Pressure Is Normal, Continue Operations", action: "" },
    { type: "decision", text: "IF RED OIL PX WARNING ILLUMINATES AND/OR AMBER OIL PX CAUTION REMAINS ILLUMINATED FOR 5 SECONDS:" },
    { type: "step", n: 3, item: "PCL", action: "MINIMUM NECESSARY TO INTERCEPT ELP; AVOID UNNECESSARY PCL MOVEMENTS" },
    { type: "step", n: 4, item: "PEL", action: "EXECUTE" },
  ]},
  { id: "low-fuel-pressure", short: "Low Fuel Press", title: "LOW FUEL PRESSURE", lines: [
    { type: "step", n: 1, item: "PEL", action: "EXECUTE" },
    { type: "step", n: 2, item: "Boost Pump Switch", action: "ON" },
  ]},
  { id: "high-fuel-flow", short: "High Fuel Flow", title: "HIGH FUEL FLOW", lines: [
    { type: "step", n: 1, item: "PEL", action: "EXECUTE" },
  ]},
  { id: "obogs-failure", short: "OBOGS Failure", title: "OBOGS FAILURE / OVERTEMP / PHYSIOLOGICAL SYMPTOMS", lines: [
    { type: "step", n: 1, item: "Green Ring", action: "PULL (AS REQUIRED) (BOTH)" },
    { type: "step", n: 2, item: "Descent Below 10,000 Feet MSL", action: "INITIATE" },
    { type: "step", n: 3, item: "OBOGS Supply Lever", action: "OFF (BOTH)" },
  ]},
  { id: "eject", short: "Eject", title: "EJECT", lines: [
    { type: "step", n: 1, item: "Ejection Handle", action: "PULL (BOTH)" },
  ]},
  { id: "forced-landing", short: "Forced Landing", title: "FORCED LANDING", lines: [
    { type: "step", n: 1, item: "Airspeed", action: "125 KIAS PRIOR TO EXTENDING LANDING GEAR" },
    { type: "step", n: 2, item: "EMER LDG GR Handle", action: "PULL (AS REQUIRED)" },
    { type: "step", n: 3, item: "Airspeed", action: "120 KIAS MINIMUM UNTIL INTERCEPTING FINAL; 110 KIAS MINIMUM ON FINAL" },
    { type: "step", n: 4, item: "Flaps", action: "AS REQUIRED" },
  ]},
  { id: "pel", short: "PEL", title: "PRECAUTIONARY EMERGENCY LANDING (PEL)", lines: [
    { type: "step", n: 1, item: "Turn to Nearest Suitable Field", action: "" },
    { type: "step", n: 2, item: "Climb or Accelerate to Intercept ELP", action: "" },
    { type: "step", n: 3, item: "Gear, Flaps, Speed Brake", action: "UP" },
  ]},
];
