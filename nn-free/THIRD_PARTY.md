# 同梱ソフトウェア

すべてローカル配信し、実行時に外部CDNへアクセスしません。

| ソフトウェア | バージョン | 取得元 | ライセンス |
|---|---|---|---|
| Tesseract.js | 6.0.1 | https://registry.npmjs.org/tesseract.js/6.0.1 | Apache-2.0 (`vendor/LICENSE-tesseract.txt`) |
| tesseract.js-core | 6.0.0 | https://registry.npmjs.org/tesseract.js-core/6.0.0 | Apache-2.0 (`vendor/LICENSE-core.txt`) |
| PDF.js / pdfjs-dist | 4.10.38 | https://registry.npmjs.org/pdfjs-dist/4.10.38 | Apache-2.0 (`vendor/LICENSE-pdfjs.txt`、CMaps・標準フォントの個別LICENSEも同梱) |
| tessdata_fast / jpn.traineddata | release 4.1.0 | https://github.com/tesseract-ocr/tessdata_fast/tree/4.1.0 | Apache-2.0 (`vendor/LICENSE-tessdata.txt`) |

npmパッケージは配布メタデータのSHA-512 integrityと照合して展開しました。学習データは公式リポジトリの固定リリースからTLS検証付きで取得しました。

`jpn.traineddata` SHA-256: `1f5de9236d2e85f5fdf4b3c500f2d4926f8d9449f28f5394472d9e8d83b91b4d`

`vendor/SHA256SUMS` に同梱ファイルのチェックサムを記録しています。
