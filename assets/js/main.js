// ===== サイト設定（ここだけ書き換えればOK） =====
const SITE = {
  // BOOTHの商品ページURL。公開したらここに貼る（空のあいだは「近日公開」表示）
  boothUrl: "https://jinaxion.booth.pm/items/9001516",
};

// BOOTHリンクの差し込み
document.querySelectorAll("[data-booth]").forEach((a) => {
  if (SITE.boothUrl) {
    a.href = SITE.boothUrl;
    a.target = "_blank";
    a.rel = "noopener";
  } else {
    a.href = "#download";
    const label = a.querySelector("[data-booth-label]");
    if (label) label.textContent = "体験版 近日公開";
  }
});

// スマホ用メニュー
const btn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
if (btn && nav) {
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

// スクロールでふわっと表示
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // 動画は画面に入ったときだけ再生
  const vo = new IntersectionObserver((entries) =>
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    })
  );
  document.querySelectorAll("video[data-autoplay]").forEach((v) => vo.observe(v));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
