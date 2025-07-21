# v1 から v3 への移行ガイド

[English](/docs/en/migration-from-v1.md) | **日本語**

このガイドは、Viewport Extra v1 と v3 の違いを説明するものです。v1 も引き続き使用できますが、v3 へ移行することで、ページ表示遅延の回避、ブラウザの幅ごとに異なる最小幅・最大幅を適用する機能の追加、[W3C の仕様](https://www.w3.org/TR/css-viewport-1/#meta-properties)との整合性確保といった改善が得られます。

## ハイライト

### スクリプトを使用する場合

<!-- x-release-please-start-version -->

```diff
  <meta name="viewport" content="width=device-width,initial-scale=1">
+ <meta name="viewport-extra" content="minimum-width=412">
  <script
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1/dist/viewport-extra.min.js"
+   async
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1"
  ></script>
- <script>new ViewportExtra(412)</script>

  <meta name="viewport" content="width=device-width,initial-scale=1">
+ <meta name="viewport-extra" content="minimum-width=412,maximum-width=640">
  <script
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1/dist/viewport-extra.min.js"
+   async
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1"
  ></script>
- <script>new ViewportExtra({ minWidth: 412, maxWidth: 640 })</script>

  <!-- ES2021 の構文、および Baseline の Widely Available ステージにある機能をサポートしない環境で動作させる場合 -->
  <script
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1/dist/viewport-extra.min.js"
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1/dist/immediate/es5/viewport-extra.min.js"
  ></script>
```

<!-- x-release-please-end-version -->

### モジュールを使用する場合

```diff
- import ViewportExtra from "viewport-extra"
- new ViewportExtra(412)
+ import("viewport-extra").then(({ apply }) => {
+   apply([{ content: { minimumWidth: 412 } }])
+ })

- import ViewportExtra from "viewport-extra"
- new ViewportExtra({ minWidth: 412, maxWidth: 640 })
+ import("viewport-extra").then(({ apply }) => {
+   apply([{ content: { minimumWidth: 412, maximumWidth: 640 } }])
+ })

  // ES2021 の構文、および Baseline の Widely Available ステージにある機能をサポートしない環境で動作させる場合
- import "viewport-extra"
+ import("viewport-extra/es5")
```

## 詳細

- [ビルドの選択](#ビルドの選択)
- [最小幅・最大幅適用 API](#最小幅最大幅適用-api)
- [最小・最大を表す語句](#最小最大を表す語句)

### ビルドの選択

v1 では、単一のビルドを提供しています。このビルドは、API の呼び出しが必要であり、`<script>` 要素の `async` 属性との併用が難しい点と、[UMD 形式](https://github.com/umdjs/umd#readme)であり、`import()` 構文に対応していない点から、ページの表示を遅延させる可能性があります。

v3 では、複数あるビルドの中から、API の呼び出しが不要なビルドを選択することができます。また、スクリプト向けには [IIFE 形式](https://developer.mozilla.org/ja/docs/Glossary/IIFE)を、モジュール向けには ESM, CJS 形式を提供しています。ビルド選択の基準となる機能は以下の通りです。

- **`meta` 要素読み取り・即時適用:** Viewport Extra が実行可能となった時点で、即時に `<meta name="viewport">` 要素、および `<meta name="viewport-extra">` 要素から最小幅・最大幅を読み取り、適用する機能です。API の呼び出しは必要ありません。
- **高度な機能:** ほとんどの場合不要な機能です。<!-- x-release-please-start-version -->v3.0.0-rc.0<!-- x-release-please-end-version --> 時点では、小数点以下の桁数指定機能がこれに含まれます。
- **レガシー環境での動作:** ES2015+ をサポートしない環境 (例: IE11) であっても動作する機能です。また、この機能を持たないビルドには、ES2021 の構文、および Viewport Extra v3.0.0-rc.1 公開時点で [Web Platform Baseline](https://web.dev/baseline?hl=ja) の Widely Available ステージにある機能が含まれるため、それらをサポートしない環境 (例: iOS Safari < 16, Android Chrome < 108) での動作にも使用できます。

#### スクリプトを使用する場合

##### v1 の構文

単一のビルドのみを選択できます。API の呼び出し前に、Viewport Extra の読み込み完了を待機するため、`<script>` 要素を `async` 属性を設定せずに使用します。

```html
<meta name="viewport" content="width=device-width,initial-scale=1">

<script src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1/dist/viewport-extra.min.js"></script>
<script>new ViewportExtra(412)</script>
```

##### v3 の構文

複数のビルドを選択できます。

|                                   URL のファイルパス | `meta` 要素読み取り・即時適用 | 高度な機能 | レガシー環境での動作 |
| ---------------------------------------------------: | :---------------------------: | :--------: | :------------------: |
|                        `/dist/viewport-extra.min.js` |               -               |     -      |          -           |
|                    `/dist/es5/viewport-extra.min.js` |               -               |     -      |          ✔          |
|               `/dist/extended/viewport-extra.min.js` |               -               |     ✔     |          -           |
|           `/dist/extended/es5/viewport-extra.min.js` |               -               |     ✔     |          ✔          |
|                                               (なし) |              ✔               |     -      |          -           |
|          `/dist/immediate/es5/viewport-extra.min.js` |              ✔               |     -      |          ✔          |
|     `/dist/immediate/extended/viewport-extra.min.js` |              ✔               |     ✔     |          -           |
| `/dist/immediate/extended/es5/viewport-extra.min.js` |              ✔               |     ✔     |          ✔          |

`meta` 要素読み取り・即時適用が可能なビルドを選択し、API の呼び出しを不要とすることで、`<script>` 要素の `async` 属性と併用することができます。この場合は、URL にファイルパス部分のないビルドが最小サイズであり、理想的です。

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="minimum-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1"></script>
```

<!-- x-release-please-end-version -->

ES2021 の構文、および [Web Platform Baseline](https://web.dev/baseline?hl=ja) の Widely Available ステージにある機能をサポートしない環境で動作させる場合は、URL のファイルパスに `es5` を含むビルドが必要です。

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="minimum-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1/dist/immediate/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end-version -->

ビルドの選択が難しい場合は、URL のファイルパスが `/dist/immediate/extended/es5/viewport-extra.min.js` のビルドにすべての機能が含まれています。

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="minimum-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.1/dist/immediate/extended/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end-version -->

#### モジュールを使用する場合

##### v1 の構文

単一のビルドのみを選択できます。`import` 宣言を使用する必要があります。

```js
import "viewport-extra"
```

##### v3 の構文

複数のビルドを選択できます。

|                        モジュール指定子 | `meta` 要素読み取り・即時適用 | 高度な機能 | レガシー環境での動作 |
| --------------------------------------: | :---------------------------: | :--------: | :------------------: |
|                        `viewport-extra` |               -               |     -      |          -           |
|                    `viewport-extra/es5` |               -               |     -      |          ✔          |
|               `viewport-extra/extended` |               -               |     ✔     |          -           |
|           `viewport-extra/extended/es5` |               -               |     ✔     |          ✔          |
|              `viewport-extra/immediate` |              ✔               |     -      |          -           |
|          `viewport-extra/immediate/es5` |              ✔               |     -      |          ✔          |
|     `viewport-extra/immediate/extended` |              ✔               |     ✔     |          -           |
| `viewport-extra/immediate/extended/es5` |              ✔               |     ✔     |          ✔          |

`import()` 構文を使用することができます。モジュール指定子が `viewport-extra` のビルドが最小サイズであり、理想的です。

```js
import("viewport-extra")
```

ES2021 の構文、および [Web Platform Baseline](https://web.dev/baseline?hl=ja) の Widely Available ステージにある機能をサポートしない環境で動作させる場合は、モジュール指定子に `es5` を含むビルドが必要です。

```js
import("viewport-extra/es5")
```

ビルドの選択が難しい場合は、モジュール指定子が `viewport-extra/immediate/extended/es5` のビルドにすべての機能が含まれています。

```js
import("viewport-extra/immediate/extended/es5")
```

### 最小幅・最大幅適用 API

v1 の最小幅・最大幅適用 API である `ViewportExtra` コンストラクタは、引数として単一の最小幅・最大幅を受け取ります。ブラウザの幅ごとに異なる最小幅・最大幅を適用することはできません。

v3 の最小幅・最大幅適用 API である `apply()` 関数は、引数として複数の最小幅・最大幅を、メディアクエリとともに受け取ります。

#### スクリプトを使用する場合

##### v1 の構文

最小幅・最大幅の適用には、`ViewportExtra` コンストラクタを使用します。引数として単一の最小幅、もしくは単一の最小幅・最大幅を受け取ります。

```html
<script>
  new ViewportExtra(412)
</script>
```

```html
<script>
  new ViewportExtra({ minWidth: 412 })
</script>
```

##### v3 の構文

最小幅・最大幅の適用には、`apply()` 関数を使用します。

```html
<script>
  ViewportExtra.apply([{ content: { minimumWidth: 412 } }])
</script>
```

引数として複数の最小幅・最大幅を、メディアクエリとともに受け取ることができます。

```html
<script>
  ViewportExtra.apply([
    { content: { minimumWidth: 412 } }, // media を省略した場合はデフォルトの "" となる
    { content: { minimumWidth: 1024 }, media: "(min-width: 744px)" },
  ])
</script>
```

#### モジュールを使用する場合

##### v1 の構文

最小幅・最大幅の適用には、`ViewportExtra` コンストラクタを使用します。引数として単一の最小幅・最大幅を受け取ります。

```js
import ViewportExtra from "viewport-extra"

new ViewportExtra(412)
```

```js
import ViewportExtra from "viewport-extra"

new ViewportExtra({ minWidth: 412 })
```

##### v3 の構文

最小幅・最大幅の適用には、`apply()` 関数を使用します。

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minimumWidth: 412 } }])
})
```

引数として複数の最小幅・最大幅を、メディアクエリとともに受け取ることができます。

```js
import("viewport-extra").then(({ apply }) => {
  apply([
    { content: { minimumWidth: 412 } }, // media を省略した場合はデフォルトの "" となる
    { content: { minimumWidth: 1024 }, media: "(min-width: 744px)" },
  ])
})
```

### 最小・最大を表す語句

v1 では、最小幅・最大幅適用 API において、`min` / `max` という語句を使用しています (例: `minWidth`) 。しかし、[W3C の仕様](https://www.w3.org/TR/css-viewport-1/#meta-properties)において用いられる語句は `minimum` / `maximum` であり (例: `minimum-scale`) 、整合性を欠いています。

v3 では、最小幅・最大幅適用 API において、`minimum` / `maximum` という語句を使用しています (例: `minimumWidth`) 。また、これに合わせて、`meta` 要素の `(data-extra-)content` 属性においても、`minimum` / `maximum` という語句を使用しています (例: `minimum-width`) 。

#### スクリプトを使用する場合

##### v1 の構文

`ViewportExtra` コンストラクタの引数には、`minWidth` / `maxWidth` というプロパティ名を使用します。

```html
<script>
  new ViewportExtra({ minWidth: 412, maxWidth: 640 })
</script>
```

##### v3 の構文

`apply()` 関数の引数には、`minimumWidth` / `maximumWidth` というプロパティ名を使用します。

```html
<script>
  ViewportExtra.apply([{ content: { minimumWidth: 412, maximumWidth: 640 } }])
</script>
```

`<meta name="viewport">` 要素の `data-extra-content` 属性には、`minimum-width` / `maximum-width` というキーワードを使用します。

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="minimum-width=412,maximum-width=640"
>
```

`<meta name="viewport-extra">` 要素の `content` 属性にも、`minimum-width` / `maximum-width` というキーワードを使用します。

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,minimum-width=412,maximum-width=640"
>
```

#### モジュールを使用する場合

##### v1 の構文

`ViewportExtra` コンストラクタの引数には、`minWidth` / `maxWidth` というプロパティ名を使用します。

```js
import ViewportExtra from "viewport-extra"

new ViewportExtra({ minWidth: 412, maxWidth: 640 })
```

##### v3 の構文

`apply()` 関数の引数には、`minimumWidth` / `maximumWidth` というプロパティ名を使用します。

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minimumWidth: 412, maximumWidth: 640 } }])
})
```
