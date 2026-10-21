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

// 2画面モード：横スライド（ボタン・ドラッグ・スワイプ）
document.querySelectorAll(".pan").forEach((pan) => {
  const track = pan.querySelector(".pan-track");
  const bar = pan.querySelector(".pan-bar span");
  const btns = pan.querySelectorAll("[data-pan]");
  const max = () => track.scrollWidth - track.clientWidth;
  const update = () => {
    const m = max();
    const ratio = m > 0 ? track.scrollLeft / m : 0;
    const w = Math.max(12, (track.clientWidth / track.scrollWidth) * 100);
    bar.style.width = w + "%";
    bar.style.transform = `translateX(${(ratio * (100 - w) * 100) / w}%)`;
    btns.forEach((b) => b.setAttribute("aria-pressed", String((ratio >= 0.5 ? 1 : 0) === Number(b.dataset.pan))));
  };
  btns.forEach((b) => b.addEventListener("click", () => track.scrollTo({ left: Number(b.dataset.pan) ? max() : 0 })));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  track.querySelector("img").addEventListener("load", update);
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { track.scrollBy({ left: track.clientWidth * 0.6 }); e.preventDefault(); }
    if (e.key === "ArrowLeft") { track.scrollBy({ left: -track.clientWidth * 0.6 }); e.preventDefault(); }
  });
  // マウスでドラッグ
  let down = false, sx = 0, sl = 0;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; sx = e.clientX; sl = track.scrollLeft;
    track.classList.add("dragging"); track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", (e) => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
  const end = () => { down = false; track.classList.remove("dragging"); };
  track.addEventListener("pointerup", end);
  track.addEventListener("pointercancel", end);
  update();
});

// 最新版の表示（トップのヒーロー下など、[data-latest-pill] がある所）
(() => {
  const pills = document.querySelectorAll("[data-latest-pill]");
  if (!pills.length) return;
  fetch("https://jinaxion.github.io/TomoNexus-update/update.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((u) => {
      if (!/^\d+\.\d+\.\d+$/.test(u.latest || "")) return;
      pills.forEach((p) => {
        p.querySelector("b").textContent = "v" + u.latest;
        p.hidden = false;
      });
    })
    .catch(() => {});
})();

// FAQへのリンクで、その項目を開いてから移動
document.querySelectorAll("[data-open-faq]").forEach((a) =>
  a.addEventListener("click", () => {
    const d = document.querySelector(a.getAttribute("href"));
    if (d && d.tagName === "DETAILS") d.open = true;
  })
);
if (location.hash) {
  const d = document.querySelector(location.hash);
  if (d && d.tagName === "DETAILS") d.open = true;
}

// コピーボタン
document.querySelectorAll("[data-copy-from]").forEach((b) =>
  b.addEventListener("click", async () => {
    const src = document.querySelector(b.dataset.copyFrom);
    if (!src) return;
    try {
      await navigator.clipboard.writeText(src.textContent.trim());
      const t = b.textContent;
      b.textContent = "コピーしました";
      b.classList.add("done");
      setTimeout(() => { b.textContent = t; b.classList.remove("done"); }, 1600);
    } catch (e) {}
  })
);

// 安心して試してもらうために：最新版の SHA-256 / VirusTotal を history.json から表示
(() => {
  const box = document.querySelector("[data-safety]");
  if (!box) return;
  fetch("https://jinaxion.github.io/TomoNexus-update/history.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((h) => {
      const e = (h.entries || []).find((x) => x.download && x.download.sha256);
      if (!e) return Promise.reject();
      const d = e.download;
      box.querySelector("[data-safe-sha]").textContent = d.sha256;
      box.querySelector("[data-safe-file]").textContent = `${d.file || ""}（v${e.version}${d.size ? "・" + d.size : ""}）`;
      if (d.file) box.querySelector("[data-safe-cmd]").textContent = `Get-FileHash .\\${d.file}`;
      const vt = box.querySelector("[data-safe-vt]");
      if (/^https:\/\/www\.virustotal\.com\//.test(d.virustotal || "")) vt.href = d.virustotal;
      else vt.hidden = true;
    })
    .catch(() => {
      box.querySelector("[data-safe-sha]").textContent = "更新履歴ページでご確認ください";
      box.querySelector("[data-safe-vt]").href = "history.html";
    });
})();
