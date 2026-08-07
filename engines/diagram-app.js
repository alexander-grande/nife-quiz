// ============================================================
// SYSTEM DIAGRAM EXERCISE
// Each system page defines SYSTEM_ID before this script loads;
// diagrams.js defines DIAGRAMS.
// Modes: "bank" (word bank, tap-to-place) | "recall" (type names)
// ============================================================
const SYS = DIAGRAMS[SYSTEM_ID];
let mode = "bank";
let assigned = [];        // bank mode: word string or null, per blank
let selectedWord = null;  // bank mode: index of selected word chip
let checked = false;
let bankWords = [];

const $ = id => document.getElementById(id);
const setupScreen = $("setup-screen");
const exerciseScreen = $("exercise-screen");

function show(screen) {
  [setupScreen, exerciseScreen].forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo(0, 0);
}

// ---------- Answer normalization (recall mode) ----------
function normalize(s) {
  return s.toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 99;
  let prev = Array.from({length: n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function matchesBlank(input, blank) {
  const guess = normalize(input);
  if (!guess) return false;
  const targets = [normalize(blank.label), ...blank.accept.map(normalize)];
  return targets.some(t => {
    if (guess === t) return true;
    const tol = t.length >= 10 ? 2 : (t.length >= 6 ? 1 : 0);
    return levenshtein(guess, t) <= tol;
  });
}

// ---------- Setup screen ----------
document.querySelectorAll("[data-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    mode = btn.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach(b => b.classList.toggle("selected", b === btn));
  });
});
$("btn-start").addEventListener("click", startExercise);

// ---------- Exercise ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startExercise() {
  checked = false;
  selectedWord = null;
  assigned = new Array(SYS.blanks.length).fill(null);
  bankWords = shuffle(SYS.blanks.map(b => b.label));
  $("exercise-mode-label").textContent = mode === "bank" ? "Word Bank Mode" : "Recall Mode";
  $("score-line").textContent = "";
  $("btn-check").classList.remove("hidden");
  $("btn-reset").classList.add("hidden");
  buildChips();
  buildBank();
  buildRows();
  show(exerciseScreen);
}

function buildChips() {
  const layer = $("chip-layer");
  layer.innerHTML = "";
  SYS.blanks.forEach((b, i) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.id = "chip-" + i;
    chip.textContent = i + 1;
    chip.style.left = b.x + "%";
    chip.style.top = b.y + "%";
    chip.title = "Blank " + (i + 1);
    chip.addEventListener("click", () => {
      if (mode === "bank" && !checked) {
        onSlotTap(i);
      } else {
        const row = $("row-" + i);
        row.scrollIntoView({behavior: "smooth", block: "center"});
        const input = row.querySelector("input");
        if (input) input.focus({preventScroll: true});
      }
      flashRow(i);
    });
    layer.appendChild(chip);
  });
}

function flashRow(i) {
  const row = $("row-" + i);
  row.classList.add("flash");
  setTimeout(() => row.classList.remove("flash"), 900);
}

function buildBank() {
  const bank = $("word-bank");
  if (mode !== "bank") { bank.classList.add("hidden"); bank.innerHTML = ""; return; }
  bank.classList.remove("hidden");
  bank.innerHTML = "";
  bankWords.forEach((w, wi) => {
    const btn = document.createElement("button");
    btn.className = "word";
    btn.id = "word-" + wi;
    btn.textContent = w;
    btn.addEventListener("click", () => onWordTap(wi));
    bank.appendChild(btn);
  });
  refreshBank();
}

function wordsUsedCount(word) {
  return assigned.filter(a => a === word).length;
}

function refreshBank() {
  if (mode !== "bank") return;
  // mark each bank word used if the count of identical assigned words
  // covers this instance's position among identical bank words
  const seen = {};
  bankWords.forEach((w, wi) => {
    seen[w] = (seen[w] || 0) + 1;
    const btn = $("word-" + wi);
    btn.classList.toggle("used", wordsUsedCount(w) >= seen[w]);
    btn.classList.toggle("picked", selectedWord === wi);
    btn.disabled = checked;
  });
}

function onWordTap(wi) {
  if (checked) return;
  const btn = $("word-" + wi);
  if (btn.classList.contains("used") && selectedWord !== wi) return;
  selectedWord = selectedWord === wi ? null : wi;
  refreshBank();
}

function onSlotTap(i) {
  if (checked) return;
  if (selectedWord !== null) {
    assigned[i] = bankWords[selectedWord];
    selectedWord = null;
  } else if (assigned[i] !== null) {
    assigned[i] = null;   // tap a filled slot with nothing selected -> clear it
  }
  refreshBank();
  renderRowValues();
}

function buildRows() {
  const list = $("answer-rows");
  list.innerHTML = "";
  SYS.blanks.forEach((b, i) => {
    const row = document.createElement("div");
    row.className = "answer-row";
    row.id = "row-" + i;
    if (mode === "recall") {
      row.innerHTML = `<span class="row-num">${i + 1}</span>` +
        `<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Part name…" id="input-${i}">` +
        `<span class="row-mark" id="mark-${i}"></span>`;
    } else {
      row.innerHTML = `<span class="row-num">${i + 1}</span>` +
        `<button class="slot" id="slot-${i}"><em>Tap a word, then tap here (or the number on the diagram)</em></button>` +
        `<span class="row-mark" id="mark-${i}"></span>`;
    }
    const reveal = document.createElement("div");
    reveal.className = "row-reveal hidden";
    reveal.id = "reveal-" + i;
    const wrap = document.createElement("div");
    wrap.className = "answer-row-wrap";
    wrap.appendChild(row);
    wrap.appendChild(reveal);
    list.appendChild(wrap);
    if (mode === "bank") {
      row.querySelector(".slot").addEventListener("click", () => onSlotTap(i));
    } else {
      const input = row.querySelector("input");
      input.addEventListener("focus", () => highlightChip(i, true));
      input.addEventListener("blur", () => highlightChip(i, false));
    }
    row.querySelector(".row-num").addEventListener("click", () => {
      $("chip-" + i).scrollIntoView({behavior: "smooth", block: "center"});
      highlightChip(i, true);
      setTimeout(() => highlightChip(i, false), 900);
    });
  });
  renderRowValues();
}

function highlightChip(i, on) {
  $("chip-" + i).classList.toggle("hot", on);
}

function renderRowValues() {
  if (mode !== "bank") return;
  SYS.blanks.forEach((_, i) => {
    const slot = $("slot-" + i);
    if (assigned[i] !== null) {
      slot.textContent = assigned[i];
      slot.classList.add("filled");
      $("chip-" + i).classList.add("filled");
    } else {
      slot.innerHTML = "<em>Tap a word, then tap here (or the number on the diagram)</em>";
      slot.classList.remove("filled");
      $("chip-" + i).classList.remove("filled");
    }
  });
}

// ---------- Checking ----------
$("btn-check").addEventListener("click", () => {
  checked = true;
  selectedWord = null;
  let correct = 0;
  SYS.blanks.forEach((b, i) => {
    const answer = mode === "bank" ? (assigned[i] || "") : $("input-" + i).value;
    const right = mode === "bank"
      ? normalize(answer) === normalize(b.label)   // bank words are exact labels
      : matchesBlank(answer, b);
    if (right) correct++;
    const row = $("row-" + i);
    row.classList.add(right ? "row-right" : "row-wrong");
    $("mark-" + i).textContent = right ? "✓" : "✗";
    $("chip-" + i).classList.add(right ? "chip-right" : "chip-wrong");
    if (!right) {
      const reveal = $("reveal-" + i);
      reveal.classList.remove("hidden");
      reveal.innerHTML = `<span class="tag">Answer:</span>${b.label}`;
    }
    if (mode === "recall") $("input-" + i).disabled = true;
  });
  refreshBank();
  const total = SYS.blanks.length;
  const pct = Math.round(correct / total * 100);
  $("score-line").textContent = `${correct} of ${total} parts named correctly (${pct}%)`;
  $("btn-check").classList.add("hidden");
  $("btn-reset").classList.remove("hidden");
  window.scrollTo({top: 0, behavior: "smooth"});
});

$("btn-reset").addEventListener("click", startExercise);
$("btn-mode").addEventListener("click", () => show(setupScreen));

show(setupScreen);
