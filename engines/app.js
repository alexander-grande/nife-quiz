// ============================================================
// APP STATE + LOGIC
// ============================================================
const LETTERS = ["a", "b", "c", "d"];
const DUMP_SECONDS = 5 * 60;
let currentTest = null;   // index into TESTS
let pendingTest = null;   // test awaiting dump-sheet choice
let currentQ = 0;         // index 0-49
let answers = [];         // user's picks (null = unanswered)
let showAllResults = false;
let timerInterval = null;

const $ = id => document.getElementById(id);
const startScreen = $("start-screen");
const dumpPromptScreen = $("dump-prompt-screen");
const dumpTimerScreen = $("dump-timer-screen");
const quizScreen = $("quiz-screen");
const resultsScreen = $("results-screen");

function show(screen) {
  [startScreen, dumpPromptScreen, dumpTimerScreen, quizScreen, resultsScreen]
    .forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo(0, 0);
}

// ---------- Start screen ----------
function buildStartScreen() {
  const wrap = $("test-cards");
  wrap.innerHTML = "";
  TESTS.forEach((t, i) => {
    const card = document.createElement("div");
    card.className = "test-card";
    card.innerHTML = `<div class="num">${["A","B","C"][i]}</div><h2>${t.name}</h2><p>${t.questions.length} questions</p><p style="margin-top:6px;">${t.desc}</p>`;
    card.addEventListener("click", () => openDumpPrompt(i));
    wrap.appendChild(card);
  });
}

// ---------- Dump sheet flow ----------
function openDumpPrompt(idx) {
  pendingTest = idx;
  $("dump-prompt-title").textContent = TESTS[idx].name;
  show(dumpPromptScreen);
}

$("btn-dump-yes").addEventListener("click", startDumpTimer);
$("btn-dump-no").addEventListener("click", () => startTest(pendingTest));
$("btn-dump-cancel").addEventListener("click", () => { pendingTest = null; show(startScreen); });

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

$("btn-timer-continue").addEventListener("click", () => startTest(pendingTest));
$("btn-timer-cancel").addEventListener("click", () => {
  if (confirm("Cancel the dump sheet and return to the test list?")) {
    stopDumpTimer();
    pendingTest = null;
    show(startScreen);
  }
});

// ---------- Quiz screen ----------
function startTest(idx) {
  stopDumpTimer();
  currentTest = idx;
  currentQ = 0;
  answers = new Array(TESTS[idx].questions.length).fill(null);
  $("quiz-test-name").textContent = TESTS[idx].name;
  buildQGrid();
  show(quizScreen);
  renderQuestion();
}

function buildQGrid() {
  const grid = $("qgrid");
  grid.innerHTML = "";
  TESTS[currentTest].questions.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "qdot";
    dot.textContent = i + 1;
    dot.addEventListener("click", () => { currentQ = i; renderQuestion(); });
    grid.appendChild(dot);
  });
}

function renderQuestion() {
  const test = TESTS[currentTest];
  const total = test.questions.length;
  const q = test.questions[currentQ];
  const answeredCount = answers.filter(a => a !== null).length;

  $("quiz-counter").textContent = `${answeredCount} of ${total} answered`;
  $("progress-fill").style.width = (answeredCount / total * 100) + "%";
  $("q-number").textContent = `Question ${currentQ + 1} of ${total}`;
  $("q-text").textContent = q.q;

  const optWrap = $("q-options");
  optWrap.innerHTML = "";
  q.o.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option" + (answers[currentQ] === i ? " selected" : "");
    btn.innerHTML = `<span class="letter">${LETTERS[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => {
      answers[currentQ] = i;
      renderQuestion();
    });
    optWrap.appendChild(btn);
  });

  $("btn-prev").disabled = currentQ === 0;
  const onLast = currentQ === total - 1;
  $("btn-next").classList.toggle("hidden", onLast);
  $("btn-submit").classList.toggle("hidden", !onLast);

  document.querySelectorAll(".qdot").forEach((dot, i) => {
    dot.classList.toggle("answered", answers[i] !== null);
    dot.classList.toggle("current", i === currentQ);
  });
}

$("btn-prev").addEventListener("click", () => { if (currentQ > 0) { currentQ--; renderQuestion(); } });
$("btn-next").addEventListener("click", () => {
  if (currentQ < TESTS[currentTest].questions.length - 1) { currentQ++; renderQuestion(); }
});
$("btn-quit").addEventListener("click", () => {
  if (confirm("Exit this test? Your answers will be lost.")) show(startScreen);
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
  const test = TESTS[currentTest];
  const total = test.questions.length;
  const correct = test.questions.reduce((n, q, i) => n + (answers[i] === q.a ? 1 : 0), 0);
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
  const test = TESTS[currentTest];
  const list = $("miss-list");
  list.innerHTML = "";

  const missed = test.questions
    .map((q, i) => ({ q, i }))
    .filter(({ q, i }) => answers[i] !== q.a);

  $("btn-toggle-all").textContent = showAllResults ? "Show Missed Questions Only" : "Show All Questions";
  $("review-heading").textContent = showAllResults
    ? "All Questions"
    : (missed.length ? `Questions You Missed (${missed.length})` : "");

  const items = showAllResults ? test.questions.map((q, i) => ({ q, i })) : missed;

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
$("btn-retake").addEventListener("click", () => openDumpPrompt(currentTest));
$("btn-home").addEventListener("click", () => show(startScreen));

// keyboard shortcuts: a/b/c/d or 1-4 to answer, arrows to navigate
document.addEventListener("keydown", e => {
  if (quizScreen.classList.contains("hidden")) return;
  const key = e.key.toLowerCase();
  const letterIdx = LETTERS.indexOf(key);
  const numIdx = ["1", "2", "3", "4"].indexOf(key);
  if (letterIdx !== -1 || numIdx !== -1) {
    answers[currentQ] = letterIdx !== -1 ? letterIdx : numIdx;
    renderQuestion();
  } else if (e.key === "ArrowRight" && currentQ < TESTS[currentTest].questions.length - 1) {
    currentQ++; renderQuestion();
  } else if (e.key === "ArrowLeft" && currentQ > 0) {
    currentQ--; renderQuestion();
  }
});

buildStartScreen();
show(startScreen);
