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

- BOOTH公開後：`assets/js/main.js` の `boothUrl` にURLを入れると、全ページのボタンがBOOTHへ飛ぶようになります（空の間は「体験版 近日公開」表示）
- 元デザイン：Claude Design の「TomoNexus BOOTH広告」「Tomo のしくみ」
