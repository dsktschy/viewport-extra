# v2 から v3 への移行ガイド

[English](/docs/en/migration-from-v2.md) | **日本語**

このガイドは、Viewport Extra v2 と v3 の違いを説明するものです。v2 も引き続き使用できますが、v3 へ移行することで、ファイルサイズの減少、[W3C の仕様](https://www.w3.org/TR/css-viewport-1/#meta-properties)との整合性確保、[Dual Package Hazard](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_dual_package_hazard) の回避といった改善が得られます。

## ハイライト

### スクリプトを使用する場合

<!-- x-release-please-start-version -->

```diff
+ <!-- 廃止: data-(extra-)unscaled-computing 属性 -->
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1"
-   data-extra-unscaled-computing
  >
  <meta
    name="viewport-extra"
-   content="min-width=412,max-width=640"
+   content="minimum-width=412,maximum-width=640"
  >
  <script
    async
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0"
  ></script>

  <!-- ES2021 の構文、および Viewport Extra v3.0.0 公開時点における Web Platform Baseline の Widely Available ステージにある機能をサポートしない環境で動作させる場合 -->
  <script
    async
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/es5/viewport-extra.min.js"
  ></script>

  <!-- data-(extra-)decimal-places 属性を使用する場合 -->
  <script
    async
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/extended/viewport-extra.min.js"
  ></script>
```

<!-- x-release-please-end -->

### モジュールを使用する場合

```diff
  import("viewport-extra").then(({
-   setContent,
-   setParameters
+   apply
  }) => {
-   setContent({ minWidth: 412, maxWidth: 640 })
+   apply([{ content: { minimumWidth: 412, maximumWidth: 640 } }])

-   setParameters([{ content: { minWidth: 412, maxWidth: 640 } }])
+   apply([{ content: { minimumWidth: 412, maximumWidth: 640 } }])
  })

  // ES2021 の構文、および Viewport Extra v3.0.0 公開時点における Web Platform Baseline の Widely Available ステージにある機能をサポートしない環境で動作させる場合
- import("viewport-extra")
+ import("viewport-extra/es5")

  // decimalPlaces プロパティを使用する場合
- import("viewport-extra")
+ import("viewport-extra/extended")

  import("viewport-extra").then(({
-   setParameters,
-   updateReference
+   apply
  }) => {
-   updateReference()
+   // 廃止: updateReference() 関数

-   setParameters(
-     [{ content: { minWidth: 412 } }],
-     { unscaledComputing: true }
+   apply(
+     [{ content: { minimumWidth: 412 } }]
+     // 廃止: unscaledComputing プロパティ
    )

    window.addEventListener("awesome-event", () => {
-     setParameters([])
+     apply([{ content: { minimumWidth: 412 } }]) // 引数省略不可
    })
  })
```

## 詳細

- [ビルドの選択](#ビルドの選択)
- [最小幅・最大幅適用 API](#最小幅最大幅適用-api)
- [最小・最大を表す語句](#最小最大を表す語句)
- [最小幅・最大幅適用前のスケールリセット](#最小幅最大幅適用前のスケールリセット)
- [Viewport Extra 内部での最小幅・最大幅の保持](#viewport-extra-内部での最小幅最大幅の保持)
- [Viewport Extra 内部での `<meta name="viewport">` 要素の保持](#viewport-extra-内部での-meta-nameviewport-要素の保持)

### ビルドの選択

v2 では、すべての機能を含む単一のビルドを提供しています。一部の機能しか使用しないケースであっても、ファイルサイズを削減することはできません。

v3 では、含まれる機能の範囲が異なる複数のビルドを提供しています。ビルド選択の基準となる機能は以下の通りです。

- **`meta` 要素読み取り・即時適用:** Viewport Extra が実行可能となった時点で、即時に `<meta name="viewport">` 要素、および `<meta name="viewport-extra">` 要素から最小幅・最大幅を読み取り、適用する機能です。API の呼び出しは必要ありません。
- **高度な機能:** ほとんどの場合不要な機能です。v3.0.0-rc.0 時点では、小数点以下の桁数指定機能がこれに含まれます。<!-- x-release-please-version -->
- **レガシー環境での動作:** ES2015+ をサポートしない環境 (例: IE11) であっても動作する機能です。また、この機能を持たないビルドには、ES2021 の構文、および Viewport Extra v3.0.0 公開時点で [Web Platform Baseline](https://web.dev/baseline?hl=ja) の Widely Available ステージにある機能が含まれるため、それらをサポートしない環境 (例: iOS Safari < 16, Android Chrome < 108) での動作にも使用できます。

#### スクリプトを使用する場合

##### v2 の構文

単一のビルドのみを選択できます。

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>
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

`meta` 要素読み取り・即時適用を使用する場合は、URL にファイルパス部分のないビルドが最小サイズであり、理想的です。

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0"></script>
```

<!-- x-release-please-end -->

`meta` 要素読み取り・即時適用を使用せず、API の呼び出しのみを使用する場合は、URL のファイルパスが `/dist/viewport-extra.min.js` のビルドが最小サイズであり、理想的です。

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

ES2021 の構文、および Viewport Extra v3.0.0 公開時点における [Web Platform Baseline](https://web.dev/baseline?hl=ja) の Widely Available ステージにある機能をサポートしない環境で動作させる場合は、URL のファイルパスに `es5` を含むビルドが必要です。

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

小数点以下の桁数指定機能を使用する場合は、URL のファイルパスに `extended` を含むビルドが必要です。

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/extended/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

ビルドの選択が難しい場合は、URL のファイルパスが `/dist/immediate/extended/es5/viewport-extra.min.js` のビルドにすべての機能が含まれています。

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/extended/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

#### モジュールを使用する場合

##### v2 の構文

単一のビルドのみを選択できます。

```js
import("viewport-extra")
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

モジュール指定子が `viewport-extra` のビルドが最小サイズであり、理想的です。

```js
import("viewport-extra")
```

ES2021 の構文、および Viewport Extra v3.0.0 公開時点における [Web Platform Baseline](https://web.dev/baseline?hl=ja) の Widely Available ステージにある機能をサポートしない環境で動作させる場合は、モジュール指定子に `es5` を含むビルドが必要です。

```js
import("viewport-extra/es5")
```

小数点以下の桁数指定機能を使用する場合は、モジュール指定子に `extended` を含むビルドが必要です。

```js
import("viewport-extra/extended")
```

ビルドの選択が難しい場合は、モジュール指定子が `viewport-extra/immediate/extended/es5` のビルドにすべての機能が含まれています。

```js
import("viewport-extra/immediate/extended/es5")
```

### 最小幅・最大幅適用 API

v2 では、最小幅・最大幅適用 API を 2 通り提供しています。一方の `setParameters()` 関数が v2.2 で追加されたあと、もう一方の `setContent()` 関数が破壊的変更を回避するために残されており、その分だけファイルサイズが大きくなっています。

v3 では、最小幅・最大幅適用 API として `apply()` 関数のみを提供しています。

#### スクリプトを使用する場合

##### v2 の構文

最小幅・最大幅の適用には、`setContent()` 関数もしくは `setParameters()` 関数を使用します。

```html
<script>
  ViewportExtra.setContent({ minWidth: 430 })
</script>
```

```html
<script>
  ViewportExtra.setParameters([{ content: { minWidth: 430 } }])
</script>
```

##### v3 の構文

最小幅・最大幅の適用には、`apply()` 関数を使用します。インターフェースは v2 の `setParameters()` 関数と変わりません。

```html
<script>
  ViewportExtra.apply([{ content: { minimumWidth: 430 } }])
</script>
```

#### モジュールを使用する場合

##### v2 の構文

最小幅・最大幅の適用には、`setContent()` 関数もしくは `setParameters()` 関数を使用します。

```js
import("viewport-extra").then(({ setContent }) => {
  setContent({ minWidth: 430 })
})
```

```js
import("viewport-extra").then(({ setParameters }) => {
  setParameters([{ content: { minWidth: 430 } }])
})
```

##### v3 の構文

最小幅・最大幅の適用には、`apply()` 関数を使用します。インターフェースは v2 の `setParameters()` 関数と変わりません。

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minimumWidth: 430 } }])
})
```

### 最小・最大を表す語句

v2 では、`min` / `max` という語句を、`meta` 要素の `(data-extra-)content` 属性 (例: `min-width`) と、最小幅・最大幅適用 API (例: `minWidth`) の両方で使用しています。しかし、[W3C の仕様](https://www.w3.org/TR/css-viewport-1/#meta-properties)において用いられる語句は `minimum` / `maximum` であり (例: `minimum-scale`) 、整合性を欠いています。

v3 では、`minimum` / `maximum` という語句を、`meta` 要素の `(data-extra-)content` 属性 (例: `minimum-width`) と、最小幅・最大幅適用 API (例: `minimumWidth`) の両方で使用しています。

#### スクリプトを使用する場合

##### v2 の構文

`<meta name="viewport">` 要素の `data-extra-content` 属性には、`min-width` / `max-width` というキーワードを使用します。

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430,max-width=640"
>
```

`<meta name="viewport-extra">` 要素の `content` 属性にも、`min-width` / `max-width` というキーワードを使用します。

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=430,max-width=640"
>
```

`setContent()` 関数および `setParameters()` 関数の引数には、`minWidth` / `maxWidth` というプロパティ名を使用します。

```html
<script>
  ViewportExtra.setContent({ minWidth: 430, maxWidth: 640 })
</script>
```

```html
<script>
  ViewportExtra.setParameters([{ content: { minWidth: 430, maxWidth: 640 } }])
</script>
```

##### v3 の構文

`<meta name="viewport">` 要素の `data-extra-content` 属性には、`minimum-width` / `maximum-width` というキーワードを使用します。

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="minimum-width=430,maximum-width=640"
>
```

`<meta name="viewport-extra">` 要素の `content` 属性にも、`minimum-width` / `maximum-width` というキーワードを使用します。

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,minimum-width=430,maximum-width=640"
>
```

`apply()` 関数の引数には、`minimumWidth` / `maximumWidth` というプロパティ名を使用します。

```html
<script>
  ViewportExtra.apply([{ content: { minimumWidth: 430, maximumWidth: 640 } }])
</script>
```

#### モジュールを使用する場合

##### v2 の構文

`setContent()` 関数および `setParameters()` 関数の引数には、`minWidth` / `maxWidth` というプロパティ名を使用します。

```js
import("viewport-extra").then(({ setContent }) => {
  setContent({ minWidth: 430, maxWidth: 640 })
})
```

```js
import("viewport-extra").then(({ setParameters }) => {
  setParameters([{ content: { minWidth: 430, maxWidth: 640 } }])
})
```

##### v3 の構文

`apply()` 関数の引数には、`minimumWidth` / `maximumWidth` というプロパティ名を使用します。

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minimumWidth: 430, maximumWidth: 640 } }])
})
```

### 最小幅・最大幅適用前のスケールリセット

最小幅・最大幅適用の計算に使用される幅は、スケールに応じて変動します。そのため、最小幅・最大幅適用前には、スケールをリセットしておく必要があります。

v2 では、自動的にスケールリセットする機能を、`meta` 要素の `data-(extra-)unscaled-computing` 属性、および最小幅・最大幅適用 API の引数の `unscaledComputing` プロパティとして提供しています。この機能は、v2.2 で追加されたあと、破壊的変更を回避するためにデフォルトでは無効となっています。あえて無効にしておきたいケースは存在せず、有効・無効を選択可能である分だけファイルサイズが大きくなっています。

v3 では、自動的にスケールリセットする機能をデフォルトで有効とし、無効化する方法を提供していません。

#### スクリプトを使用する場合

##### v2 の構文

`setContent()` 関数および `setParameters()` 関数を複数回呼び出しうる場合、`<meta name="viewport">` 要素には `data-extra-unscaled-computing` 属性が必要です。

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430"
  data-extra-unscaled-computing
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>

<script>
  window.addEventListener("awesome-event", () => {
    window.ViewportExtra?.setParameters([{ content: { minWidth: 430 } }]),
  })
</script>
```

`setContent()` 関数および `setParameters()` 関数を複数回呼び出しうる場合、`<meta name="viewport-extra">` 要素には `data-unscaled-computing` 属性が必要です。

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=430"
  data-unscaled-computing
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>

<script>
  window.addEventListener("awesome-event", () => {
    window.ViewportExtra?.setParameters([{ content: { minWidth: 430 } }]),
  })
</script>
```

##### v3 の構文

`apply()` 関数を複数回呼び出しうる場合であっても、特別に必要となる属性はありません。

<!-- x-release-please-start-version -->

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430"
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0"></script>

<script>
  window.addEventListener("awesome-event", () => {
    window.ViewportExtra?.apply([{ content: { minimumWidth: 430 } }]),
  })
</script>
```

<!-- x-release-please-end -->

#### モジュールを使用する場合

##### v2 の構文

`setParameters()` 関数を複数回呼び出しうる場合、引数の `unscaledComputing` プロパティを `true` に設定する必要があります。なお、`setContent()` 関数は引数に `unscaledComputing` プロパティを設定できないため、このケースでは使用できません。

```js
import("viewport-extra").then(({ setParameters }) => {
  window.addEventListener("awesome-event", () => {
    setParameters(
      [{ content: { minWidth: 430 } }],
      { unscaledComputing: true }
    )
  })
})
```

##### v3 の構文

`apply()` 関数を複数回呼び出しうる場合であっても、特別に必要となる引数のプロパティはありません。

```js
import("viewport-extra").then(({ apply }) => {
  window.addEventListener("awesome-event", () => {
    apply([{ content: { minimumWidth: 430 } }])
  })
})
```

### Viewport Extra 内部での最小幅・最大幅の保持

v2 では、適用した最小幅・最大幅を、Viewport Extra 内部に保持しています。これは、次回の最小幅・最大幅適用 API の呼び出しにおいて、引数のフォールバックとして使用されます。しかし、パッケージ内部での値の保持は、モジュールを使用する場合に [Dual Package Hazard](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_dual_package_hazard) を引き起こす恐れがあります。

v3 では、適用した最小幅・最大幅を、Viewport Extra 内部に保持せず、引数のフォールバックも行っていません。

#### スクリプトを使用する場合

##### v2 の構文

複数回の `setContent()` 関数および `setParameters()` 関数の呼び出しにおいて、最初に適用した最小幅・最大幅を繰り返し適用する場合、引数を省略することができます。

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-unscaled-computing
  data-extra-content="min-width=430"
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>

<script>
  window.addEventListener(
    "awesome-event",
    () => window.ViewportExtra?.setContent(), // minWidth として 430 が使用される
  )
</script>
```

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-unscaled-computing
  data-extra-content="min-width=430"
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>

<script>
  window.addEventListener(
    "awesome-event",
    () => window.ViewportExtra?.setParameters([]), // minWidth として 430 が使用される
  )
</script>
```

##### v3 の構文

複数回の `apply()` 関数の呼び出しにおいて、最初に適用した最小幅・最大幅を繰り返し適用する場合であっても、引数を省略することはできません。

<!-- x-release-please-start-version -->

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430"
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0"></script>

<script>
  window.addEventListener(
    "awesome-event",
    () => window.ViewportExtra?.apply([{ content: { minimumWidth: 430 } }]), // 引数を省略した場合 minimumWidth はデフォルトの 0 となる
  )
</script>
```

<!-- x-release-please-end -->

#### モジュールを使用する場合

##### v2 の構文

複数回の `setParameters()` 関数の呼び出しにおいて、最初に適用した最小幅・最大幅を繰り返し適用する場合は、引数を省略することができます。なお、`setContent()` 関数は引数に `unscaledComputing` プロパティを設定できないため、このケースでは使用できません。

```js
import("viewport-extra").then(({ setParameters }) => {
  setParameters([{ content: { minWidth: 430 } }], { unscaledComputing: true })
  window.addEventListener(
    "awesome-event",
    () => setParameters([]), // minWidth として 430 が使用される
  )
})
```

##### v3 の構文

複数回の `apply()` 関数の呼び出しにおいて、最初に適用した最小幅・最大幅を繰り返し適用する場合であっても、引数を省略することはできません。

```js
import("viewport-extra").then(({ apply }) => {
  const parameters = [{ content: { minWidth: 430 } }]
  apply(parameters)
  window.addEventListener(
    "awesome-event",
    () => apply(parameters), // 引数を省略した場合 minimumWidth はデフォルトの 0 となる
  )
})
```

### Viewport Extra 内部での `<meta name="viewport">` 要素の保持

v2 では、最小幅・最大幅適用の対象となった `<meta name="viewport">` 要素を、Viewport Extra 内部に保持しています。これは、次回の最小幅・最大幅適用においても、対象として使用されます。また、`<meta name="viewport">` 要素の置き換えが発生する場合には、新しい要素を保持しなおす必要があり、これを行う API として `updateReference()` を提供しています。しかし、パッケージ内部での値の保持は、モジュールを使用する場合に [Dual Package Hazard](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_dual_package_hazard) を引き起こす恐れがあります。

v3 では、最小幅・最大幅適用の対象となった `<meta name="viewport">` 要素を、Viewport Extra 内部に保持せず、`<meta name="viewport">` 要素を保持しなおす API も提供していません。

#### モジュールを使用する場合

##### v2 の構文

Next.js は、ページ遷移のたびに既存の `<meta name="viewport">` 要素を新しい `<meta name="viewport">` 要素で置き換えるため、`setContent()` 関数および `setParameters()` 関数の前に、`updateReference()` を呼び出す必要があります。

```jsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const ViewportExtra = () => {
  const pathname = usePathname()

  // ページ遷移のたびに実行される副作用
  useEffect(() => {
    import("viewport-extra").then(({ setContent, updateReference }) => {
      updateReference()
      setContent({ minWidth: 430 })
    })
  }, [pathname])

  return <></>
}

export default ViewportExtra
```

##### v3 の構文

Next.js は、ページ遷移のたびに既存の `<meta name="viewport">` 要素を新しい `<meta name="viewport">` 要素で置き換えますが、`apply()` 関数を呼び出す前に必要となる操作はありません。

```jsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const ViewportExtra = () => {
  const pathname = usePathname()

  // ページ遷移のたびに実行される副作用
  useEffect(() => {
    import("viewport-extra").then(({ apply }) => {
      apply([{ minWidth: 430 }])
    })
  }, [pathname])

  return <></>
}

export default ViewportExtra
```
