const btn = document.getElementById("menuBtn");
const panel = document.getElementById("menuPanel");
const backdrop = document.getElementById("menuBackdrop");


if (btn && panel && backdrop) {
  const open = () => {
    panel.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
  };
  const close = () => {
    panel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
  };

  btn.addEventListener("click", () => {
    const isOpen = panel.classList.contains("is-open");
    isOpen ? close() : open();
  });

  backdrop.addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

// ===== Hero reveal =====
window.addEventListener("load", () => {
  const heroCard = document.querySelector(".heroCard");
  if (heroCard) heroCard.classList.add("is-ready");
});

// ===== Scroll reveal (背景テキスト / Aboutカードも) =====
document.addEventListener("DOMContentLoaded", () => {
  const about = document.querySelector("#about .textBlock");
  if (about) about.classList.add("reveal");

  // ✅ .revealCard も監視対象に追加
  const els = document.querySelectorAll(".reveal, .revealCard");
  if (els.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add("is-in");
        io.unobserve(ent.target); // 1回だけ発火（エモ安定）
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
});
