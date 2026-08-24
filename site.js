// ============================================================
// SITE-WIDE BEHAVIOR: theme toggle + header menu.
// The <head> of every page runs a tiny inline script that applies
// the saved theme before first paint; this file wires the toggle.
// ============================================================
(function () {
  // The site lives at mifmaster.com. GitHub redirects the old github.io
  // address; this catches anything cached from before the move.
  if (location.hostname.endsWith("github.io")) {
    location.replace("https://mifmaster.com" + location.pathname.replace(/^\/nife-quiz/, "") + location.search + location.hash);
    return;
  }
  const KEY = "nife-theme";
  const root = document.documentElement;

  function current() {
    const set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) { /* no storage */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "light" ? "#f3f5f9" : "#0b111c";
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => apply(current() === "light" ? "dark" : "light"));
  }
  // keep the meta color honest if the saved theme was applied by the head script
  if (root.getAttribute("data-theme")) apply(root.getAttribute("data-theme"));

  // ---------- Feedback: bad-question reports + feature suggestions ----------
  // Submitted silently to a Google Form that feeds the author's spreadsheet.
  // Nobody leaves the page and no account is needed. Fields map to the form's
  // Type / Location / Question / Details / Name short-answer questions.
  const FORM = "https://docs.google.com/forms/d/e/1FAIpQLSdYYlcmaQQBXKQn4JBSLFdfBBSV829qpGlSYAmJ5mKNr-cWrw/formResponse";
  const ENTRY = { type: "entry.511159920", location: "entry.362007961", question: "entry.1701866875", details: "entry.600501211", name: "entry.1553138820" };
  window.mifFeedback = async function (f) {
    const body = new URLSearchParams();
    for (const k in ENTRY) body.append(ENTRY[k], f[k] || "");
    // no-cors: the response is opaque, but the submission goes through
    await fetch(FORM, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  };

  const sf = document.getElementById("suggest-form");
  if (sf) {
    const status = document.getElementById("suggest-status");
    sf.addEventListener("submit", async e => {
      e.preventDefault();
      const details = document.getElementById("suggest-text").value.trim();
      const name = document.getElementById("suggest-name").value.trim();
      if (!details) return;
      const btn = sf.querySelector("button[type=submit]");
      btn.disabled = true; status.textContent = "Sending…";
      try {
        await window.mifFeedback({ type: "Feature suggestion", location: "Homepage", question: "", details, name });
        status.textContent = "Sent — thanks. The author reads every one.";
        sf.reset();
      } catch (err) {
        status.textContent = "Couldn't send — check your connection and try again.";
      }
      btn.disabled = false;
    });
  }

  // close the Academics menu on outside click / Escape
  const menu = document.querySelector("details.menu");
  if (menu) {
    document.addEventListener("click", e => { if (!menu.contains(e.target)) menu.removeAttribute("open"); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") menu.removeAttribute("open"); });
  }
})();
