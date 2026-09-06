# Sabiasagi Portfolio

映像・モーション・CG作品の個人ポートフォリオ。GitHub Pages向けの静的HTML/CSS/JavaScriptで構成しています。

## 作品の更新

`data.json` が作品情報の原本です。更新後に以下を実行し、生成された `index.html` もコミットしてください。

```sh
node scripts/render-works.mjs
```

トップの導入作品は `index.html` の `opening-work`（id 11）。作品の編集順序は `scripts/render-works.mjs` の `order`、画面上の配置は `style.css` にあります。導入作品を変える場合は、そのHTMLと生成スクリプトの除外IDを合わせて変更します。

画像は `assets/images` の既存素材を使用。サムネイルは元の比率・色で表示します。トップの全13作品はJavaScriptなしでも表示でき、詳細画面は `data.json` を読み込みます。動画プレーヤーは再生ボタンを押した後に読み込みます。

## 表示

青灰色・薄紫・くすんだピンク・淡い橙を基調に、作品ごとに幅・配置・間隔を変更しています。760px以下でも幅と左右の余白に変化を残します。通常のスクロール・ポインター操作、キーボードフォーカス、動きを減らす設定に対応しています。

## 確認

```sh
node --check script.js
node --check Works/detail.js
node --check scripts/render-works.mjs
git diff --check
```

`index.html`、`about.html`、`contact.html`、`Works/detail.html?id=11` を入口として使用します。サブディレクトリで公開できるよう、サイト内リンクと素材参照は相対パスです。
