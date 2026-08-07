// ============================================================
// APP STATE + LOGIC
// Each test page defines PAGE_TEST (0=A, 1=B, 2=C) before this
// script loads; tests.js defines TESTS.
// Modes: "exam" (graded at the end) | "practice" (instant feedback)
// ============================================================
const TEST = TESTS[PAGE_TEST];
const LETTERS = ["a", "b", "c", "d"];
const DUMP_SECONDS = 5 * 60;
let mode = "exam";
let useDumpSheet = false;
let currentQ = 0;
let answers = [];         // user's picks (null = unanswered)
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
  currentQ = 0;
  answers = new Array(TEST.questions.length).fill(null);
  $("quiz-mode-label").textContent = mode === "exam" ? "Exam Mode" : "Practice Mode";
  buildQGrid();
  show(quizScreen);
  renderQuestion();
}

function buildQGrid() {
  const grid = $("qgrid");
  grid.innerHTML = "";
  TEST.questions.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "qdot";
    dot.textContent = i + 1;
    dot.addEventListener("click", () => { currentQ = i; renderQuestion(); });
    grid.appendChild(dot);
  });
}

function answerCurrent(idx) {
  // In practice mode an answer is locked in the moment it's made
  if (mode === "practice" && answers[currentQ] !== null) return;
  answers[currentQ] = idx;
  renderQuestion();
}

function renderQuestion() {
  const total = TEST.questions.length;
  const q = TEST.questions[currentQ];
  const answeredCount = answers.filter(a => a !== null).length;
  const userIdx = answers[currentQ];
  const graded = mode === "practice" && userIdx !== null;

  let counterText = `${answeredCount} of ${total} answered`;
  if (mode === "practice") {
    const correctSoFar = TEST.questions.reduce((n, qq, i) => n + (answers[i] === qq.a ? 1 : 0), 0);
    counterText += ` · ${correctSoFar} correct`;
  }
  $("quiz-counter").textContent = counterText;
  $("progress-fill").style.width = (answeredCount / total * 100) + "%";
  $("q-number").textContent = `Question ${currentQ + 1} of ${total}`;
  $("q-text").textContent = q.q;

  const optWrap = $("q-options");
  optWrap.innerHTML = "";
  q.o.forEach((opt, i) => {
    const btn = document.createElement("button");
    let cls = "option";
    if (graded) {
      cls += " locked";
      if (i === q.a) cls += " correct-opt";
      else if (i === userIdx) cls += " wrong-opt";
    } else if (userIdx === i) {
      cls += " selected";
    }
    btn.className = cls;
    btn.innerHTML = `<span class="letter">${LETTERS[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => answerCurrent(i));
    optWrap.appendChild(btn);
  });

  // Instant feedback (practice mode only)
  const fb = $("q-feedback");
  if (graded) {
    const right = userIdx === q.a;
    fb.className = "feedback " + (right ? "good" : "bad");
    fb.innerHTML =
      `<div class="fb-verdict">${right ? "Correct!" : `Incorrect — the correct answer is ${LETTERS[q.a]}.`}</div>` +
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
      dot.classList.add(answers[i] === TEST.questions[i].a ? "right-dot" : "wrong-dot");
    } else {
      dot.classList.add("answered");
    }
  });
}

$("btn-prev").addEventListener("click", () => { if (currentQ > 0) { currentQ--; renderQuestion(); } });
$("btn-next").addEventListener("click", () => {
  if (currentQ < TEST.questions.length - 1) { currentQ++; renderQuestion(); }
});
$("btn-quit").addEventListener("click", () => {
  if (confirm("Exit this test? Your answers will be lost.")) show(setupScreen);
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
function gradeTest() {
  const total = TEST.questions.length;
  const correct = TEST.questions.reduce((n, q, i) => n + (answers[i] === q.a ? 1 : 0), 0);
  const pct = Math.round(correct / total * 100);
  const passed = pct >= 80;

  $("score-pct").textContent = pct + "%";
  $("score-frac").textContent = `${correct} of ${total} correct`;
  $("score-circle").classList.toggle("fail", !passed);
  const verdict = $("score-verdict");
  verdict.textContent = passed ? "PASS" : "FAIL";
  verdict.className = "verdict " + (passed ? "pass" : "fail");

  showAllResults = false;
  renderReview();
  show(resultsScreen);
}

function renderReview() {
  const list = $("miss-list");
  list.innerHTML = "";

  const missed = TEST.questions
    .map((q, i) => ({ q, i }))
    .filter(({ q, i }) => answers[i] !== q.a);

  $("btn-toggle-all").textContent = showAllResults ? "Show Missed Questions Only" : "Show All Questions";
  $("review-heading").textContent = showAllResults
    ? "All Questions"
    : (missed.length ? `Questions You Missed (${missed.length})` : "");

  const items = showAllResults ? TEST.questions.map((q, i) => ({ q, i })) : missed;

  if (!showAllResults && missed.length === 0) {
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
      : `${LETTERS[userIdx]}. ${q.o[userIdx]}`;

    let html = `<div class="mq">${i + 1}. ${q.q}</div>`;
    html += `<div class="ans yours${isRight ? " right" : ""}"><span class="tag">Your answer:</span>${yourAnswer}</div>`;
    if (!isRight) {
      html += `<div class="ans correct"><span class="tag">Correct answer:</span>${LETTERS[q.a]}. ${q.o[q.a]}</div>`;
      html += `<div class="rationale"><span class="tag">Why:</span>${q.r}<span class="ref">${q.ref}</span></div>`;
    }
    card.innerHTML = html;
    list.appendChild(card);
  });
}

$("btn-toggle-all").addEventListener("click", () => { showAllResults = !showAllResults; renderReview(); });
$("btn-retake").addEventListener("click", () => show(setupScreen));
$("btn-home").addEventListener("click", () => { location.href = "./"; });

// keyboard shortcuts: a/b/c/d or 1-4 to answer, arrows to navigate
document.addEventListener("keydown", e => {
  if (quizScreen.classList.contains("hidden")) return;
  const key = e.key.toLowerCase();
  const letterIdx = LETTERS.indexOf(key);
  const numIdx = ["1", "2", "3", "4"].indexOf(key);
  if (letterIdx !== -1 || numIdx !== -1) {
    answerCurrent(letterIdx !== -1 ? letterIdx : numIdx);
  } else if (e.key === "ArrowRight" && currentQ < TEST.questions.length - 1) {
    currentQ++; renderQuestion();
  } else if (e.key === "ArrowLeft" && currentQ > 0) {
    currentQ--; renderQuestion();
  }
});

show(setupScreen);
