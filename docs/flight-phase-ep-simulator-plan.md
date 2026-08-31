# Flight Phase — EP Simulator

**Status:** built — all phases complete, pending a real voice session
**Date:** 2026-08-31

A hands-free drill that calls out a random emergency procedure over the
speakers while you are doing something else, gives you room to recite it out
loud, and then tells you what you missed. The point is not to test recall in a
quiet room — the EP Drill already does that — it is to force recall while your
attention is somewhere else.

---

## 1. Decisions already made

| Question | Decision |
|---|---|
| Module scope | Flight Phase ships as **one page, one drill**. Nothing speculative. |
| The callout | The EP title, read plainly: *"Engine fire in flight."* Read straight from `EPS`. |
| Loop, mic on | Ears only. It hears you stop, grades you, and **reads back only the lines you missed**. |
| Loop, mic off | On-screen. **Check Answer** reveals the filled EP, **Done** advances. Not scored. |
| Pacing | A mode, not a slider: **Rapid Fire** or **Random Interval** with a min/max range. |
| Also on setup | Session length; which EPs are in the deck; a speaker check; the mic pause window. No voice or rate controls. |
| Architecture | Thin module + isolated speech layer (approach 3). |

## 2. Files

New:

```
flight-phase/index.html    setup + running + summary, all one page
flight-phase/speech.js     TTS, recognition, keepalive, wake lock — no DOM, no EP knowledge
flight-phase/spoken.js     normSpoken + segmentSpoken — pure, no DOM, no browser APIs
flight-phase/sim.js        scheduler state machine, grading glue, UI
docs/flight-phase-ep-simulator-plan.md
```

Modified:

```
ground/data.js             normEP only — see the note in §6
style.css                  small additive block, version bumped r20 → r21
48 × *.html                site-bar link + style.css version bump (scripted)
index.html                 third hub-link card
gen-sw.py                  add "./flight-phase/" to the directory URL list
sw.js                      regenerated
```

`flight-phase/index.html` **is** the simulator — there is no separate landing
page. The setup screen is the landing content, which is also where the
capability and privacy disclosures live. If a second Flight Phase drill ever
arrives, that is the moment `index.html` becomes a hub and the sim moves to
`sim.html`. Not before.

EP data and grading are reused from `ground/data.js` via
`<script src="../ground/data.js">`. The only change inside `ground/` is to
`normEP`, and it was forced — see §6.

## 3. Reused, not rebuilt

`ground/data.js` already carries most of the hard part:

- `EPS` — seven procedures, `{id, title, lines[]}` with `step` / `decision` lines.
- `gradeEP(ep, text)` — DP-aligns a free-text recitation against the expected
  lines and returns `{line, expected, given, sim, ok, graded}` per line. Splits
  input on `\n+`.
- `normEP(s)` — already normalizes for **spoken** phrasing: `as required` → `as
  req`, strips `KIAS`, `magnetos` → `mags`, `cut off` → `cutoff`, slashes to
  spaces, drops filler words.
- `epLineText(line)`, `epMatchLine`, `similarity`.

CSS vocabulary to reuse as-is, no new classes needed for most of it:
`.center-box`, `.setup-group`, `.setup-label`, `.choice-row`, `.btn.toggle`
(+`.selected`, +`.auto`), `.btn.submit`, `.btn.primary`, `.timer-display`,
`.timer-sub`, `.feedback.good/.bad`, `.gs-ep`, `.gs-step`, `.gs-n`,
`.gs-field`, `.gs-ok`, `.gs-bad`, `.history-box`, `.report-hint`, `.hidden`.

## 4. Phase 0 — the spike (gates everything else)

Two things are unproven, and the second one decides whether the chosen feedback
mode is safe to ship.

Build a throwaway probe page in the scratchpad — **not** in the repo:
`speech-probe.html`.

**Probe A — does the loop survive a hidden tab?**
Two timers set 5 minutes out, one with the silent-audio keepalive running and
one without. Switch tabs, come back, read the log: intended fire time vs.
actual, for each. Chrome throttles timers in hidden tabs to once per minute
after five minutes; a tab that is playing audio is exempt. This confirms the
exemption works here, and confirms the deadline-based tick self-corrects even
when it doesn't.

**Probe B — how badly does recognition mangle this vocabulary?**
Announce an EP, open recognition, recite it normally, then dump: the raw final
results array, the joined transcript, the `gradeEP` result against the real
data, and which lines it scored wrong. Repeat across all seven EPs.

**What Probe B decides.** The chosen mode — grade it, read back only the misses
— is the most useful option and the most fragile one. If recognition hears
"mags off" as "max off", the drill confidently tells you that you blew a step
you nailed, which is worse than no feedback at all. Probe B produces the actual
error list. Then:

- Clean → ship as chosen.
- A handful of repeatable homophones → they go into `normSpoken()` (§6) and we
  ship as chosen.
- Mangled beyond rescue → fall back to reading the whole EP back, and say so
  before building the rest.

Probe B's error list is the **only** legitimate source for `normSpoken`'s
homophone map. Do not guess entries into it.

**`speech.js` is authored during this phase**, against the probe page, and
graduates into `flight-phase/` unchanged. The probe HTML is thrown away.

## 4b. Phase 0 results — both probes run

**Probe B: PASSED. The chosen feedback mode ships as chosen.** Recognition
handles this vocabulary well. Across eight recorded recitations of all seven
EPs, after `normSpoken` + `segmentSpoken`, there were **no false misses from
mangled vocabulary** — every remaining miss was either a line genuinely not
recited or a clipped first word (below).

`segmentSpoken` is load-bearing, not a nicety. Same recordings, graded with
recognition's own line breaks vs. with segmentation:

| EP | as-heard | segmented |
|---|---|---|
| eng-fail-takeoff | 1/8 | 8/8 |
| eng-fail-flight | 2/10 | 9/10 |
| eng-fire-flight | 0/6 | 6/6 |
| abort-takeoff | 2/5 | 5/5 |
| emerg-shutdown | 4/5 | 4/5 |
| eng-fire-start | 5/8 | 8/8 |
| elec-fire-flight | 6/8 | 8/8 |

Three real recognition errors were observed and are now in `HOMOPHONE`, each
from an actual transcript, none guessed: `may day → mayday` (MAYDAY came back
as two words every time), `unlocked → unlatched` (UNLATCHED is a rare word and
recognition reaches for the common one), `car heat → carb heat` (which had been
scraping a pass at 0.92 — one bad day from being a false miss).

> **`unlocked → unlatched` is a judgement call worth revisiting.** It means
> saying "doors unlocked" is graded correct. That is the right trade while
> recognition mishears the word this reliably, but it does forgive a genuine
> wrong answer.

The eight raw transcripts are kept as regression fixtures. They are real
Chrome output and must not be tidied — the mangling is the point.

**Probe A: the deadline design is validated; the keepalive is not the thing
doing the work.** Six minutes, keepalive on, tab mostly hidden:

- Normal hidden-tab drift was ~390ms — timers throttled to about 1/s. Harmless.
- **One ~55s stall still occurred despite the keepalive**, around the 2-minute
  mark. The audio exemption reduces throttling but did not eliminate it.
- The deadline tick **self-corrected immediately**, back to 16ms on the next
  checkpoint. The naive `setTimeout` chain run alongside it drifted
  monotonically — 0.4s, 1.4s, 2.4s, 3.4s, 4.4s, 5.4s — and never recovered.
- Every checkpoint from +30s to +360s fired **exactly once**. Nothing skipped,
  nothing doubled.

The conclusion that matters: **this drill is unusually tolerant of throttling.**
In Random Interval mode the wait is deliberately unpredictable, so a callout
arriving 55s late is indistinguishable from one that was always going to arrive
then. What would actually break the drill is a skipped or doubled announcement,
and the deadline design makes both impossible. Rapid Fire is the one mode where
a stall would be felt, and it implies you are engaged with the tab anyway.

So the keepalive stays — it is nearly free and it demonstrably reduces drift —
but it is belt-and-braces, and no part of the design depends on it working.

## 5. `speech.js` — the isolated layer

Everything browser-quirky and untrustworthy lives here, behind a small
interface. No DOM, no knowledge of EPs.

```js
window.Speech = {
  capabilities(),   // { tts, recognition, wakeLock, reason }
  init(),           // MUST be called from a user gesture
  say(text),        // → Promise, resolves on utterance end
  listen(opts),     // → Promise<{ results[], transcript, reason }>
  cancel(),         // stop speaking and listening now
  keepAlive(on),    // silent audio loop
  wakeLock(on),     // best-effort screen wake lock
}
```

Details that matter:

- **`init()` from a user gesture.** iOS will not speak otherwise, and the
  `AudioContext` starts suspended. Called on Start.
- **`say()`** resolves on `utterance.onend`, with a watchdog timeout that
  resolves anyway — Chrome's `speechSynthesis` is known to stall and drop
  `onend`. Utterances here are short (a title, one EP line), which avoids the
  ~15s silent-failure bug. `speechSynthesis.cancel()` on `pagehide`, or Chrome
  keeps talking after you navigate away.
- **`listen()`** uses `SpeechRecognition || webkitSpeechRecognition`,
  `continuous = true`, `interimResults = true`, `lang = "en-US"`. Accumulates
  final results. A silence timer resets on every result; resolves on
  `silenceMs` (default 2500) or `maxMs` (default 90000). Chrome fires `onend`
  on its own even when `continuous` — restart and keep accumulating unless a
  stop condition is met, with a restart cap so it cannot spin.
- **`listen({ arm })` pre-warms the recognizer.** Recognition starts at the
  same moment as the announcement but stays *disarmed*: no silence timers, no
  partial callbacks, and when `arm` settles it throws away everything it heard
  so far. Pass the announcement's own promise as `arm`.

  This replaces "wait for `say()` to resolve, then start listening", which ate
  the first word of every single recitation — observed on the first real voice
  run. The recognizer's startup handshake takes long enough that by the time it
  is hearing anything, you have already said "Airspeed". Starting it early
  costs nothing, because whatever it transcribes during the announcement is
  our own voice through the speakers, and that is exactly what gets discarded.
  A 250ms guard after the announcement covers the speaker tail.
- **`keepAlive(true)`** runs an oscillator at gain ~0.0001 into the
  destination — audible enough to the browser to count as playing audio,
  inaudible to you. This is what keeps timers unthrottled in a hidden tab.
  Chrome will show the speaker icon on the tab; that is acceptable and
  arguably useful feedback.
- **`wakeLock(true)`** best-effort, re-acquired on `visibilitychange`. Lets a
  phone propped on the desk stay awake. It does **not** survive backgrounding
  or a manual screen lock on iOS — nothing can.
- Errors surfaced by name, not swallowed: `not-allowed`, `no-speech`,
  `network`, `aborted`, `audio-capture`.

## 6. Grading a spoken recitation — `sim.js`

Recognition gives a word stream broken at whatever pauses it noticed, which may
or may not line up with the EP's lines. Recite smoothly and you get one long
final result; `gradeEP` splits on newlines, so that would align to one expected
line and score everything else missed. So we do the splitting ourselves.

**`segmentSpoken(text, ep) → text`** — a DP that hands each expected line the
run of words maximizing total similarity across the *whole* recitation, with
zero words allowed for a line you never said. Reuses the existing
`similarity()`. ~20 lines, ~17ms per round.

> Greedy left-to-right was specified here first and the spike killed it. It
> cascades: skip one step and every line after it misaligns, so one fumble is
> reported as four misses, three of them named wrongly. Measured on
> `eng-fail-takeoff` — greedy 4/8 vs DP 7/8 for a single skipped step, and
> greedy 4/8 vs DP 6/8 for two. The global pass keeps a skipped line's damage
> to that line. This matters more than it sounds: false misses are exactly what
> makes the readback untrustworthy.

The result still goes through `gradeEP`, not straight to `epMatchLine` — the DP
pass tolerates skipped and extra lines in a way the greedy split does not.
Belt and braces.

**`normSpoken(s)`** runs before segmentation:

- number words to digits — "sixty eight" → 68, "seventeen hundred" → 1700
- letter-spelled initialisms — "k.i.a.s." / "k i a s" → "kias", "r.p.m." → "rpm"
- filler — "uh", "um", "er"
- the homophone map, **populated only from Probe B's observed errors**

Kept in `spoken.js` — pure functions, no DOM, so they can be tested outside a
browser. (The plan originally buried them in `sim.js`; they earned their own
file the moment they needed a test harness.)

**`normEP` in `ground/data.js` had to be touched after all**, contrary to the
original plan. Three fixes came out of the first real voice run, and only one
of them was spoken-only:

- `knots` is now stripped alongside `kias`, so *"airspeed 68 knots"* matches
  `Airspeed 68 KIAS`. Also correct for the typed drills.
- `engine → eng` and `fail/fails/failed/failure → fail`, so *"if due to fire
  or engine failure"* matches `IF DUE TO FIRE/ENG FAIL`.
- `slash → nothing` lives in `normSpoken`, since nobody types it. A `/` was
  already a space in `normEP` and `and`/`or` were already filler, so all four
  spoken forms now pass.

The engine/fail rule **had** to go in `normEP` rather than `normSpoken`,
because those words appear on *both* sides. A one-way spoken map would have
fixed `ENG FAIL` while breaking `IF ENGINE STARTS`, `IF ENGINE FAILS TO START`
and `Continue until engine starts…`, which are graded lines containing the long
form. Canonicalizing both sides identically is the only version that works.

This changes grading for the existing Limits/EPs sheet and EP Drill — strictly
more lenient, in the direction those drills already lean. 45 assertions cover
it, including that every EP still grades its own text 100% through the typed
path.

**Readback.** Missed lines are `result.filter(r => r.graded && !r.ok)`; speak
`epLineText(line)` for each. A clean run says something in the site's voice —
`ep.js` uses *"verbatim. Bravo Zulu."*

**Trust affordance.** After each mic round the screen shows the raw transcript
alongside the graded lines. When it claims you missed a step, one glance tells
you whether you missed it or the mic did. This is not optional polish — it is
what keeps the feature honest given §4's risk.

## 7. Screens

One page, three screens toggled with `.hidden`, following the pattern in
`aero/test-1.html`.

### Setup — `#setup-screen`

Doubles as the information screen. Contents:

- What the drill is, and how to run it: put the tab behind whatever you are
  doing, leave the volume up.
- **The honest caveat.** Works on a laptop with the tab in the background.
  Stops if the computer sleeps, or if a phone locks or is backgrounded — iOS
  suspends the tab outright. Display-only sleep is fine. If you walk away long
  enough for the machine to sleep, the session is waiting where you left it
  rather than running.
- **The privacy line.** Mic mode sends your audio to the browser's speech
  service (Google's or Apple's) and needs a connection. Everything else on this
  site stays in your browser, and this is the one exception — it says so
  plainly, not in a footnote.
- `Pacing` — `.btn.toggle` ×2: **Rapid Fire** (next EP right after feedback,
  short breath) / **Random Interval**, which reveals two number inputs, minutes,
  default 2 to 6.
- `Session length` — `.btn.toggle` ×4: 5 / 10 / 20 / Until I stop. Default 10.
- `Procedures` — seven `.btn.toggle.auto` chips, all selected, click to toggle.
  Reuses existing CSS; no checkbox styling needed. Refuse to start with none.
- `Speakers` — a **Play a test callout** button. The whole drill is audio, so
  hearing it at the volume you will actually sit at matters more than any other
  control on the page. Reports whether sound genuinely came out.
- `Microphone` — `.btn.toggle` ×2: **On — graded** / **Off — check on screen**.
  When on, reveals **seconds of silence before deciding I'm done** (default
  2.5, clamped 1–15) — the mid-procedure pause window, for people who think
  between steps. Feeds `listen({ silenceMs })`; the lead-in before you start
  talking scales with it (`max(7s, 2× pause)`) so a long pause setting cannot
  be cut off before you begin.
  Default **off**: it works in every browser, offline, without a permission
  prompt. If `capabilities().recognition` is false the On button is disabled
  with the reason inline (Firefox has no support at all).
- Start button. **Start performs a sound check before the session begins** —
  it speaks a short confirmation and requires `say()` to report `spoke: true`.
  If nothing came out, it says so and does not start. A drill that calls out
  EPs you cannot hear looks exactly like a working drill, and you would not
  find out until you had wasted the session. See §9.
- Settings restored from `localStorage["nife-fp-settings"]`.
- Lifetime stat line from `localStorage["nife-fp-sim"]`.

### Running — `#run-screen`

- State line: *Standing by · Listen up · Listening · Reading back*
- `.timer-display` counting down to the next callout; in Rapid Fire it shows
  the round instead
- The EP title on screen once announced, for when you glance over
- Round counter and running tally
- **Mic path:** live interim transcript while listening; after grading, the
  `.gs-ep` line list with `.gs-ok` / `.gs-bad`, plus the raw transcript
- **No-mic path:** **Check Answer** → reveals the filled EP in the same
  `.gs-step` markup `ep.js` uses for its answer key → **Done** → next round
- Pause and Stop

### Summary — `#done-screen`

Per-EP scores, overall, Run Again / Back to Setup. Written to
`localStorage["nife-fp-sim"]` as `{ n, perfect, best: {epId: pct} }` — the same
shape as `nife-ground-ep`, so the index badge helper works unchanged. Mic mode
only; the no-mic path is not scored and writes nothing.

> Not explicitly requested — inferred from choosing a graded mode, and from
> every other drill on the site keeping stats. Cut it if you'd rather the
> simulator stay ephemeral.

## 8. The scheduler

States: `idle → waiting → announcing → reciting → feedback → …` plus `paused`
and `finished`.

Driven by **one `setInterval(tick, 250)` comparing `Date.now()` against a
stored deadline.** Never by `setTimeout` duration. A throttled tab fires the
tick late, but a deadline comparison is still correct — the callout is late,
never skipped and never doubled. The keepalive from §5 is what stops it being
late in the first place; the deadline is what saves it when the keepalive fails.

Async work (`say`, `listen`) is owned by the state it belongs to, with a
generation counter so a Stop or Pause mid-utterance cannot let a stale promise
resume a dead session.

**Stale-deadline guard.** A deadline can go past not because we were throttled
but because the machine was asleep. Firing on wake would blurt an EP the
instant the lid opens — possibly hours late, with no warning and no chance to
be ready. So the tick distinguishes the two: **more than 120s late is treated
as a resume, not a late callout.** It reschedules from now instead of firing,
and the running screen says the session paused while the computer slept.

120s is chosen deliberately: Probe A observed a legitimate ~55s throttle stall,
so the threshold has to sit well above that or ordinary throttling would be
misread as sleep. Only one callout can ever be pending — the scheduler holds a
single `nextDeadline`, not a queue — so waking can never produce a barrage.

Deck order: shuffled, no repeats until exhausted, then reshuffled — the same
pattern as `ep.js`.

## 9. Failure modes

| Condition | Behavior |
|---|---|
| No `speechSynthesis` | Hard stop on the setup screen. The drill is audio; there is no degraded version. |
| **Synthesis present but silent** | `say()` returns `{spoke, error}`; `spoke` is the only honest signal. `not-allowed` (no user gesture yet) and `timeout` (utterance never starts — Chrome's speech service wedges browser-wide on macOS and every utterance queues forever while `getVoices()` still cheerfully returns 199 voices) both surface as a refusal to start, with "quit Chrome fully and reopen" as the suggested fix. **Observed for real during the spike.** Mid-session, three consecutive silent utterances stop the session rather than drill on quietly. |
| No `SpeechRecognition` (Firefox) | Mic toggle disabled, reason shown inline, no-mic path only. |
| Permission denied (`not-allowed`) | Stop, explain, offer to continue in no-mic mode. |
| `network` error mid-session | Fall back to no-mic for the rest of the session with a notice. Matters — this is an offline-capable PWA. |
| `no-speech` (you said nothing) | Not an error. Treat as an empty recitation, read the whole EP back, continue. |
| Tab hidden and throttled anyway | Deadline tick self-corrects; late, not broken. Measured: ~390ms typical, one ~55s stall in six minutes. |
| **Computer sleeps** | Everything stops — no timers, no audio. Nothing can prevent this from a web page. On wake the stale-deadline guard (§8) reschedules instead of firing, and says the session paused while the machine slept. Display-only sleep is unaffected and keeps running. |
| Screen wake lock while hidden | `navigator.wakeLock` is **released by the browser whenever the document becomes hidden**, so it cannot hold the screen on for the tab-behind-a-game case. It only helps a phone or laptop sitting on the drill's own tab. Re-acquired on `visibilitychange`. Do not advertise it as keeping the machine awake. |
| Navigate away / close | `pagehide` → `Speech.cancel()`, keepalive off, wake lock released. |

## 10. Verification

The repo has no test runner and this plan does not add one.

- `flight-phase/index.html?selftest=1` runs a small assertion set over
  `normSpoken` and `segmentSpoken` — fixed transcript strings in, expected
  scores out — and prints pass/fail to the page. Pure functions, no
  dependencies, matches the site's no-build ethos. Seeded from Probe B's real
  transcripts, so it locks in exactly the errors we fixed.
- Manual checklist: both paths end to end; Rapid Fire and Random Interval; stop
  and pause mid-utterance; deny the mic permission; kill the network
  mid-session; hidden tab for ten minutes; Firefox; iOS Safari with the screen
  on; light and dark themes.
- `python3 gen-sw.py` after the pages exist, then commit the regenerated
  `sw.js`.

## 10b. Built — what changed along the way

Everything in §11 is done. Four things worth recording because they were found
by testing, not by design:

**The match floor.** `segmentSpoken`'s DP maximised a *sum* of similarities,
which paid for junk. Skipping two **adjacent** steps made it tear a good line
in half to sprinkle the scraps onto the line you never said — "mixture idle"
onto Mixture (0.63) plus the orphaned "cutoff" onto Mags (0.38) totalled 1.007,
beating the correct 1.00 assignment, and invented a third miss out of two. A
chunk below `MATCH_FLOOR` (0.5) now earns nothing: the words are still
consumed, they just buy no score. 93 assertions cover every single-line skip
and every adjacent pair across all seven EPs — misses now always equal skips.

**The unscored summary.** The no-mic path never writes to `S.results`, so
finishing a session dropped straight back to setup as if nothing had happened.
It now reports how many EPs were called and says they were not scored.

**`S.micNow`.** A mid-session mic failure falls back to the on-screen path for
the rest of that session without rewriting the saved preference, so the next
session tries the mic again. Verified against a simulated permission denial.

**The mobile site bar.** A third section broke the phone header — "Ground
School" and "Flight Phase" wrapped mid-label, doubling the bar's height. Fixed
site-wide under the 600px breakpoint: smaller labels, `nowrap`, tighter
padding, and on the narrowest phones the label row scrolls while the theme
toggle stays pinned with `position: sticky`. Verified at 390 / 360 / 320px with
no page overflow, and desktop untouched.

**Verification.** 58 assertions in `?selftest=1` (grading, spoken
normalisation, no-cascade, and the eight real spike transcripts), plus browser
runs of: both feedback paths, session completion and summary, mic permission
denial, mid-session mic loss, an empty recitation, the Firefox capability gate,
a browser with no TTS at all, and the stale-deadline sleep guard.

## 11. Order of work

0. **Spike.** Probe A and Probe B. Author `speech.js`. Report findings before
   continuing — if Probe B is bad, §6's feedback mode changes and the rest of
   the plan changes with it.
1. `speech.js` graduates into `flight-phase/`.
2. Module skeleton: `flight-phase/index.html` with the three screens stubbed,
   loading `../ground/data.js`, `speech.js`, `sim.js`. Nav link and hub card
   scripted across the 48 pages, `style.css` bumped to `r21`, `gen-sw.py`
   updated.
3. Setup screen: controls, capability gating, settings persistence.
4. Scheduler and running screen, **no-mic path only** — a complete, shippable
   drill that works in every browser.
5. Mic path: `listen`, `normSpoken`, `segmentSpoken`, grading, readback,
   transcript display.
6. Summary and stats, index badge.
7. Failure modes, `?selftest=1`, manual checklist, regenerate `sw.js`.

Step 4 is a deliberate checkpoint: if anything about mic mode collapses, the
module still ships as a working hands-free-ish drill.
