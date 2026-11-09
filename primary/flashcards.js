// ============================================================
// T-6B EP FLASHCARDS — one card per EP, like the class deck.
// Front: title, annunciators, abort criteria, W/C/N tally.
// Back: indications + corrective action with the NWCs in place.
// Study mode: a full-screen card for phones — tap to flip, swipe
// left/right to move (the card follows your finger), scroll long backs.
// Needs T6_EPS (data.js) and T6_NWC / nwcBackHTML (nwc-data.js).
// ============================================================
(function () {
  const $ = id => document.getElementById(id);
  const ORDER_KEY = "nife-primary-fc-order", POS_KEY = "nife-primary-fc-pos";
  const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let deck = [], idx = 0, flipped = false, shuffled = false, studying = false, busy = false;
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const load = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  shuffled = load(ORDER_KEY) === "shuffle";

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function build(keepId) {
    const ids = T6_EPS.map((_, i) => i);
    deck = shuffled ? shuffle(ids) : ids;
    idx = keepId !== undefined ? Math.max(0, deck.indexOf(keepId)) : 0;
    $("btn-fc-order").textContent = $("study-order").textContent = shuffled ? "Key Order" : "Shuffle";
    flipped = false; render();
  }
  function frontHTML(ep) {
    const d = T6_NWC[ep.id] || {};
    let h = `<h2>${NWC_ESC(ep.title)}</h2>`;
    if (d.ann) h += `<div class="t6-ann">` + d.ann.map(([c, t]) => c === "-" ? `<span class="gap"></span>` : `<span class="${c}">${NWC_ESC(t)}</span>`).join("") + `</div>`;
    if (d.front) h += `<ul>` + d.front.map(t => `<li>${NWC_ESC(t)}</li>`).join("") + `</ul>`;
    h += `<div class="t6-counts">${d.counts ? NWC_ESC(d.counts) : "&nbsp;"}</div>`;
    return h;
  }
  function backHTML(ep) { return `<div class="t6-back-title">${NWC_ESC(ep.title)}</div>` + nwcBackHTML(ep); }

  // ---------- page view ----------
  function render() {
    const i = deck[idx], ep = T6_EPS[i];
    store(POS_KEY, String(i));
    $("t6-front").innerHTML = frontHTML(ep) + `<div class="t6-hint">tap to flip</div>`;
    $("t6-back").innerHTML = backHTML(ep);
    $("t6-front").classList.toggle("hidden", flipped);
    $("t6-back").classList.toggle("hidden", !flipped);
    $("fc-counter").textContent = (idx + 1) + " / " + deck.length;
    $("btn-fc-prev").disabled = idx === 0;
    $("btn-fc-next").disabled = idx === deck.length - 1;
    $("fc-jump").value = String(i);
    if (studying) renderStudy();
  }
  function flip() { flipped = !flipped; render(); if (!flipped) return; const c = $("t6-card"); if (c.getBoundingClientRect().top < 0) c.scrollIntoView({ block: "start" }); }
  function go(d) { const n = idx + d; if (n < 0 || n >= deck.length) return; idx = n; flipped = false; render(); }

  // ---------- study mode ----------
  const study = $("study"), card = $("study-card"), face = $("study-face");
  function renderStudy() {
    const ep = T6_EPS[deck[idx]];
    face.className = "study-face " + (flipped ? "t6-back" : "t6-front");
    face.innerHTML = flipped ? backHTML(ep) : frontHTML(ep);
    face.scrollTop = 0;
    $("study-count").textContent = (idx + 1) + " / " + deck.length;
    $("study-fill").style.width = ((idx + 1) / deck.length * 100) + "%";
    $("study-side").textContent = flipped ? "Back" : "Front";
    $("study-prev").disabled = idx === 0;
    $("study-next").disabled = idx === deck.length - 1;
  }
  const later = (ms, fn) => setTimeout(fn, REDUCED ? 0 : ms);
  function setT(transform, ms) { card.style.transition = ms && !REDUCED ? `transform ${ms}ms ease-out` : "none"; card.style.transform = transform; }
  function studyFlip() {
    if (busy) return; busy = true;
    setT("rotateY(90deg)", 130);
    later(130, () => {
      flipped = !flipped; render();
      setT("rotateY(-90deg)", 0); void card.offsetWidth;
      setT("none", 130);
      later(130, () => { busy = false; });
    });
  }
  function studyGo(dir) {
    const n = idx + dir;
    if (busy) return;
    if (n < 0 || n >= deck.length) { setT("none", 200); return; }
    busy = true;
    const w = window.innerWidth;
    setT(`translateX(${-dir * w * 1.2}px) rotate(${-dir * 10}deg)`, 200);
    later(200, () => {
      idx = n; flipped = false; render();
      setT(`translateX(${dir * w * 0.5}px)`, 0); void card.offsetWidth;
      setT("none", 200);
      later(200, () => { busy = false; });
    });
  }
  // Drag: horizontal moves follow the finger; vertical ones are left to the
  // browser (touch-action: pan-y) so a long back scrolls. A still tap flips.
  let drag = null;
  card.addEventListener("pointerdown", e => {
    if (busy || (e.pointerType === "mouse" && e.button !== 0) || e.target.closest("a, button")) return;
    drag = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, dx: 0, axis: null };
  });
  card.addEventListener("pointermove", e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (drag.axis === "x") { try { card.setPointerCapture(e.pointerId); } catch (err) {} }
    }
    if (drag.axis !== "x") return;
    const atEnd = (dx > 0 && idx === 0) || (dx < 0 && idx === deck.length - 1);
    drag.dx = atEnd ? dx * 0.3 : dx;
    setT(`translateX(${drag.dx}px) rotate(${drag.dx / 30}deg)`, 0);
  });
  card.addEventListener("pointerup", e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.axis) { studyFlip(); return; }
    if (d.axis !== "x") return;
    const v = Math.abs(d.dx) / Math.max(1, performance.now() - d.t);
    if (Math.abs(d.dx) > card.offsetWidth * 0.25 || (Math.abs(d.dx) > 40 && v > 0.5)) studyGo(d.dx < 0 ? 1 : -1);
    else setT("none", 200);
  });
  card.addEventListener("pointercancel", () => { if (drag && drag.axis === "x") setT("none", 200); drag = null; });

  let scrollY = 0, pushed = false;
  function openStudy(fromHash) {
    if (studying) return;
    studying = true; scrollY = window.scrollY;
    document.documentElement.classList.add("study-open");
    document.body.style.top = -scrollY + "px";
    study.hidden = false; flipped = false; render();
    setT("none", 0);
    if (!fromHash) { history.pushState({ study: 1 }, "", "#study"); pushed = true; }
    $("study-close").focus({ preventScroll: true });
  }
  function closeStudy() {
    if (!studying) return;
    studying = false; study.hidden = true;
    document.documentElement.classList.remove("study-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
    flipped = false; render();
  }
  $("btn-study").addEventListener("click", () => openStudy(false));
  $("study-close").addEventListener("click", () => {
    if (pushed) history.back(); // popstate closes it, and the back gesture stays in sync
    else { history.replaceState(null, "", location.pathname + location.search); closeStudy(); }
  });
  window.addEventListener("popstate", () => { pushed = false; if (location.hash !== "#study") closeStudy(); });
  $("study-prev").addEventListener("click", () => studyGo(-1));
  $("study-next").addEventListener("click", () => studyGo(1));
  $("study-order").addEventListener("click", () => toggleOrder());

  // ---------- controls ----------
  function toggleOrder() {
    shuffled = !shuffled;
    store(ORDER_KEY, shuffled ? "shuffle" : "order");
    build(shuffled ? undefined : deck[idx]);
  }
  $("fc-jump").innerHTML = T6_EPS.map((ep, i) => `<option value="${i}">${i + 1}. ${NWC_ESC(ep.short || ep.title)}</option>`).join("");
  $("fc-jump").addEventListener("change", e => { idx = deck.indexOf(+e.target.value); flipped = false; render(); });
  $("btn-fc-order").addEventListener("click", toggleOrder);
  $("t6-card").addEventListener("click", flip);
  $("btn-fc-next").addEventListener("click", () => go(1));
  $("btn-fc-prev").addEventListener("click", () => go(-1));
  document.addEventListener("keydown", e => {
    if (studying) {
      if (e.key === "Escape") { e.preventDefault(); $("study-close").click(); }
      else if (e.key === " " || (e.key === "Enter" && !e.target.closest("button"))) { e.preventDefault(); studyFlip(); }
      else if (e.key === "ArrowRight") studyGo(1);
      else if (e.key === "ArrowLeft") studyGo(-1);
      return;
    }
    if (e.target.closest && e.target.closest("select, button:not(#t6-card), input, textarea")) return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  });

  const saved = load(POS_KEY);
  build(saved !== null && T6_EPS[+saved] ? +saved : undefined);
  if (location.hash === "#study") openStudy(true);
})();
