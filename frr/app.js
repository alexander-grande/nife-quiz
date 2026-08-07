// ============================================================
// APP STATE + LOGIC
// Each test page defines PAGE_TEST (0=A, 1=B, 2=C) before this
// script loads; tests.js defines TESTS.
// Modes: "exam" (graded at the end) | "practice" (instant feedback)
// Each attempt shuffles question order and answer positions.
// Attempt history is kept in localStorage (this browser only).
// ============================================================
const TEST = TESTS[PAGE_TEST];
const LETTERS = ["a", "b", "c", "d"];
const DUMP_SECONDS = 5 * 60;
const HIST_KEY = "nife-frr-hist-" + PAGE_TEST;
const HIST_MAX = 30;

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
      `<span>${a.c}/${a.n}</span><span class="${pct >= 80 ? "hist-pass" : "hist-fail"}">${pct}%</span></div>`;
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
function startTest() {
  stopDumpTimer();
  const pool = retakePool || TEST.questions.map((_, i) => i);
  retakePool = null;
  activeQ = shuffle(pool);
  optMaps = activeQ.map(() => shuffle([0, 1, 2, 3]));
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
    btn.innerHTML = `<span class="letter">${LETTERS[j]}</span><span>${q.o[origIdx]}</span>`;
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
      `<div class="rationale"><span class="tag">Why:</span>${q.r}<span class="ref">${q.ref}</span></div>`;
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
const CHAPTERS = {
  1: "Federal Aviation Organization",
  2: "Visual / Instrument Flight Rules",
  3: "Airspace & General Flight Rules"
};

function renderChapterBreakdown() {
  const box = $("chapter-breakdown");
  if (!box) return;
  const byCh = {};
  activeQ.forEach((qi, i) => {
    const q = TEST.questions[qi];
    const m = q.ref.match(/Ch 5-(\d)/);
    const ch = m ? +m[1] : 0;
    byCh[ch] = byCh[ch] || { c: 0, n: 0 };
    byCh[ch].n++;
    if (answers[i] === q.a) byCh[ch].c++;
  });
  let html = `<div class="ch-head">Breakdown by chapter</div>`;
  Object.keys(byCh).map(Number).sort((a, b) => a - b).forEach(ch => {
    const { c, n } = byCh[ch];
    const pct = Math.round(c / n * 100);
    const weak = pct < 80;
    html += `<div class="ch-row${weak ? " ch-weak" : ""}">` +
      `<span class="ch-name">Ch 5-${ch} — ${CHAPTERS[ch] || "Other"}</span>` +
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
  const passed = pct >= 80;
  const isFull = total === TEST.questions.length;

  saveAttempt(correct, total);

  $("score-pct").textContent = pct + "%";
  $("score-frac").textContent = `${correct} of ${total} correct` + (isFull ? "" : " (missed-only retake)");
  $("score-circle").classList.toggle("fail", !passed);
  const verdict = $("score-verdict");
  verdict.textContent = passed ? "PASS" : "FAIL";
  verdict.className = "verdict " + (passed ? "pass" : "fail");

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

    let html = `<div class="mq">${i + 1}. ${q.q}</div>`;
    html += `<div class="ans yours${isRight ? " right" : ""}"><span class="tag">Your answer:</span>${yourAnswer}</div>`;
    if (!isRight) {
      html += `<div class="ans correct"><span class="tag">Correct answer:</span>${q.o[q.a]}</div>`;
      html += `<div class="rationale"><span class="tag">Why:</span>${q.r}<span class="ref">${q.ref}</span></div>`;
    }
    card.innerHTML = html;
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
