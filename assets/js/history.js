// 更新履歴：TomoNexus-update リポジトリ（GitHub Pages）の history.json / update.json を読んで表示
(() => {
  const FEED = "https://jinaxion.github.io/TomoNexus-update/";
  const TYPES = { new: "新機能", improve: "改善", fix: "修正", notice: "お知らせ" };
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text; // 文字として出す（HTMLとして読まない）
    return e;
  };
  const fmt = (d) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || "");
    return m ? `${m[1]}.${m[2]}.${m[3]}` : d || "";
  };
  const get = (f) => fetch(FEED + f, { cache: "no-cache" }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

  const list = $("#timeline");
  const chips = document.querySelectorAll(".chip");
  let entries = [];
  let filter = "all";

  function render() {
    list.replaceChildren();
    const shown = entries.filter((e) => filter === "all" || (e.changes || []).some((c) => c.type === filter));
    if (!shown.length) {
      list.append(el("li", "hist-msg", "この種類の更新はまだありません。"));
      return;
    }
    shown.forEach((e) => {
      const li = el("li", "rel" + (e === entries[0] ? " latest" : ""));
      li.id = "v" + e.version;
      const card = el("article", "rel-card");
      const top = el("div", "rel-top");
      top.append(el("span", "rel-ver", "v" + e.version), el("time", "rel-date", fmt(e.date)));
      if (e === entries[0]) top.append(el("span", "badge", "最新"));
      card.append(top);
      if (e.title) card.append(el("h2", "rel-title", e.title));
      if (e.summary) card.append(el("p", "rel-sum", e.summary));
      const ul = el("ul", "changes");
      (e.changes || [])
        .filter((c) => filter === "all" || c.type === filter)
        .forEach((c) => {
          const row = el("li");
          row.append(el("span", "tagc " + (TYPES[c.type] ? c.type : "notice"), TYPES[c.type] || "その他"), el("span", null, c.text));
          ul.append(row);
        });
      if (ul.children.length) card.append(ul);
      li.append(card);
      list.append(li);
    });
  }

  chips.forEach((c) =>
    c.addEventListener("click", () => {
      filter = c.dataset.filter;
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
      render();
    })
  );

  Promise.allSettled([get("update.json"), get("history.json")]).then(([u, h]) => {
    const upd = u.status === "fulfilled" ? u.value : null;
    entries = h.status === "fulfilled" && Array.isArray(h.value.entries) ? h.value.entries : [];
    // history.json が無い・読めないときは update.json だけで1件つくる
    if (!entries.length && upd && upd.latest) {
      entries = [{ version: upd.latest, date: upd.publishedAt, title: upd.notes || "", changes: [] }];
    }
    const latest = (upd && upd.latest) || (entries[0] && entries[0].version);
    if (latest) {
      $("#latestVer").textContent = "v" + latest;
      const date = (upd && upd.publishedAt) || (entries[0] && entries[0].date);
      $("#latestDate").textContent = date ? "公開日 " + fmt(date) : "";
      $("#minSup").textContent = upd && upd.minSupported ? `サポート対象 v${upd.minSupported} 以降` : "";
      const note = (upd && upd.notes) || (entries[0] && entries[0].title) || "";
      $("#latestNote").textContent = note;
    } else {
      $("#latestVer").textContent = "BOOTHで確認";
      $("#latestVer").classList.add("ver-off");
    }
    if (!entries.length) {
      document.querySelector(".chips").hidden = true;
      list.classList.add("empty");
      list.replaceChildren(el("li", "hist-msg", "更新履歴を読み込めませんでした。時間をおいて再読み込みするか、BOOTHの商品ページをご覧ください。"));
      return;
    }
    render();
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  });
})();
