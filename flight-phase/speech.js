// ============================================================
// SPEECH — the browser's voice and ears, behind one small door.
// Knows nothing about EPs and touches no DOM. Everything quirky,
// vendor-prefixed, or known-buggy is isolated here so the drill
// itself stays readable.
//
//   Speech.capabilities()  what this browser can do, and why not
//   Speech.init()          MUST be called from a user gesture
//   Speech.say(text)       -> Promise, resolves when the voice stops
//   Speech.listen(opts)    -> Promise<{ results, transcript, reason }>
//   Speech.cancel()        stop talking and listening, now
//   Speech.keepAlive(on)   silent audio, so a hidden tab isn't throttled
//   Speech.wakeLock(on)    best-effort: keep the screen awake
// ============================================================
window.Speech = (function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;

  function capabilities() {
    const tts = !!synth && typeof window.SpeechSynthesisUtterance === "function";
    const recognition = !!SR;
    let reason = "";
    if (!tts) reason = "This browser has no speech synthesis, so nothing can be called out.";
    else if (!recognition) reason = "This browser has no speech recognition — Firefox has never shipped it. Chrome, Edge, or Safari for mic mode.";
    return { tts, recognition, wakeLock: !!(navigator.wakeLock && navigator.wakeLock.request), reason };
  }

  // ---------- init: the user gesture that unlocks audio ----------
  // iOS refuses to speak unless the first utterance comes from a real tap,
  // and an AudioContext starts suspended until a gesture resumes it.
  let ctx = null;
  function init() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    // No unlock utterance here on purpose. Chrome and iOS only require that the
    // FIRST speak happen inside a user gesture, and it does — the caller's
    // sound check calls say() synchronously from the click. An extra priming
    // utterance just leaves something pending for the next say() to cancel.
  }

  // Chrome can fail silently when no voice is assigned, and getVoices() is
  // empty until the list loads. Prefer a local en-US voice — a network voice
  // would break the drill offline.
  let voice = null;
  function pickVoice() {
    if (voice || !synth) return voice;
    const all = synth.getVoices() || [];
    if (!all.length) return null;
    voice = all.find(v => v.localService && /^en[-_]US/i.test(v.lang) && v.default)
         || all.find(v => v.localService && /^en[-_]US/i.test(v.lang))
         || all.find(v => v.localService && /^en[-_]/i.test(v.lang))
         || all[0];
    return voice;
  }
  if (synth && synth.addEventListener) synth.addEventListener("voiceschanged", () => { voice = null; pickVoice(); });

  // ---------- say ----------
  // Resolves { spoke, error }. `spoke` is the only honest signal that sound
  // actually came out — a blocked or errored utterance must NOT look like a
  // successful one, or the drill runs on in silence and seems to be working.
  // Watchdog behind onend because Chrome drops it often enough to hang us.
  function say(text) {
    return new Promise(resolve => {
      if (!synth || !text) return resolve({ spoke: false, error: "unavailable" });
      const busy = synth.speaking || synth.pending;
      if (busy) { try { synth.cancel(); } catch (e) {} }
      let done = false, started = false, watch = 0;
      const finish = err => { if (done) return; done = true; clearTimeout(watch); resolve({ spoke: started, error: err || "" }); };
      const start = () => {
        const u = new SpeechSynthesisUtterance(String(text));
        u.lang = "en-US";
        const v = pickVoice(); if (v) u.voice = v;
        watch = setTimeout(() => finish(started ? "" : "timeout"), Math.max(4000, String(text).length * 120 + 2000));
        u.onstart = () => { started = true; };
        u.onend = () => finish("");
        u.onerror = e => finish((e && e.error) || "error");
        try { synth.speak(u); } catch (e) { finish("throw"); }
      };
      // cancel() flushes the queue a task later, taking anything queued in the
      // same task with it — so an interrupting say() must wait one turn or it
      // cancels itself. When nothing is speaking we start synchronously, which
      // keeps the first utterance inside the user gesture where iOS needs it.
      if (busy) setTimeout(start, 100); else start();
    });
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));

  // ---------- listen ----------
  // Accumulates final results until you go quiet. Two silence windows: a
  // generous one before you have said anything (you need a beat to think),
  // a short one after. Chrome ends recognition on its own even with
  // continuous set, so onend restarts it — capped, so it cannot spin.
  //
  // opts.arm: a promise. Recognition starts NOW but stays disarmed until arm
  // settles, then throws away everything it heard and begins for real. Pass
  // the announcement's promise and the recognizer is already warm and
  // connected the instant you start talking — otherwise its startup handshake
  // eats your first word, every single time. Whatever it transcribed while
  // disarmed was the announcement coming back through the speakers, which is
  // exactly what we want to discard.
  let rec = null;
  function listen(opts) {
    const o = opts || {};
    const silenceMs = o.silenceMs || 2500, leadMs = o.leadMs || 7000, maxMs = o.maxMs || 90000;
    return new Promise(resolve => {
      if (!SR) return resolve({ results: [], transcript: "", reason: "unsupported" });
      const r = new SR();
      r.continuous = true; r.interimResults = true; r.lang = "en-US";
      const results = [];
      let done = false, heard = false, restarts = 0, silence = null, hard = null;
      let armed = !o.arm, armedAt = Date.now();
      const born = Date.now();
      // safety net in case arm never settles
      const overall = setTimeout(() => finish("armtimeout"), maxMs + 60000);

      function bump() {
        if (!armed) return;
        clearTimeout(silence);
        silence = setTimeout(() => finish(heard ? "silence" : "no-speech"), heard ? silenceMs : leadMs);
      }
      // Arming starts the silence timers. It deliberately does NOT discard what
      // was heard during the announcement: when you start reciting the instant
      // the callout ends, Chrome never finalises a result at the boundary, so
      // the echo and your first words arrive as ONE result and dropping it ate
      // your opening line. The caller strips the announcement by text instead.
      function arm() {
        if (done || armed) return;
        armed = true; armedAt = Date.now();
        hard = setTimeout(() => finish("maxtime"), maxMs);
        if (o.onArmed) o.onArmed();
        bump();
      }
      function finish(reason) {
        if (done) return; done = true;
        clearTimeout(hard); clearTimeout(silence); clearTimeout(overall);
        try { r.onend = null; r.onerror = null; r.abort(); } catch (e) {}
        if (rec === r) rec = null;
        resolve({ results, transcript: results.join(" "), reason });
      }
      r.onresult = e => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript.trim();
          if (e.results[i].isFinal) { if (t) results.push(t); } else interim += t + " ";
        }
        if (armed) {
          heard = true;
          if (o.onPartial) o.onPartial((results.join(" ") + " " + interim).trim());
        }
        bump();
      };
      r.onerror = e => {
        if (e.error === "no-speech" || e.error === "aborted") return;   // let the timers decide
        finish(e.error);
      };
      r.onend = () => {
        if (done) return;
        if (restarts++ < 12 && Date.now() - (armed ? armedAt : born) < maxMs) {
          try { r.start(); } catch (e) { finish("restart-failed"); }
        } else finish("ended");
      };
      rec = r;
      // Chrome throws if the previous recognition has not finished aborting.
      // One retry, because losing a whole round to a race is not acceptable.
      try { r.start(); }
      catch (e) { setTimeout(() => { if (!done) { try { r.start(); } catch (e2) { finish("start-failed"); } } }, 250); }
      if (o.arm) Promise.resolve(o.arm).then(arm, arm); else { hard = setTimeout(() => finish("maxtime"), maxMs); bump(); }
    });
  }

  // Chrome's speech service can wedge: `speaking` stays true, no events ever
  // fire, and every later utterance queues behind the ghost. Nothing in the
  // page can truly fix that — only restarting the browser does — but clearing
  // the queue is worth one attempt before giving up on the user's behalf.
  function reset() {
    if (!synth) return;
    try { synth.cancel(); synth.resume(); } catch (e) {}
  }
  function state() {
    return synth ? { speaking: synth.speaking, pending: synth.pending, paused: synth.paused } : null;
  }

  function cancel() {
    if (synth) { try { synth.cancel(); } catch (e) {} }
    if (rec) { try { rec.onend = null; rec.abort(); } catch (e) {} rec = null; }
  }

  // ---------- keepAlive ----------
  // Chrome throttles timers in a hidden tab to once a minute after five
  // minutes. A tab that is playing audio is exempt — so we play something,
  // far too quiet to hear but loud enough to count. Measured in the spike: it
  // reduces but does not eliminate throttling (one ~55s stall was still seen),
  // so this is belt-and-braces. The deadline tick in sim.js is the real
  // guarantee — see the note there on why a late callout is harmless here.
  let osc = null, gain = null;
  function keepAlive(on) {
    if (on) {
      if (!ctx || osc) return;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      osc = ctx.createOscillator(); gain = ctx.createGain();
      gain.gain.value = 0.003; osc.frequency.value = 50;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
    } else {
      if (osc) { try { osc.stop(); osc.disconnect(); } catch (e) {} osc = null; }
      if (gain) { try { gain.disconnect(); } catch (e) {} gain = null; }
    }
  }

  // ---------- wakeLock ----------
  // Keeps a propped-up phone from sleeping. Nothing can survive the screen
  // being locked by hand or the tab being backgrounded on iOS.
  let lock = null, wantLock = false;
  async function wakeLock(on) {
    wantLock = !!on;
    if (!navigator.wakeLock || !navigator.wakeLock.request) return;
    if (on) {
      if (lock) return;
      try { lock = await navigator.wakeLock.request("screen"); lock.addEventListener("release", () => { lock = null; }); } catch (e) { lock = null; }
    } else if (lock) { try { await lock.release(); } catch (e) {} lock = null; }
  }
  document.addEventListener("visibilitychange", () => {
    if (wantLock && !lock && document.visibilityState === "visible") wakeLock(true);
  });

  // Chrome keeps talking after you navigate away unless it is told not to.
  window.addEventListener("pagehide", () => { cancel(); keepAlive(false); wakeLock(false); });

  return { capabilities, init, say, wait, listen, cancel, reset, state, keepAlive, wakeLock };
})();
