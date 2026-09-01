// ============================================================
// EP SIMULATOR — calls a random EP out loud while you are busy with
// something else, listens (or waits) while you recite it, then tells
// you what you missed and goes quiet again.
//
// Speech quirks live in speech.js; transcript handling lives in
// spoken.js; the EPs and the grader come from ground/data.js. What is
// left here is the state machine and the screen.
// ============================================================
const $ = id => document.getElementById(id);
const SET_KEY = "nife-fp-settings", STAT_KEY = "nife-fp-sim";

// A deadline this far past means the machine was asleep, not that we were
// throttled — reschedule instead of blurting an EP the moment the lid opens.
// Well above the ~55s stall observed under ordinary background throttling.
const STALE_MS = 120000;
const RAPID_GAP = 1800;          // a breath between EPs in Rapid Fire

const S = {
  pace: "random", min: 2, max: 6, len: 10, mic: false, silence: 2.5,
  micNow: false,          // mic for THIS session; a forced fallback must not rewrite the preference
  deck: EPS.map(e => e.id),
  running: false, paused: false, gen: 0,
  order: [], pos: 0, round: 0, results: [],
  phase: "idle", deadline: 0, silentRuns: 0, sleptNote: false,
};

// ---------- settings ----------
function loadSettings() {
  try {
    const v = JSON.parse(localStorage.getItem(SET_KEY) || "null");
    if (!v) return;
    if (v.pace) S.pace = v.pace;
    if (typeof v.min === "number") S.min = v.min;
    if (typeof v.max === "number") S.max = v.max;
    if (typeof v.len === "number") S.len = v.len;
    if (typeof v.mic === "boolean") S.mic = v.mic;
    if (typeof v.silence === "number") S.silence = Math.min(15, Math.max(1, v.silence));
    if (Array.isArray(v.deck) && v.deck.length) S.deck = v.deck.filter(id => EPS.some(e => e.id === id));
    if (!S.deck.length) S.deck = EPS.map(e => e.id);
  } catch (e) { /* defaults are fine */ }
}
function saveSettings() {
  try { localStorage.setItem(SET_KEY, JSON.stringify({ pace: S.pace, min: S.min, max: S.max, len: S.len, mic: S.mic, silence: S.silence, deck: S.deck })); } catch (e) {}
}
function stats() {
  try { return JSON.parse(localStorage.getItem(STAT_KEY) || "null") || { n: 0, perfect: 0, best: {} }; } catch (e) { return { n: 0, perfect: 0, best: {} }; }
}
function recordStat(ep, ok, n) {
  try {
    const s = stats();
    s.n++; if (ok === n) s.perfect++;
    const pct = Math.round(ok / Math.max(1, n) * 100);
    s.best[ep.id] = Math.max(s.best[ep.id] || 0, pct);
    localStorage.setItem(STAT_KEY, JSON.stringify(s));
  } catch (e) {}
}
function renderStats() {
  const s = stats();
  $("fp-stats").textContent = s.n ? `${s.n} recited here · ${s.perfect} clean` : "";
}

// ---------- setup screen ----------
function pickGroup(sel, attr, val) {
  document.querySelectorAll(sel).forEach(b => b.classList.toggle("selected", b.dataset[attr] === String(val)));
}
function renderDeck() {
  $("fp-deck").innerHTML = EPS.map(ep =>
    `<button class="btn toggle auto${S.deck.includes(ep.id) ? " selected" : ""}" data-ep="${ep.id}" type="button">${ep.title}</button>`).join("");
}
function syncSetup() {
  pickGroup("[data-pace]", "pace", S.pace);
  pickGroup("[data-len]", "len", S.len);
  pickGroup("[data-mic]", "mic", S.mic ? "on" : "off");
  $("fp-range").classList.toggle("hidden", S.pace !== "random");
  $("fp-min").value = S.min; $("fp-max").value = S.max;
  // the pause window only means anything when something is listening
  $("fp-pause-row").classList.toggle("hidden", !S.mic);
  $("fp-pause-hint").classList.toggle("hidden", !S.mic);
  $("fp-pause").value = S.silence;
  renderDeck();
}

document.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.pace) { S.pace = b.dataset.pace; saveSettings(); syncSetup(); }
  else if (b.dataset.len) { S.len = +b.dataset.len; saveSettings(); syncSetup(); }
  else if (b.dataset.mic) { S.mic = b.dataset.mic === "on"; saveSettings(); syncSetup(); }
  else if (b.dataset.ep) {
    const id = b.dataset.ep, i = S.deck.indexOf(id);
    if (i >= 0) { if (S.deck.length > 1) S.deck.splice(i, 1); } else S.deck.push(id);
    saveSettings(); renderDeck();
  }
});
["fp-min", "fp-max"].forEach(id => $(id).addEventListener("change", () => {
  const lo = Math.max(0, +$("fp-min").value || 0), hi = Math.max(lo, +$("fp-max").value || 0);
  S.min = lo; S.max = hi; $("fp-min").value = lo; $("fp-max").value = hi; saveSettings();
}));
$("fp-pause").addEventListener("change", () => {
  S.silence = Math.min(15, Math.max(1, +$("fp-pause").value || 2.5));
  $("fp-pause").value = S.silence; saveSettings();
});

// ---------- speaker check ----------
// The drill is entirely audio, so hearing it at the volume you will actually
// be sitting at matters more than any setting on this page.
const SOUND_TEST = "Engine fire in flight. If you can hear this, your speakers are set.";
$("fp-sound-test").addEventListener("click", async () => {
  const b = $("fp-sound-test");
  b.disabled = true;
  $("fp-sound-status").textContent = "Playing…";
  Speech.init();
  let r = await Speech.say(SOUND_TEST);
  if (!r.spoke) { Speech.reset(); await Speech.wait(400); r = await Speech.say(SOUND_TEST); }
  $("fp-sound-status").textContent = r.spoke
    ? "Played. Did not hear it? Turn the volume up and play it again."
    : "No sound came out (" + (r.error || "unknown") + "). Quit the browser completely, reopen it, and try again.";
  b.disabled = false;
});

// ---------- capability gating ----------
function gateMic() {
  const c = Speech.capabilities();
  if (!c.tts) {
    $("fp-start").disabled = true;
    $("fp-start-status").textContent = c.reason;
  }
  if (!c.recognition) {
    S.mic = false;
    $("fp-mic-on").disabled = true;
    $("fp-mic-note").textContent = c.reason;
    syncSetup();
  }
}

// ---------- screens ----------
function show(which) {
  ["fp-setup", "fp-run", "fp-done-screen"].forEach(id => $(id).classList.toggle("hidden", id !== which));
  window.scrollTo(0, 0);
}

const PHASE_TEXT = {
  waiting: "Standing by", announcing: "Listen up", listening: "Listening — recite it",
  reciting: "Recite it out loud", grading: "Checking", reading: "Reading back", paused: "Paused",
};
function setPhase(p) {
  S.phase = p;
  $("fp-state").textContent = PHASE_TEXT[p] || "";
  const waiting = p === "waiting";
  $("fp-clock").classList.toggle("hidden", !waiting || S.pace === "rapid");
  $("fp-clock-sub").classList.toggle("hidden", !waiting || S.pace === "rapid");
  $("fp-check").classList.toggle("hidden", p !== "reciting");
  $("fp-skip").classList.toggle("hidden", !waiting);
  if (waiting) { $("fp-title").textContent = ""; $("fp-live").textContent = ""; }
}
function renderClock() {
  if (S.phase !== "waiting" || S.pace === "rapid") return;
  const left = Math.max(0, S.deadline - Date.now());
  const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
  $("fp-clock").textContent = m + ":" + String(s).padStart(2, "0");
}
function renderCounter() {
  $("fp-counter").textContent = S.len ? `EP ${Math.min(S.round + 1, S.len)} of ${S.len}` : `EP ${S.round + 1}`;
  const done = S.results.length;
  const clean = S.results.filter(r => r.ok === r.n).length;
  $("fp-mode-label").textContent = (S.micNow ? "Mic · graded" : "On screen")
    + (done ? ` · ${clean}/${done} clean` : "");
}
function note(msg) {
  const el = document.createElement("p");
  el.className = "report-hint";
  el.textContent = msg;
  $("fp-result").prepend(el);
}

// ---------- the EP list, shown on screen ----------
function renderEP(ep, graded) {
  const rows = ep.lines.map((l, i) => {
    const g = graded && graded[i];
    const marker = l.type === "decision" ? (l.plain ? "" : "&bull;") : `*${l.n}.`;
    const cls = !g || !g.graded ? "" : g.ok ? " gs-ok" : " gs-bad";
    const heard = g && g.graded && !g.ok && g.given ? `<span class="gs-key">heard: ${esc(g.given)}</span>` : "";
    return `<div class="gs-step decision${cls}"><span class="gs-n">${marker}</span><span class="gs-field">${esc(epLineText(l))}${heard}</span></div>`;
  }).join("");
  return `<div class="gs-ep">${rows}</div>`;
}
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- deck ----------
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function reshuffle() { S.order = shuffle(S.deck); S.pos = 0; }
function currentEP() {
  if (S.pos >= S.order.length) reshuffle();
  return EPS.find(e => e.id === S.order[S.pos]);
}

// ---------- the clock ----------
function scheduleNext() {
  const gap = S.pace === "rapid" ? RAPID_GAP : (S.min + Math.random() * Math.max(0, S.max - S.min)) * 60000;
  S.deadline = Date.now() + gap;
  setPhase("waiting");
  renderClock();
}
setInterval(() => {
  if (!S.running || S.paused || S.phase !== "waiting") return;
  const late = Date.now() - S.deadline;
  if (late < 0) return renderClock();
  if (late > STALE_MS) {                    // asleep, not throttled
    note("The computer slept — the clock restarted rather than calling an EP at you the moment it woke.");
    return scheduleNext();
  }
  runRound();
}, 250);

// ---------- a round ----------
function silentCheck(spoke) {
  if (spoke.spoke) { S.silentRuns = 0; return true; }
  S.silentRuns++;
  if (S.silentRuns >= 3) {
    endSession("Stopped — three announcements in a row made no sound. Quit the browser completely and reopen it, then start again.");
    return false;
  }
  note("That announcement made no sound (" + (spoke.error || "unknown") + ").");
  return true;
}

async function runRound() {
  const gen = S.gen, ep = currentEP();
  setPhase("announcing");
  $("fp-result").innerHTML = "";
  $("fp-title").textContent = ep.title;
  renderCounter();

  const announced = Speech.say(ep.title);
  const listening = S.micNow ? Speech.listen({
    silenceMs: S.silence * 1000,
    leadMs: Math.max(7000, S.silence * 2000),
    arm: announced.then(() => Speech.wait(250)),
    onArmed: () => { if (gen === S.gen) setPhase("listening"); },
    onPartial: t => { if (gen === S.gen) $("fp-live").textContent = stripEcho(t, ep.title); },
  }) : null;

  const spoke = await announced;
  if (gen !== S.gen) return;
  if (!silentCheck(spoke)) return;

  if (!S.micNow) { setPhase("reciting"); return; }   // buttons drive it from here

  const heard = await listening;
  if (gen !== S.gen) return;
  $("fp-live").textContent = "";

  // The mic can fail mid-session. Drop to the on-screen path for the rest of it
  // rather than ending the session or, worse, grading silence as a failed
  // recitation. S.mic (the saved preference) is deliberately left alone.
  const DEAD = { "not-allowed": "The microphone was blocked.", "service-not-allowed": "The browser blocked speech recognition.",
                 "audio-capture": "No microphone was found.", "network": "Speech recognition lost its connection — it needs one to work.",
                 "unsupported": "This browser cannot do speech recognition." };
  if (DEAD[heard.reason]) {
    S.micNow = false;
    renderCounter();
    note(DEAD[heard.reason] + " The rest of this session is on screen — recite, then press Check Answer.");
    await Speech.say("Microphone unavailable. Switching to on screen.");
    if (gen !== S.gen) return;
    setPhase("reciting");
    return;
  }

  setPhase("grading");
  // Drop the callout the mic picked up off our own speakers before grading.
  const youSaid = stripEcho(heard.transcript, ep.title);
  const graded = gradeEP(ep, segmentSpoken(normSpoken(youSaid), ep));
  const scored = graded.filter(r => r.graded);
  const missed = scored.filter(r => !r.ok);
  const ok = scored.length - missed.length;

  $("fp-result").innerHTML =
    `<div class="feedback ${missed.length ? "bad" : "good"}"><div class="fb-verdict">${ok} of ${scored.length}${missed.length ? "" : " — verbatim. Good job."}</div></div>`
    + renderEP(ep, graded)
    + `<p class="report-hint fp-heard">Heard: ${esc(youSaid) || "<em>nothing</em>"}</p>`;

  S.results.push({ id: ep.id, title: ep.title, ok, n: scored.length });
  recordStat(ep, ok, scored.length);

  setPhase("reading");
  if (!youSaid) {
    await Speech.say("Nothing heard. Here it is.");
    for (const l of ep.lines) { if (gen !== S.gen) return; await Speech.say(epLineText(l)); }
  }
  else if (!missed.length) await Speech.say("All " + scored.length + ". Good job.");
  else {
    await Speech.say(missed.length === 1 ? "One miss." : missed.length + " misses.");
    for (const m of missed) { if (gen !== S.gen) return; await Speech.say(m.expected); }
  }
  if (gen !== S.gen) return;
  nextRound();
}

function nextRound() {
  S.pos++; S.round++;
  renderCounter();
  if (S.len && S.round >= S.len) return endSession();
  scheduleNext();
}

// ---------- no-mic buttons ----------
$("fp-check").addEventListener("click", () => {
  if (S.phase !== "reciting") return;
  const ep = currentEP();
  $("fp-result").innerHTML = renderEP(ep);
  $("fp-check").classList.add("hidden");
  $("fp-done").classList.remove("hidden");
  $("fp-done").focus();
});
$("fp-done").addEventListener("click", () => {
  $("fp-done").classList.add("hidden");
  $("fp-result").innerHTML = "";
  nextRound();
});
$("fp-skip").addEventListener("click", () => { if (S.phase === "waiting") { S.deadline = Date.now(); runRound(); } });

// ---------- session control ----------
async function startSession() {
  const btn = $("fp-start");
  btn.disabled = true;
  $("fp-start-status").textContent = "Checking sound…";

  Speech.init();                                     // inside the click, where iOS needs it
  let r = await Speech.say("Simulator ready.");
  if (!r.spoke) { Speech.reset(); await Speech.wait(400); r = await Speech.say("Simulator ready."); }
  if (!r.spoke) {
    $("fp-start-status").textContent = "No sound came out (" + (r.error || "unknown") +
      "). The whole drill is audio, so it will not start. Quit the browser completely, reopen it, and try again.";
    btn.disabled = false;
    return;
  }
  $("fp-start-status").textContent = "";
  btn.disabled = false;

  S.gen++; S.running = true; S.paused = false;
  S.round = 0; S.results = []; S.silentRuns = 0; S.micNow = S.mic;
  reshuffle();
  Speech.keepAlive(true);
  Speech.wakeLock(true);
  $("fp-result").innerHTML = "";
  $("fp-pause").textContent = "Pause";
  show("fp-run");
  renderCounter();
  if (S.pace === "rapid") { S.deadline = Date.now(); setPhase("waiting"); runRound(); }
  else scheduleNext();
}

function endSession(msg) {
  S.gen++; S.running = false; S.paused = false;
  Speech.cancel(); Speech.keepAlive(false); Speech.wakeLock(false);
  if (!S.round) { show("fp-setup"); if (msg) $("fp-start-status").textContent = msg; renderStats(); return; }
  const head = msg ? `<p class="report-hint">${esc(msg)}</p>` : "";
  if (S.results.length) {
    const done = S.results.length;
    const ok = S.results.reduce((a, r) => a + r.ok, 0), n = S.results.reduce((a, r) => a + r.n, 0);
    const clean = S.results.filter(r => r.ok === r.n).length;
    $("fp-final").textContent = Math.round(ok / Math.max(1, n) * 100) + "%";
    $("fp-final-sub").textContent = `${done} EP${done > 1 ? "s" : ""} · ${clean} verbatim · ${ok} of ${n} lines`;
    $("fp-breakdown").innerHTML = head
      + S.results.map(r => `<div class="fp-row"><span>${esc(r.title)}</span><b class="${r.ok === r.n ? "gs-ok-t" : "gs-bad-t"}">${r.ok}/${r.n}</b></div>`).join("");
  } else {
    // Mic off: the rounds happened but nothing was graded, so there is no score
    // to show — say what did happen rather than dumping back to setup silently.
    $("fp-final").textContent = String(S.round);
    $("fp-final-sub").textContent = `EP${S.round > 1 ? "s" : ""} called · not scored`;
    $("fp-breakdown").innerHTML = head + `<p class="report-hint">You checked these against the answer yourself. Turn the microphone on if you want them graded and read back.</p>`;
  }
  show("fp-done-screen");
  renderStats();
}

$("fp-start").addEventListener("click", startSession);
$("fp-stop").addEventListener("click", () => endSession());
$("fp-again").addEventListener("click", startSession);
$("fp-back").addEventListener("click", () => { show("fp-setup"); renderStats(); });
$("fp-pause").addEventListener("click", () => {
  if (!S.running) return;
  S.paused = !S.paused;
  $("fp-pause").textContent = S.paused ? "Resume" : "Pause";
  if (S.paused) { S.gen++; Speech.cancel(); setPhase("paused"); Speech.keepAlive(false); }
  else { Speech.keepAlive(true); scheduleNext(); }
});
window.addEventListener("pagehide", () => { Speech.cancel(); Speech.keepAlive(false); });

// ---------- go ----------
// ?selftest=1 runs the grading checks instead of the drill — see selftest.js.
if (/[?&]selftest=1\b/.test(location.search)) {
  const t = document.createElement("script");
  t.src = "selftest.js?v=r25";
  document.body.appendChild(t);
} else {
  loadSettings();
  gateMic();
  syncSetup();
  renderStats();
}
