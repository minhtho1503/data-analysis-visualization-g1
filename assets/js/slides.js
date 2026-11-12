(function () {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const N = slides.length;
  const deckName = document.body.dataset.deck || "";
  let cur = 0;

  const secs = Array.from(document.querySelectorAll(".toc h3")).map((h) => h.textContent);
  document.querySelectorAll(".slide.section").forEach((s) => {
    const n = Number(s.dataset.sec);
    s.insertAdjacentHTML("afterbegin",
      `<div class="sec-main"><p class="sec-n">${String(n).padStart(2, "0")}</p><h2>${secs[n - 1] || ""}</h2></div>`);
    s.insertAdjacentHTML("beforeend",
      `<ol class="sec-list">${secs.map((t, k) => `<li${k + 1 === n ? ' class="on"' : ""}><b>${String(k + 1).padStart(2, "0")}</b>${t}</li>`).join("")}</ol>`);
  });

  slides.forEach((s, k) => {
    const f = document.createElement("div");
    f.className = "foot";
    f.innerHTML = `<span>${deckName}</span><span>${k + 1} / ${N}</span>`;
    s.appendChild(f);
  });

  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);

  const ctrl = document.createElement("nav");
  ctrl.className = "ctrl";
  ctrl.innerHTML =
    `<a href="./" title="Back to project page">Back</a>` +
    `<button type="button" data-go="-1" title="Previous (Left arrow)">&lt;</button>` +
    `<span></span>` +
    `<button type="button" data-go="1" title="Next (Right arrow, Space)">&gt;</button>` +
    `<button type="button" data-full title="Full screen (F)">Full</button>`;
  document.body.appendChild(ctrl);
  const counter = ctrl.querySelector("span");

  function fit() {
    const s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    document.documentElement.style.setProperty("--scale", s);
  }

  function go(n) {
    cur = Math.max(0, Math.min(N - 1, n));
    slides.forEach((s, k) => s.classList.toggle("is-on", k === cur));
    counter.textContent = `${cur + 1} / ${N}`;
    bar.style.width = `${((cur + 1) / N) * 100}%`;
    history.replaceState(null, "", `#${cur + 1}`);
  }

  function full() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) go(cur + 1);
    else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) go(cur - 1);
    else if (k === "Home") go(0);
    else if (k === "End") go(N - 1);
    else if (k === "f" || k === "F") full();
    else return;
    e.preventDefault();
  });

  ctrl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-full")) full();
    else go(cur + Number(b.dataset.go));
    b.blur();
  });

  let x0 = null;
  document.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  let hideT;
  ["mousemove", "touchstart"].forEach((ev) => document.addEventListener(ev, () => {
    ctrl.classList.add("show");
    clearTimeout(hideT);
    hideT = setTimeout(() => ctrl.classList.remove("show"), 2500);
  }, { passive: true }));

  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", () => go(parseInt(location.hash.slice(1), 10) - 1 || 0));
  fit();
  go(parseInt(location.hash.slice(1), 10) - 1 || 0);
})();
