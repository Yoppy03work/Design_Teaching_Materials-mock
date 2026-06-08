# 色覚シミュレータ Chrome 拡張（MV3）

どの Web ページにも、色覚多様性（P型/D型/T型・程度つき、**Machado 2009**）の見え方を重ねて確認できる拡張機能です。教材アプリの色覚ロジック（`lib/colorblind*`）と同じ行列を使います。

## 仕組み
- `cvd-data.js`：Machado 2009 の変換行列（線形RGB）。`lib/colorblind-data.ts` から自動生成。
- `content.js`：ページ全体に SVG `feColorMatrix`（`color-interpolation-filters="linearRGB"`）を適用。
- `popup.html` / `popup.js`：型・程度・ON/OFF の操作。設定は `chrome.storage.local` に保存し、content script が変更を監視して反映。

## インストール（未パッケージ拡張の読み込み）
1. Chrome で `chrome://extensions` を開く
2. 右上の「デベロッパーモード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」→ この `extension/` フォルダを選択
4. 任意のページを開く（または再読み込み）→ ツールバーのアイコンから有効化し、型・程度を選択

## 注意
- 反映されるのは「拡張を入れた後に開いた／再読み込みしたページ」です（既に開いていたタブは再読み込みしてください）。
- `chrome://` などのブラウザ内部ページや Chrome ウェブストアには適用できません（拡張の仕様）。
- ページ全体に CSS filter をかけるため、`position: fixed` 要素の挙動が変わる場合があります（確認用途では問題ありません）。
- 手法は Machado 2009（単一行列でページ全体に適用できるため）。Brettel 1997 はアプリ内の「色の見え方くらべ」で確認できます。
- 動画など `<video>` や Canvas/WebGL も、ページに CSS filter がかかる範囲でシミュレーションされます。
