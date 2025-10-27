# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra) [![npm version](https://img.shields.io/npm/v/viewport-extra.svg?style=flat-square)](https://www.npmjs.com/package/viewport-extra) [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/dsktschy/viewport-extra/blob/master/LICENSE.txt)

[English](/README.md) | **日本語**

> [!IMPORTANT]
>
> **_次期メジャーバージョン v3 には、破壊的変更が含まれます。_**
>
> 詳細: [次期メジャーバージョンへの対応方法](#次期メジャーバージョンへの対応方法)

Viewport Extra は、ビューポートの最小幅および最大幅の設定を可能にするライブラリです。これにより、スタイリング時に考慮すべきビューポートの範囲を狭めることができます。

<!--
Display images on following pages with as much spacing as possible

- https://github.com/dsktschy/viewport-extra/blob/master/README.ja.md
-->
<div align="center">
  <img
    src="https://raw.githubusercontent.com/dsktschy/viewport-extra-demo-images/refs/tags/v1.0.0-artifacts/before-applied.ja.gif"
    alt="Viewport Extra 適用前"
  >
  <picture>
    <source
      srcset="https://raw.githubusercontent.com/dsktschy/viewport-extra/master/docs/images/spacer-100x0.svg"
      media="(min-width: 1054px)"
    >
    <source
      srcset="https://raw.githubusercontent.com/dsktschy/viewport-extra/master/docs/images/spacer-0x0.svg"
      media="(min-width: 768px)"
    >
    <source
      srcset="https://raw.githubusercontent.com/dsktschy/viewport-extra/master/docs/images/spacer-100x0.svg"
      media="(min-width: 702px)"
    >
    <img
      src="https://raw.githubusercontent.com/dsktschy/viewport-extra/master/docs/images/spacer-0x0.svg"
      alt=""
    >
  </picture>
  <img
    src="https://raw.githubusercontent.com/dsktschy/viewport-extra-demo-images/refs/tags/v1.0.0-artifacts/after-applied.ja.gif"
    alt="Viewport Extra 適用後"
  >
</div>

たとえば、幅 412px のページを、ビューポート幅 360px のモバイル向けブラウザ (例: 縦向きの Galaxy S24 上の Chrome) で表示すると、横方向のスクロールが発生してしまいます。これは、412px 未満のビューポート幅のためにスタイルを追加することで解決できますが、その作業は面倒です。しかし、Viewport Extra でビューポートの最小幅を 412px に設定すれば、そのページは 360px にぴったり収まるように縮小され、横方向のスクロールが発生しません。スタイルを追加することなく、簡単に解決できます。

ページの拡大・縮小は、`<meta name="viewport">` 要素の `content` 属性の書き換えにより行われます。

## ユースケース

- [小さなビューポート幅でページを縮小する](#小さなビューポート幅でページを縮小する)
- [大きなビューポート幅でページを拡大する](#大きなビューポート幅でページを拡大する)
- [メディアクエリごとに異なる最小幅・最大幅を設定する](#メディアクエリごとに異なる最小幅最大幅を設定する)
- [ビューポート幅が変わるときにもページを拡大・縮小する](#ビューポート幅が変わるときにもページを拡大縮小する)

### 小さなビューポート幅でページを縮小する

次のコードを含むページは、ビューポート幅が 412px 未満のモバイル向けブラウザでは縮小され、それ以外のブラウザでは縮小されません。縮小すべきかどうかの判定は、ページが表示されるときに一度だけ行われます [(参考)](#ビューポート幅が変わるときにもページを拡大縮小する) 。

#### 実装

##### スクリプトを使用する場合

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="min-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.0/dist/iife/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### モジュールを使用する場合

```js
import("viewport-extra").then(({ setContent }) => {
  setContent({ minWidth: 412 })
})
```

#### `<meta name="viewport">` 要素の `content` 属性の書き換え結果

##### Galaxy S24 縦向き Chrome (360px)

`initial-scale=0.8737864077669902,width=412`

##### iPhone 15 縦向き Safari (393px)

`initial-scale=0.9538834951456311,width=412`

##### Google Pixel 8 縦向き Chrome (412px)

`initial-scale=1,width=device-width`

##### iPhone 15 横向き Safari (734px)

`initial-scale=1,width=device-width`

##### iPad Pro 12.9" 縦向き Safari (1024px)

`initial-scale=1,width=device-width`

### 大きなビューポート幅でページを拡大する

次のコードを含むページは、ビューポート幅が 393px を超えるモバイル向けブラウザでは拡大され、それ以外のブラウザでは拡大されません。拡大すべきかどうかの判定は、ページが表示されるときに一度だけ行われます [(参考)](#ビューポート幅が変わるときにもページを拡大縮小する) 。

#### 実装

##### スクリプトを使用する場合

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="max-width=393">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.0/dist/iife/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### モジュールを使用する場合

```js
import("viewport-extra").then(({ setContent }) => {
  setContent({ maxWidth: 393 })
})
```

#### `<meta name="viewport">` 要素の `content` 属性の書き換え結果

##### Galaxy S24 縦向き Chrome (360px)

`initial-scale=1,width=device-width`

##### iPhone 15 縦向き Safari (393px)

`initial-scale=1,width=device-width`

##### Google Pixel 8 縦向き Chrome (412px)

`initial-scale=1.0483460559796438,width=393`

##### iPhone 15 横向き Safari (734px)

`initial-scale=1.8676844783715012,width=393`

##### iPad Pro 12.9" 縦向き Safari (1024px)

`initial-scale=2.6055979643765905,width=393`

### メディアクエリごとに異なる最小幅・最大幅を設定する

次のコードを含むページは、ビューポート幅が 412px 未満または 744px 以上 1024px 未満のモバイル向けブラウザでは縮小され、それ以外のブラウザでは縮小されません。縮小すべきかどうかの判定は、ページが表示されるときに一度だけ行われます [(参考)](#ビューポート幅が変わるときにもページを拡大縮小する) 。

#### 実装

##### スクリプトを使用する場合

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="min-width=412">
<meta name="viewport-extra" content="min-width=1024" data-media="(min-width: 744px)">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.0/dist/iife/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### モジュールを使用する場合

```js
import("viewport-extra").then(({ setParameters }) => {
  setParameters([
    { content: { minWidth: 412 } },
    { content: { minWidth: 1024 }, media: "(min-width: 744px)" },
  ])
})
```

#### `<meta name="viewport">` 要素の `content` 属性の書き換え結果

##### Galaxy S24 縦向き Chrome (360px)

`initial-scale=0.8737864077669902,width=412`

##### Google Pixel 8 縦向き Chrome (412px)

`initial-scale=1,width=device-width`

##### iPad mini 第6世代 縦向き Safari (744px)

`initial-scale=0.7265625,width=1024`

##### iPad Pro 12.9" 縦向き Safari (1024px)

`initial-scale=1,width=device-width`

### ビューポート幅が変わるときにもページを拡大・縮小する

次のコードを含むページは、表示されるときだけでなく、ビューポート幅が変わるときにも拡大・縮小すべきかどうかの判定を行います。モバイル端末の縦向き・横向きの切り替えや、タブレットの画面分割が想定される場合に有用です。

#### 実装

##### スクリプトを使用する場合

<!-- x-release-please-start-version -->

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-unscaled-computing
>

<script
  async
  src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.0/dist/iife/viewport-extra.min.js"
  id="viewport-extra-script"
></script>

<script>
  const updateViewportMetaEl = () => {
    // 無限リサイズを回避する
    new ResizeObserver((_, observer) => {
      observer.unobserve(document.documentElement)
      window.addEventListener("resize", updateViewportMetaEl, { once: true })
    }).observe(document.documentElement)

    ViewportExtra.setParameters([
      { content: { minWidth: 412 } },
      { content: { minWidth: 744 }, media: "(min-width: 640px)" },
    ])
  }
  if (window.ViewportExtra) {
    updateViewportMetaEl()
  } else {
    document
      .getElementById("viewport-extra-script")
      .addEventListener("load", updateViewportMetaEl)
  }
</script>
```

<!-- x-release-please-end -->

##### モジュールを使用する場合

```js
import("viewport-extra").then(({ setParameters }) => {
  const updateViewportMetaEl = () => {
    // 無限リサイズを回避する
    new ResizeObserver((_, observer) => {
      observer.unobserve(document.documentElement)
      window.addEventListener("resize", updateViewportMetaEl, { once: true })
    }).observe(document.documentElement)

    setParameters([
      { content: { minWidth: 412 } },
      { content: { minWidth: 744 }, media: "(min-width: 640px)" },
    ])
  }
  updateViewportMetaEl()
})
```

#### `<meta name="viewport">` 要素の `content` 属性の書き換え結果

##### iPhone 15 縦向き Safari (393px)

`initial-scale=0.9538834951456311,width=412`

##### iPhone 15 横向き Safari (734px)

`initial-scale=0.9865591397849462,width=744`

## 次期メジャーバージョンへの対応方法

[English](/README.md#how-to-handle-the-upcoming-major-version) | **日本語**

破壊的変更を含む次期メジャーバージョン v3 の公開が予定されています。対応方法として、v2 および v1 の使用継続、または v3 リリース候補版 (RC) への移行を選択できます。

### v2 および v1 の使用を継続する

v2 および v1 は、v3 の公開後もメンテナンスが継続されるため、引き続き使用できます。

#### コンソールのメッセージを抑制する

v2.5 では、v3 公開前後の期間、Web ブラウザのコンソールに v3 に関するメッセージが表示されます。次のコードを使用して、メッセージを抑制できます。

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-no-migration-message
>
```

### v3 リリース候補版 (RC) へ移行する

v3 安定版に先行して、[v3 リリース候補版 (RC)](https://github.com/dsktschy/viewport-extra/releases/tag/v3.0.0-rc.3) と、v3 への移行ガイドを公開しています。

- 参考: [v2 から v3 への移行ガイド](https://github.com/dsktschy/viewport-extra/blob/v3.0.0-rc.3/docs/ja/migration-from-v2.md)
- 参考: [v1 から v3 への移行ガイド](https://github.com/dsktschy/viewport-extra/blob/v3.0.0-rc.3/docs/ja/migration-from-v1.md)

リリース候補版 (RC) には、v3.0.0-rc.2 以降、安定版公開まで破壊的変更の予定がないため、これを使用して v3 へ移行できます。

## 補足

- 次のスタイルを併用することを推奨します。小さなモバイル端末における、ブラウザによる意図しないテキストサイズの調整を防ぎます [(参考)](https://stackoverflow.com/q/6210788) 。

  ```css
  body {
    -webkit-text-size-adjust: 100%;
  }
  ```

- デスクトップ向けブラウザの開発者ツールで動作を確認する場合、Viewport Extra を使用するページへ移動するよりも先に、モバイル端末のシミュレーションを有効化し、ビューポートを目的のサイズに設定しておく必要があります。順番が逆である場合、ブラウザが `<meta name="viewport">` 要素の `initial-scale` の設定を無視してしまう状態となります。これは、開発者ツールのシミュレーションに特有の現象であり、実際のモバイル向けブラウザでは発生しません。
