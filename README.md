# TomoNexus 公式サイト

GitHub Pages で公開している TomoNexus の公式サイトです。ビルド不要の静的HTMLです。

## 構成

```
index.html          トップ（LP）
shikumi.html        しくみ（データの流れ・費用・学習利用）
assets/css/style.css
assets/js/main.js   ← BOOTHのURLはここの SITE.boothUrl に1か所だけ書く
assets/img/         画像（WebP）・OGP・アイコン
assets/video/       Talk / Memo の実機映像（軽量化済み）
.nojekyll
```

## 公開設定

Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `/ (root)` → Save

## 更新メモ

- BOOTHのURLは `assets/js/main.js` の `boothUrl`（空にすると「体験版 近日公開」表示に戻る）
- YouTube：紹介動画 RyqpIembaJY ／ ショート ItryU8vBAto（index.html の #movie セクション）
- 元デザイン：Claude Design の「TomoNexus BOOTH広告」「Tomo のしくみ」
