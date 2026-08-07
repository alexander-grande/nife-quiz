// Google Analytics 4 — loaded by every page of the site.
// To change the property, update the ID here (it appears twice).
(function () {
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-TE868FBZPT";
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-TE868FBZPT");
})();
