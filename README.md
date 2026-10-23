# 暮らしデザイン研究所

日本語のレスポンシブな静的サイトです。依存パッケージのインストールは不要です。

## 起動

```sh
cd /workspace/AI
npm run dev
```

ポート3000で配信します。Python 3を使用します。`index.html`がトップページ、`sheet.html`が記入・印刷できるA4のことばシートです。シートはご提供の画像の文言・4項目・公演情報を反映したWeb・印刷版です。元のPDFファイルは未提供です。入力は保存・送信されません。

Google Fontsが利用できない環境では端末の日本語フォントに切り替わります。イラストはローカルSVGで、画像配信サービスには依存しません。

## 確認

- トップページ、アンカー移動、モバイルメニュー
- 住まい・対話のカードから実践ダイアログを開閉（Esc対応）
- ことばシートを別タブで開き、記入、A4印刷・PDF保存

GitHub Pages公開先: https://runrunsan8-svg.github.io/AI/

GitHubのSettings → Pagesで、Deploy from a branch / main / (root) を選ぶと公開されます。`.nojekyll`により静的ファイルをそのまま配信します。
