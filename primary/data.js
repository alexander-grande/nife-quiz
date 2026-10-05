// ============================================================
// PRIMARY — T-6B EPs (boldface), part 1: EPs 1–7.
// Transcribed from the T-6B EP & OP Limits Key (01 Aug 23, Change 2). Grading
// helpers (normEP, epMatchLine, …) come from ../ground/data.js, so load
// that first. Same line format as the Cessna EPs:
// type "step": numbered item + action (action "" = one box for the line)
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
];
