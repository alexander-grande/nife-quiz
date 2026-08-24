// ============================================================
// SHARED QUIZ ENGINE
// Each test page defines, before this script loads:
//   PAGE_TEST — index into TESTS (from the unit's tests.js)
//   UNIT      — per-unit config (from the unit's unit.js):
//     { histPrefix, chapters: {n: name}, chRe, chPrefix }
// Modes: "exam" (graded at the end) | "practice" (instant feedback)
// Each attempt shuffles question order and answer positions.
// Attempt history is kept in localStorage (this browser only).
// Questions may carry img/imgCap — a Student Guide figure shown
// above the options (and again in the results review).
// ============================================================
const TEST = TESTS[PAGE_TEST];
const LETTERS = ["a", "b", "c", "d"];
const DUMP_SECONDS = 5 * 60;
const HIST_KEY = UNIT.histPrefix + PAGE_TEST;
const HIST_MAX = 30;
const PASS_PCT = 80;

let mode = "exam";
let useDumpSheet = false;
let activeQ = [];        // original question indices for this run (shuffled)
let optMaps = [];        // per active question: displayed position -> original option index
let currentQ = 0;        // position within activeQ
let answers = [];        // original option index picked, or null, per active question
let retakePool = null;   // when set, the next run uses only these question indices
let showAllResults = false;
let timerInterval = null;

const $ = id => document.getElementById(id);
const setupScreen = $("setup-screen");
const dumpTimerScreen = $("dump-timer-screen");
const quizScreen = $("quiz-screen");
const resultsScreen = $("results-screen");

function show(screen) {
  [setupScreen, dumpTimerScreen, quizScreen, resultsScreen]
    .forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Attempt history (localStorage) ----------
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
  } catch (e) { return []; }
}

function saveAttempt(correct, total) {
  try {
    const arr = loadHistory();
    arr.push({ t: Date.now(), c: correct, n: total, m: mode, f: total === TEST.questions.length });
    localStorage.setItem(HIST_KEY, JSON.stringify(arr.slice(-HIST_MAX)));
  } catch (e) { /* storage unavailable (private browsing etc.) — history just isn't kept */ }
}

function renderHistory() {
  const box = $("history-box");
  if (!box) return;
  const arr = loadHistory();
  if (!arr.length) { box.classList.add("hidden"); return; }
  const full = arr.filter(a => a.f);
  const best = full.length ? Math.max(...full.map(a => Math.round(a.c / a.n * 100))) : null;
  let html = `<div class="hist-head">Your attempts on this browser` +
    (best !== null ? ` &middot; <span class="hist-best">Best full test: ${best}%</span>` : "") + `</div>`;
  arr.slice(-6).reverse().forEach(a => {
    const d = new Date(a.t);
    const date = (d.getMonth() + 1) + "/" + d.getDate();
    const pct = Math.round(a.c / a.n * 100);
    const tag = a.f ? (a.m === "exam" ? "Exam" : "Practice") : "Missed-only";
    html += `<div class="hist-row"><span>${date}</span><span>${tag}</span>` +
      `<span>${a.c}/${a.n}</span><span class="${pct >= PASS_PCT ? "hist-pass" : "hist-fail"}">${pct}%</span></div>`;
  });
  box.innerHTML = html;
  box.classList.remove("hidden");
}

// ---------- Setup screen ----------
document.querySelectorAll("[data-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    mode = btn.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach(b => b.classList.toggle("selected", b === btn));
  });
});
document.querySelectorAll("[data-dump]").forEach(btn => {
  btn.addEventListener("click", () => {
    useDumpSheet = btn.dataset.dump === "yes";
    document.querySelectorAll("[data-dump]").forEach(b => b.classList.toggle("selected", b === btn));
  });
});
$("btn-start").addEventListener("click", () => {
  retakePool = null;                 // starting fresh from setup = full test
  if (useDumpSheet) startDumpTimer();
  else startTest();
});

// ---------- Dump sheet timer ----------
function startDumpTimer() {
  stopDumpTimer();
  let remaining = DUMP_SECONDS;
  const display = $("timer-display");
  display.classList.remove("done");
  $("timer-sub").textContent = "Time remaining";
  $("btn-timer-continue").classList.add("hidden");
  display.textContent = formatTime(remaining);
  show(dumpTimerScreen);

  timerInterval = setInterval(() => {
    remaining--;
    display.textContent = formatTime(Math.max(remaining, 0));
    if (remaining <= 0) {
      stopDumpTimer();
      display.classList.add("done");
      $("timer-sub").textContent = "Time's up — good luck!";
      $("btn-timer-continue").classList.remove("hidden");
    }
  }, 1000);
}

function stopDumpTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function formatTime(s) {
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

$("btn-timer-continue").addEventListener("click", startTest);
$("btn-timer-cancel").addEventListener("click", () => {
  if (confirm("Cancel the dump sheet and return to test setup?")) {
    stopDumpTimer();
    show(setupScreen);
  }
});

// ---------- Quiz screen ----------

function optSnippet(q, idx) {
  let t = q.o[idx];
  if (t.length > 60) t = t.slice(0, 57).replace(/\s+\S*$/, "") + "…";
  return "[" + t + "]";
}

function translateRationale(q, text, perm) {
  // Rationale letter references describe the ORIGINAL a-d order. Rewrite
  // them for the current shuffle: to the displayed letter in practice
  // mode (perm given), or to a snippet of the option's text in the
  // review, where options are shown without letters.
  // First pass replaces references with placeholders so a rewritten
  // letter can never be matched again by a later pattern.
  const rep = (letter) => {
    const idx = "abcd".indexOf(letter.toLowerCase());
    return idx < 0 ? null : "\u0000" + idx + "\u0000";
  };
  const final = (idx) => {
    if (perm) {
      const pos = perm.indexOf(idx);
      return pos >= 0 ? LETTERS[pos].toUpperCase() : "abcd"[idx].toUpperCase();
    }
    return optSnippet(q, idx);
  };
  let out = text;
  // "options a/c/d" slash lists
  out = out.replace(/\b([a-d](?:\/[a-d])+)\b/g, m => m.split("/").map(L => rep(L) || L).join(" / "));
  // "option A", "Choice (b)", "answer C"
  out = out.replace(/\b([Oo]ptions?|[Cc]hoices?|[Aa]nswers?)(\s+)\(?([A-Da-d])\)?(?![\w-])/g,
    (m, word, sp, L) => { const r = rep(L); return r ? word + sp + r : m; });
  // parenthesized bare letters: "(a) describes ..."
  out = out.replace(/\(([A-Da-d])\)/g, (m, L) => rep(L) || m);
  // bare capital letter followed by a verb: "A is dew point; B describes ..."
  out = out.replace(/(?<!°)(?<!°\s)\b([A-D])\b(?=\s+(?:is|are|was|describes|defines|reverses|belongs|fails|adds|mixes|matches|swaps|equals|gives|puts|borrows|uses|applies|refers|remains|holds|comes|would))/g,
    (m, L) => rep(L) || m);
  return out.replace(/\u0000(\d)\u0000/g, (m, d) => final(+d));
}

function optMapFor(q) {
  // "All/None/Both of the above" options stay pinned at the bottom
  const pinned = [], movable = [];
  q.o.forEach((opt, i) => {
    if (/\b(all|none|both) of the above\b/i.test(opt)) pinned.push(i);
    else movable.push(i);
  });
  return shuffle(movable).concat(pinned);
}

function buildRun(pool) {
  // Questions sharing a g (group) value form an ordered chain: they are
  // shuffled as one unit, always adjacent and in original order, and a
  // retake that includes any member includes the whole chain.
  const qs = TEST.questions;
  const inPool = new Set(pool);
  pool.forEach(i => {
    if (qs[i].g !== undefined) {
      qs.forEach((q2, j) => { if (q2.g === qs[i].g) inPool.add(j); });
    }
  });
  const seenGroups = new Set();
  const units = [];
  [...inPool].sort((a, b) => a - b).forEach(i => {
    const g = qs[i].g;
    if (g === undefined) { units.push([i]); return; }
    if (seenGroups.has(g)) return;
    seenGroups.add(g);
    units.push([...inPool].filter(j => qs[j].g === g).sort((a, b) => a - b));
  });
  return shuffle(units).flat();
}

function startTest() {
  stopDumpTimer();
  const pool = retakePool || TEST.questions.map((_, i) => i);
  retakePool = null;
  activeQ = buildRun(pool);
  optMaps = activeQ.map(qi => optMapFor(TEST.questions[qi]));
  answers = new Array(activeQ.length).fill(null);
  currentQ = 0;
  const label = mode === "exam" ? "Exam Mode" : "Practice Mode";
  $("quiz-mode-label").textContent = activeQ.length < TEST.questions.length
    ? label + " · missed questions only" : label;
  buildQGrid();
  show(quizScreen);
  renderQuestion();
}

function buildQGrid() {
  const grid = $("qgrid");
  grid.innerHTML = "";
  activeQ.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "qdot";
    dot.textContent = i + 1;
    dot.addEventListener("click", () => { currentQ = i; renderQuestion(); });
    grid.appendChild(dot);
  });
}

function answerCurrent(origIdx) {
  // In practice mode an answer is locked the moment it's made
  if (mode === "practice" && answers[currentQ] !== null) return;
  answers[currentQ] = origIdx;
  renderQuestion();
}

function figureHTML(q) {
  if (!q.img) return "";
  return `<figure class="q-figure"><img src="${q.img}" alt="Student Guide figure">` +
    (q.imgCap ? `<figcaption>${q.imgCap}</figcaption>` : "") + `</figure>`;
}

function renderQuestion() {
  const total = activeQ.length;
  const q = TEST.questions[activeQ[currentQ]];
  const perm = optMaps[currentQ];
  const answeredCount = answers.filter(a => a !== null).length;
  const userIdx = answers[currentQ];
  const graded = mode === "practice" && userIdx !== null;

  let counterText = `${answeredCount} of ${total} answered`;
  if (mode === "practice") {
    const correctSoFar = activeQ.reduce((n, qi, i) => n + (answers[i] === TEST.questions[qi].a ? 1 : 0), 0);
    counterText += ` · ${correctSoFar} correct`;
  }
  $("quiz-counter").textContent = counterText;
  $("progress-fill").style.width = (answeredCount / total * 100) + "%";
  $("q-number").textContent = `Question ${currentQ + 1} of ${total}`;
  $("q-text").textContent = q.q;

  // Optional Student Guide figure
  const figBox = $("q-figure-box");
  if (figBox) {
    figBox.innerHTML = figureHTML(q);
    figBox.classList.toggle("hidden", !q.img);
  }

  const optWrap = $("q-options");
  optWrap.innerHTML = "";
  perm.forEach((origIdx, j) => {
    const btn = document.createElement("button");
    let cls = "option";
    if (graded) {
      cls += " locked";
      if (origIdx === q.a) cls += " correct-opt";
      else if (origIdx === userIdx) cls += " wrong-opt";
    } else if (userIdx === origIdx) {
      cls += " selected";
    }
    btn.className = cls;
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = LETTERS[j];
    const text = document.createElement("span");
    text.textContent = q.o[origIdx];
    btn.append(letter, text);
    btn.addEventListener("click", () => answerCurrent(origIdx));
    optWrap.appendChild(btn);
  });

  // Instant feedback (practice mode only)
  const fb = $("q-feedback");
  if (graded) {
    const right = userIdx === q.a;
    const rightLetter = LETTERS[perm.indexOf(q.a)];
    fb.className = "feedback " + (right ? "good" : "bad");
    fb.innerHTML =
      `<div class="fb-verdict">${right ? "Correct!" : `Incorrect — the correct answer is ${rightLetter}.`}</div>` +
      `<div class="rationale"><span class="tag">Why:</span>${translateRationale(q, q.r, perm)}<span class="ref">${q.ref}</span></div>`;
  } else {
    fb.className = "hidden";
    fb.innerHTML = "";
  }

  $("btn-prev").disabled = currentQ === 0;
  const onLast = currentQ === total - 1;
  $("btn-next").classList.toggle("hidden", onLast);
  $("btn-submit").classList.toggle("hidden", !onLast);

  document.querySelectorAll(".qdot").forEach((dot, i) => {
    dot.classList.toggle("current", i === currentQ);
    dot.classList.remove("answered", "right-dot", "wrong-dot");
    if (answers[i] === null) return;
    if (mode === "practice") {
      dot.classList.add(answers[i] === TEST.questions[activeQ[i]].a ? "right-dot" : "wrong-dot");
    } else {
      dot.classList.add("answered");
    }
  });
}

$("btn-prev").addEventListener("click", () => { if (currentQ > 0) { currentQ--; renderQuestion(); } });
$("btn-next").addEventListener("click", () => {
  if (currentQ < activeQ.length - 1) { currentQ++; renderQuestion(); }
});
$("btn-quit").addEventListener("click", () => {
  if (confirm("Exit this test? Your answers will be lost.")) { renderHistory(); show(setupScreen); }
});
$("btn-submit").addEventListener("click", () => {
  const unanswered = answers.reduce((n, a) => n + (a === null ? 1 : 0), 0);
  if (unanswered > 0 &&
      !confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Unanswered questions will be marked wrong. Submit anyway?`)) {
    return;
  }
  gradeTest();
});

// ---------- Grading + results ----------

function renderChapterBreakdown() {
  const box = $("chapter-breakdown");
  if (!box) return;
  const byCh = {};
  activeQ.forEach((qi, i) => {
    const q = TEST.questions[qi];
    const m = q.ref.match(UNIT.chRe);
    const ch = m ? +m[1] : 0;
    byCh[ch] = byCh[ch] || { c: 0, n: 0 };
    byCh[ch].n++;
    if (answers[i] === q.a) byCh[ch].c++;
  });
  let html = `<div class="ch-head">Breakdown by chapter</div>`;
  Object.keys(byCh).map(Number).sort((a, b) => a - b).forEach(ch => {
    const { c, n } = byCh[ch];
    const pct = Math.round(c / n * 100);
    const weak = pct < PASS_PCT;
    const name = UNIT.chapters[ch];
    html += `<div class="ch-row${weak ? " ch-weak" : ""}">` +
      `<span class="ch-name">${UNIT.chPrefix}${ch}${name ? " — " + name : ""}</span>` +
      `<span class="ch-bar"><span class="ch-fill" style="width:${pct}%"></span></span>` +
      `<span class="ch-score">${c}/${n}</span>` +
      `<span class="ch-note">${weak ? "restudy" : ""}</span></div>`;
  });
  box.innerHTML = html;
  box.classList.remove("hidden");
}

function gradeTest() {
  const total = activeQ.length;
  const correct = activeQ.reduce((n, qi, i) => n + (answers[i] === TEST.questions[qi].a ? 1 : 0), 0);
  const pct = Math.round(correct / total * 100);
  const passed = pct >= PASS_PCT;
  const isFull = total === TEST.questions.length;

  saveAttempt(correct, total);

  $("score-pct").textContent = pct + "%";
  $("score-frac").textContent = `${correct} of ${total}` + (isFull ? "" : " · missed-only");
  const circle = $("score-circle");
  circle.classList.toggle("fail", !passed);
  circle.style.setProperty("--p", pct);
  const verdict = $("score-verdict");
  verdict.textContent = passed ? "PASS" : "FAIL";
  verdict.className = "verdict " + (passed ? "pass" : "fail");
  const sub = document.querySelector(".verdict-sub");
  if (sub) sub.textContent = `Passing score is ${PASS_PCT}% (${Math.ceil(total * PASS_PCT / 100)} of ${total} correct)`;

  // Retake-missed button
  const missedIdx = activeQ.filter((qi, i) => answers[i] !== TEST.questions[qi].a);
  const btnMissed = $("btn-missed");
  if (btnMissed) {
    if (missedIdx.length > 0 && missedIdx.length < total) {
      btnMissed.textContent = `Retake Missed Only (${missedIdx.length})`;
      btnMissed.classList.remove("hidden");
      btnMissed.onclick = () => { retakePool = missedIdx; startTest(); };
    } else {
      btnMissed.classList.add("hidden");
    }
  }

  renderChapterBreakdown();
  showAllResults = false;
  renderReview();
  show(resultsScreen);
}

function renderReview() {
  const list = $("miss-list");
  list.innerHTML = "";

  const items = activeQ
    .map((qi, i) => ({ q: TEST.questions[qi], i }))
    .filter(({ q, i }) => showAllResults || answers[i] !== q.a);

  const missedCount = activeQ.filter((qi, i) => answers[i] !== TEST.questions[qi].a).length;

  $("btn-toggle-all").textContent = showAllResults ? "Show Missed Questions Only" : "Show All Questions";
  $("review-heading").textContent = showAllResults
    ? "All Questions"
    : (missedCount ? `Questions You Missed (${missedCount})` : "");

  if (!showAllResults && missedCount === 0) {
    list.innerHTML = `<div class="all-correct">Perfect score — you answered every question correctly. Bravo Zulu!</div>`;
    return;
  }

  items.forEach(({ q, i }) => {
    const userIdx = answers[i];
    const isRight = userIdx === q.a;
    const card = document.createElement("div");
    card.className = "miss-card" + (isRight ? " correct-card" : "");

    const yourAnswer = userIdx === null
      ? "<em>No answer given</em>"
      : q.o[userIdx];

    let html = `<div class="mq"></div>`;
    html += figureHTML(q);
    html += `<div class="ans yours${isRight ? " right" : ""}"><span class="tag">Your answer:</span>${yourAnswer}</div>`;
    if (!isRight) {
      html += `<div class="ans correct"><span class="tag">Correct answer:</span>${q.o[q.a]}</div>`;
      html += `<div class="rationale"><span class="tag">Why:</span>${translateRationale(q, q.r, null)}<span class="ref">${q.ref}</span></div>`;
    }
    card.innerHTML = html;
    card.querySelector(".mq").textContent = `${i + 1}. ${q.q}`;
    list.appendChild(card);
  });
}

$("btn-toggle-all").addEventListener("click", () => { showAllResults = !showAllResults; renderReview(); });
$("btn-retake").addEventListener("click", () => { renderHistory(); show(setupScreen); });
$("btn-home").addEventListener("click", () => { location.href = "./"; });

// keyboard shortcuts: a/b/c/d or 1-4 answer the DISPLAYED position, arrows navigate
document.addEventListener("keydown", e => {
  if (quizScreen.classList.contains("hidden")) return;
  const key = e.key.toLowerCase();
  const letterIdx = LETTERS.indexOf(key);
  const numIdx = ["1", "2", "3", "4"].indexOf(key);
  const j = letterIdx !== -1 ? letterIdx : numIdx;
  if (j !== -1) {
    answerCurrent(optMaps[currentQ][j]);
  } else if (e.key === "ArrowRight" && currentQ < activeQ.length - 1) {
    currentQ++; renderQuestion();
  } else if (e.key === "ArrowLeft" && currentQ > 0) {
    currentQ--; renderQuestion();
  }
});

renderHistory();
show(setupScreen);
