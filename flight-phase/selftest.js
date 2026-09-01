// ============================================================
// SELF-TEST — flight-phase/?selftest=1
//
// Pure checks over normSpoken / segmentSpoken / the grader. No speech,
// no mic, no timers, so it runs anywhere and needs no permission.
//
// The fixtures at the bottom are REAL Chrome speech-recognition output,
// captured while recording all seven EPs out loud. Do not tidy them —
// the mangling is exactly what is being tested.
// ============================================================
(function () {
  let pass = 0, fail = 0;
  const out = [];
  const ok = (name, cond) => { cond ? pass++ : fail++; out.push([cond, name]); };
  const head = t => out.push([null, t]);

  const L = (id, n) => EPS.find(e => e.id === id).lines[n];
  const step = (id, n, said) => ok(said, epMatchLine(normSpoken(said), L(id, n)));
  const decn = (id, n, said) => ok(said, epMatch(normSpoken(said), L(id, n).text));
  const scoreOf = (ep, text) => {
    const g = gradeEP(ep, segmentSpoken(normSpoken(text), ep));
    const scored = g.filter(r => r.graded);
    return { ok: scored.filter(r => r.ok).length, n: scored.length };
  };

  head("Airspeed accepts knots, KIAS, or bare numbers");
  ["airspeed 68 knots", "airspeed sixty eight knots", "airspeed 68 kias",
   "airspeed 68", "airspeed sixty eight"].forEach(s => step("eng-fail-takeoff", 0, s));

  head("ENG FAIL accepts the spoken long form");
  ["if due to fire or engine failure", "if due to fire slash engine failure",
   "if due to fire and engine failure", "if due to fire eng fail"].forEach(s => decn("abort-takeoff", 3, s));

  head("A slash accepts slash / and / or / nothing");
  [["eng-fire-flight", 4, "cabin heat %s air off"],
   ["eng-fail-flight", 9, "primer in %s locked"],
   ["elec-fire-flight", 3, "vents %s cabin air closed"]]
    .forEach(([id, n, tpl]) => ["slash", "and", "or", ""].forEach(w =>
      step(id, n, tpl.replace("%s", w).replace(/\s+/g, " ").trim())));

  head("Long-form engine words still match their abbreviations");
  decn("eng-fire-start", 2, "if engine starts");
  decn("eng-fire-start", 2, "if eng starts");
  decn("eng-fire-start", 5, "if engine fails to start");
  decn("eng-fire-start", 1, "continue until engine starts or until mags selected off");
  decn("eng-fail-flight", 2, "if restart will be attempted");

  head("Every EP grades its own text 100% (typed drill unaffected)");
  EPS.forEach(ep => ok(ep.title, ep.lines.every(l => epMatchLine(epLineText(l), l))));

  head("A smooth spoken recitation of each EP scores 100%");
  EPS.forEach(ep => {
    const r = scoreOf(ep, ep.lines.map(l => epLineText(l)).join(" "));
    ok(`${ep.title} — ${r.ok}/${r.n}`, r.ok === r.n);
  });

  head("Real misses are still caught — no false green");
  const e0 = EPS[0], base = e0.lines.map(l => epLineText(l)).join(" ");
  const missCount = t => { const r = scoreOf(e0, t); return r.n - r.ok; };
  ok("wrong mixture reports exactly 1 miss", missCount(base.replace("IDLE CUTOFF", "FULL RICH")) === 1);
  ok("one skipped step reports exactly 1 miss", missCount(base.replace("Flaps AS REQUIRED", "")) === 1);
  ok("two skipped steps report exactly 2 misses", missCount(base.replace("Flaps AS REQUIRED", "").replace("Doors UNLATCHED", "")) === 2);
  ok("silence misses everything", missCount("") === e0.lines.filter(l => l.type !== "note").length);

  head("Skipping steps reports exactly that many misses — no cascade");
  EPS.forEach(ep => {
    const idx = ep.lines.map((l, i) => i).filter(i => ep.lines[i].type !== "note");
    const trial = skip => {
      const said = ep.lines.filter((l, i) => !skip.includes(i)).map(l => epLineText(l)).join(" ");
      return gradeEP(ep, segmentSpoken(normSpoken(said), ep)).filter(r => r.graded && !r.ok).length;
    };
    let bad = 0;
    idx.forEach(i => { if (trial([i]) !== 1) bad++; });
    for (let k = 0; k + 1 < idx.length; k++) if (trial([idx[k], idx[k + 1]]) !== 2) bad++;
    ok(`${ep.title} — every single skip and adjacent pair`, bad === 0);
  });

  head("The callout echo is stripped, not wiped (first line survives)");
  EPS.forEach(ep => {
    const body = ep.lines.map(l => epLineText(l)).join(" ");
    // fused: you answer instantly, so echo + your first line arrive as one result
    const fused = scoreOf(ep, stripEcho(ep.title + " " + body, ep.title));
    ok(`${ep.id} — echo fused with line 1 → ${fused.ok}/${fused.n}`, fused.ok === fused.n);
    // headphones: no echo at all, nothing may be removed
    ok(`${ep.id} — no echo, transcript untouched`, stripEcho(body, ep.title) === body);
    // only the echo was heard: nothing left to grade
    ok(`${ep.id} — echo only → empty`, stripEcho(ep.title, ep.title).trim() === "");
  });

  head("Throttle 1700 RPM (5 sec) — natural phrasings, and only correct numbers");
  const rpmLine = EPS.find(e => e.id === "eng-fire-start").lines.find(l => l.action && l.action.indexOf("1700") >= 0);
  const rpm = (should, said) => ok((should ? "" : "rejects: ") + said, epMatchLine(normSpoken(said), rpmLine) === should);
  ["throttle 1700 for 5 seconds", "throttle 1700 RPM for five secs", "throttle 1700 rpm 5 sec",
   "throttle seventeen hundred for five seconds", "throttle 17 hundred rpm for 5 seconds",
   "throttle 1700 rpm five seconds"].forEach(t => rpm(true, t));
  // a wrong number must never scrape a pass on similarity alone
  ["throttle 2700 rpm for 5 seconds", "throttle 1800 rpm for 5 sec",
   "throttle 1700 for 10 seconds", "throttle 1700 rpm"].forEach(t => rpm(false, t));
  ok("rejects: airspeed 78 knots", !epMatchLine(normSpoken("airspeed 78 knots"), EPS[0].lines[0]));

  head('"unlocked" resolves by context, not by a blanket word swap');
  const primerLine = EPS.find(e => e.id === "eng-fail-flight").lines[9];
  const doorsLine = EPS.find(e => e.id === "eng-fail-takeoff").lines[7];
  // "primer in and locked" is heard as "primer unlocked"; "doors unlatched" as
  // "doors unlocked". One bare mapping cannot serve both.
  ["primer unlocked", "primer unlock", "primer in and locked", "primer in locked"]
    .forEach(t => ok(t, epMatchLine(normSpoken(t), primerLine)));
  ["doors unlocked", "doors unlatched"]
    .forEach(t => ok(t, epMatchLine(normSpoken(t), doorsLine)));
  ok("primer wording does not satisfy the doors line", !epMatchLine(normSpoken("primer unlocked"), doorsLine));
  ok("doors wording does not satisfy the primer line", !epMatchLine(normSpoken("doors unlocked"), primerLine));

  head("Real recognition transcripts from the spike");
  [["eng-fail-takeoff", 8, ["AirSpeed 68 knots turn towards nearest suitable Landing site fuel selector off mixture idle cut off","flaps as required","mags off Master off","doors unlocked"]],
   ["eng-fail-flight",  9, ["speed 68 knots turn towards nearest suitable Landing site if restart will be attempted fuel selector both","mixture full Rich throttle full","car heat on mags both start if prop stopped","Master on","primer in and locked"]],
   ["eng-fire-flight",  6, ["fuel selector off mixture idle cut off","declare May Day Master off","cabin heat and air off turn towards nearest suitable Landing site"]],
   ["abort-takeoff",    5, ["throttle idle","brakes as required maintain directional control","if due to fire or engine failure","emergency shutdown on Deck execute"]],
   ["emerg-shutdown",   4, ["selector off","mixture idle cut off","mags off","Master off","aircraft evacuate as required"]],
   ["eng-fire-start",   8, ["cranking continue until engine starts or until mag selected off","if engine starts","throttle 1700 RPM 5 Seconds","emergency shutdown on Deck execute","if engine fails to start","throttle full emergency shutdown on Deck execute"]],
   ["elec-fire-flight", 8, ["Master off","avionics power switch off all electrical equipment off","vents and Cabin Air closed","if fire remains","fire extinguisher activate as required","cabin windows open as required","land as soon as possible"]]]
    .forEach(([id, want, results]) => {
      const ep = EPS.find(e => e.id === id);
      const r = scoreOf(ep, results.join(" "));
      ok(`${id} — ${r.ok}/${r.n} (expected ${want}/${r.n})`, r.ok === want);
    });

  const rows = out.map(([state, name]) =>
    state === null ? `\n<b>${name}</b>`
      : `  <span class="${state ? "gs-ok-t" : "gs-bad-t"}">${state ? "ok  " : "FAIL"}</span>  ${name.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]))}`).join("\n");

  document.querySelector("main").innerHTML =
    `<header class="page-head"><div class="eyebrow">Flight Phase</div><h1>Self-Test</h1>
     <div class="sub">Grading checks over the spoken-transcript pipeline. No microphone involved.</div></header>
     <div class="feedback ${fail ? "bad" : "good"}"><div class="fb-verdict">${pass} passed, ${fail} failed</div></div>
     <pre class="fp-selftest">${rows}</pre>
     <p class="note"><a class="back-link" href="./">&larr; Back to the simulator</a></p>`;
})();
