(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* backdrop + progress */
  var bg = document.createElement("div"); bg.className = "bg"; bg.setAttribute("aria-hidden", "true"); document.body.prepend(bg);
  var pr = document.createElement("div"); pr.className = "progress"; pr.setAttribute("aria-hidden", "true"); document.body.prepend(pr);

  /* scroll-linked bits */
  var bar = $(".bar")[0], art = $(".hero-art")[0], wm = $(".wm")[0], ticking = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    pr.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    if (bar) bar.classList.toggle("scrolled", y > 8);
    if (!reduce) {
      if (art && y < 900) art.style.transform = "scale(1.06) translate3d(0," + (y * .16).toFixed(1) + "px,0)";
      if (wm) { var r = wm.parentNode.getBoundingClientRect(); wm.style.transform = "translateY(" + Math.max(0, (innerHeight - r.top) * -.04).toFixed(1) + "px)"; }
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* reveal on scroll */
  var groups = [".sec-head", ".hero-in > div:first-child > *", ".hero-visual", ".bento > *", ".products > *", ".stack > *", ".plans > *", ".summary", ".fx-list", ".fx-panel", ".gallery > *", ".table-wrap", ".reviews > *", ".faq > *", ".support > *", ".helps > *", ".pgrid > *", ".perks > *", ".phead-in > *"];
  groups.forEach(function (sel) { $(sel).forEach(function (n, i) { if (!n.classList.contains("rv")) { n.classList.add("rv"); n.style.setProperty("--i", Math.min(i % 6, 5)); } }); });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    $(".rv").forEach(function (n) { io.observe(n); });
    setTimeout(function () { $(".rv:not(.in)").forEach(function (n) { var r = n.getBoundingClientRect(); if (r.top < innerHeight) n.classList.add("in"); }); }, 1400);
  } else { $(".rv").forEach(function (n) { n.classList.add("in"); }); }

  /* orbiting light borders */
  var orbits = [[".hero-frame", 0, "7s"], [".b-cta", 0, "6s"], [".cta-panel", 0, "7s"], [".summary", 0, "6s"], [".bcard:not(.b-cta)", 1, "5.5s"], [".pcard", 1, "5s"], [".perk", 1, "5s"], [".mini", 1, "5s"]];
  orbits.forEach(function (o) { $(o[0]).forEach(function (n, i) {
    var d = document.createElement("i"); d.className = "orbit" + (o[1] ? " hv" : ""); d.setAttribute("aria-hidden", "true");
    d.style.setProperty("--dur", o[2]); d.style.setProperty("--dl", (-(i * 1.3 % 5)).toFixed(1) + "s"); n.appendChild(d);
  }); });
  var hv = document.getElementById("hv");
  if (hv && fine && !reduce) {
    var hf = hv.querySelector(".hero-frame");
    hv.addEventListener("pointermove", function (e) { var r = hv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; hf.style.transform = "rotateY(" + (-7 + x * 8).toFixed(2) + "deg) rotateX(" + (3 - y * 7).toFixed(2) + "deg)"; });
    hv.addEventListener("pointerleave", function () { hf.style.transform = ""; });
  }

  /* count-up */
  $("[data-count]").forEach(function (n) {
    var to = +n.dataset.count, suf = n.dataset.suffix || "", done = false;
    if (reduce) { n.textContent = to + suf; return; }
    new IntersectionObserver(function (es, ob) { es.forEach(function (e) { if (e.isIntersecting && !done) { done = true; ob.disconnect();
      var t0 = performance.now(); (function step(t) { var p = Math.min(1, (t - t0) / 1100), v = Math.round(to * (1 - Math.pow(1 - p, 3))); n.textContent = v + suf; if (p < 1) requestAnimationFrame(step); })(t0); } }); }).observe(n);
  });

  /* marquee: duplicate once for a seamless loop */
  var ul = $(".facts ul")[0];
  if (ul && !reduce) { ul.innerHTML += ul.innerHTML; $("li", ul).forEach(function (l, i) { if (i >= ul.children.length / 2) l.setAttribute("aria-hidden", "true"); }); }

  /* pointer effects (mouse only) */
  if (fine && !reduce) {
    document.addEventListener("pointermove", function (e) {
      var t = e.target.closest && e.target.closest(".feature-card,.mini,.review,.help,.pcard,.perk,.summary,.bcard");
      if (!t) return;
      var r = t.getBoundingClientRect(); t.style.setProperty("--mx", (e.clientX - r.left) + "px"); t.style.setProperty("--my", (e.clientY - r.top) + "px");
      if (t.matches(".feature-card,.pcard")) {
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.style.transform = "perspective(900px) rotateX(" + (-y * 4).toFixed(2) + "deg) rotateY(" + (x * 5).toFixed(2) + "deg) translateY(-4px)";
      }
    });
    document.addEventListener("pointerout", function (e) { var t = e.target.closest && e.target.closest(".feature-card,.pcard"); if (t && !t.contains(e.relatedTarget)) t.style.transform = ""; });
    $(".btn-primary").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .14).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* feature panel swap animation */
  var fl = document.getElementById("fx-list"), fp = document.getElementById("fx-panel");
  if (fl && fp) fl.addEventListener("click", function () { fp.classList.remove("swap"); void fp.offsetWidth; fp.classList.add("swap"); });
})();
