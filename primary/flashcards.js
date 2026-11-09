// ============================================================
// T-6B EP FLASHCARDS — one card per EP, like the class deck.
// Front: title, annunciators, abort criteria, W/C/N tally.
// Back: indications + corrective action with the NWCs in place.
// Needs T6_EPS (data.js) and T6_NWC / nwcBackHTML (nwc-data.js).
// ============================================================
(function () {
  const $ = id => document.getElementById(id);
  const ORDER_KEY = "nife-primary-fc-order";
  let deck = [], idx = 0, flipped = false;
  let shuffled = false;
  try { shuffled = localStorage.getItem(ORDER_KEY) === "shuffle"; } catch (e) {}

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function build(keepId) {
    const ids = T6_EPS.map((_, i) => i);
    deck = shuffled ? shuffle(ids) : ids;
    idx = keepId !== undefined ? Math.max(0, deck.indexOf(keepId)) : 0;
    $("btn-fc-order").textContent = shuffled ? "Key Order" : "Shuffle";
    flipped = false; render();
  }
  function frontHTML(ep) {
    const d = T6_NWC[ep.id] || {};
    let h = `<h2>${NWC_ESC(ep.title)}</h2>`;
    if (d.ann) h += `<div class="t6-ann">` + d.ann.map(([c, t]) => c === "-" ? `<span class="gap"></span>` : `<span class="${c}">${NWC_ESC(t)}</span>`).join("") + `</div>`;
    if (d.front) h += `<ul>` + d.front.map(t => `<li>${NWC_ESC(t)}</li>`).join("") + `</ul>`;
    h += `<div class="t6-counts">${d.counts ? NWC_ESC(d.counts) : "&nbsp;"}</div><div class="t6-hint">tap to flip</div>`;
    return h;
  }
  function render() {
    const i = deck[idx], ep = T6_EPS[i];
    $("t6-front").innerHTML = frontHTML(ep);
    $("t6-back").innerHTML = `<div class="t6-back-title">${NWC_ESC(ep.title)}</div>` + nwcBackHTML(ep);
    $("t6-front").classList.toggle("hidden", flipped);
    $("t6-back").classList.toggle("hidden", !flipped);
    $("fc-counter").textContent = (idx + 1) + " / " + deck.length;
    $("btn-fc-prev").disabled = idx === 0;
    $("btn-fc-next").disabled = idx === deck.length - 1;
    $("fc-jump").value = String(i);
  }
  function flip() { flipped = !flipped; render(); if (!flipped) return; const c = $("t6-card"); if (c.getBoundingClientRect().top < 0) c.scrollIntoView({ block: "start" }); }
  function go(d) { const n = idx + d; if (n < 0 || n >= deck.length) return; idx = n; flipped = false; render(); }

  $("fc-jump").innerHTML = T6_EPS.map((ep, i) => `<option value="${i}">${i + 1}. ${NWC_ESC(ep.short || ep.title)}</option>`).join("");
  $("fc-jump").addEventListener("change", e => { idx = deck.indexOf(+e.target.value); flipped = false; render(); });
  $("btn-fc-order").addEventListener("click", () => {
    shuffled = !shuffled;
    try { localStorage.setItem(ORDER_KEY, shuffled ? "shuffle" : "order"); } catch (e) {}
    build(shuffled ? undefined : deck[idx]);
  });
  $("t6-card").addEventListener("click", flip);
  $("btn-fc-next").addEventListener("click", () => go(1));
  $("btn-fc-prev").addEventListener("click", () => go(-1));
  document.addEventListener("keydown", e => {
    if (e.target.closest && e.target.closest("select, button:not(#t6-card), input, textarea")) return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  });
  build();
})();
