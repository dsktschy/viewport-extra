# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra) [![npm version](https://img.shields.io/npm/v/viewport-extra.svg?style=flat-square)](https://www.npmjs.com/package/viewport-extra) [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/dsktschy/viewport-extra/blob/master/LICENSE.txt)

**English** | [日本語](https://github.com/dsktschy/viewport-extra/blob/master/README.ja.md)

> [!IMPORTANT]
>
> **_v3 includes BREAKING CHANGES._**
>
> - Reference: [Migration Guide from v2 to v3](https://github.com/dsktschy/viewport-extra/blob/master/docs/en/migration-from-v2.md)
> - Reference: [Migration Guide from v1 to v3](https://github.com/dsktschy/viewport-extra/blob/master/docs/en/migration-from-v1.md)
>
> v2 and v1 will continue to be maintained and remain available for use.

Viewport Extra is a library that enables setting the minimum / maximum width of the viewport. It reduces the range of the viewport that needs to be considered when styling.

<!--
Display images on following pages with as much spacing as possible

- https://github.com/dsktschy/viewport-extra#readme
- https://github.com/dsktschy/viewport-extra/blob/master/README.md
- https://www.npmjs.com/package/viewport-extra#readme
- https://www.jsdelivr.com/package/npm/viewport-extra#tabRouteReadme
-->
<div align="center">
  <img
    src="https://raw.githubusercontent.com/dsktschy/viewport-extra-demo-images/refs/tags/v2.0.0-artifacts/scale-down-page-on-small-viewport-widths-en/before-applying.gif"
    alt="Before Viewport Extra"
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
    src="https://raw.githubusercontent.com/dsktschy/viewport-extra-demo-images/refs/tags/v2.0.0-artifacts/scale-down-page-on-small-viewport-widths-en/after-applying.gif"
    alt="After Viewport Extra"
  >
</div>

For example, when displaying a 412px-wide page on a mobile browser with a viewport width of 360px (e.g., Chrome on Galaxy S24 in portrait mode), horizontal scrolling occurs. This can be resolved by styling for viewport widths less than 412px, but it's a hassle. However, by using Viewport Extra to set the minimum viewport width to 412px, the page will be scaled down to fit perfectly within 360px, eliminating horizontal scrolling. This provides a simple solution with no styling required.

Page scaling is achieved by updating the `content` attribute of the `<meta name="viewport">` element.

Viewport Extra supports asynchronous loading via the `<script async>` element or the `import()` syntax, ensuring it does not interfere with other processes on the page. Additionally, Viewport Extra has no dependencies and its standard build is tiny, at less than 1KB (Brotli compressed).

## Use Cases

- [Scale Down Page on Small Viewport Widths](#scale-down-page-on-small-viewport-widths)
- [Scale Up Page on Large Viewport Widths](#scale-up-page-on-large-viewport-widths)
- [Set Different Minimum / Maximum Widths per Media Query](#set-different-minimum--maximum-widths-per-media-query)
- [Rescale Page When Viewport Width Changes](#rescale-page-when-viewport-width-changes)
- [Scale Page Even in Legacy Environments](#scale-page-even-in-legacy-environments)
- [Scale Page Without Using `<meta name="viewport-extra">` Element](#scale-page-without-using-meta-nameviewport-extra-element)

### Scale Down Page on Small Viewport Widths

Pages containing the following code are scaled down on mobile browsers with viewport widths less than 412px, but are not scaled down on other browsers. Whether to scale down is determined only once when the pages are displayed [(Reference)](#rescale-page-when-viewport-width-changes).

#### Implementation

##### Using Script

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="minimum-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### Using Module

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minimumWidth: 412 } }])
})
```

#### Results of Updating `content` Attribute of `<meta name="viewport">` Element

##### Chrome on Galaxy S24 in Portrait Mode (360px)

`initial-scale=0.8737864077669902,width=412`

##### Safari on iPhone 15 in Portrait Mode (393px)

`initial-scale=0.9538834951456311,width=412`

##### Chrome on Google Pixel 8 in Portrait Mode (412px)

`initial-scale=1,width=device-width`

##### Safari on iPhone 15 in Landscape Mode (734px)

`initial-scale=1,width=device-width`

##### Safari on iPad Pro 12.9" in Portrait Mode (1024px)

`initial-scale=1,width=device-width`

### Scale Up Page on Large Viewport Widths

Pages containing the following code are scaled up on mobile browsers with viewport widths greater than 393px, but are not scaled up on other browsers. Whether to scale up is determined only once when the pages are displayed [(Reference)](#rescale-page-when-viewport-width-changes).

#### Implementation

##### Using Script

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="maximum-width=393">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### Using Module

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { maximumWidth: 393 } }])
})
```

#### Results of Updating `content` Attribute of `<meta name="viewport">` Element

##### Chrome on Galaxy S24 in Portrait Mode (360px)

`initial-scale=1,width=device-width`

##### Safari on iPhone 15 in Portrait Mode (393px)

`initial-scale=1,width=device-width`

##### Chrome on Google Pixel 8 in Portrait Mode (412px)

`initial-scale=1.0483460559796438,width=393`

##### Safari on iPhone 15 in Landscape Mode (734px)

`initial-scale=1.8676844783715012,width=393`

##### Safari on iPad Pro 12.9" in Portrait Mode (1024px)

`initial-scale=2.6055979643765905,width=393`

### Set Different Minimum / Maximum Widths per Media Query

Pages containing the following code are scaled down on mobile browsers with viewport widths less than 412px or between 744px (inclusive) and 1024px (exclusive), but are not scaled down on other browsers. Whether to scale down is determined only once when the pages are displayed [(Reference)](#rescale-page-when-viewport-width-changes).

#### Implementation

##### Using Script

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="minimum-width=412">
<meta name="viewport-extra" content="minimum-width=1024" data-media="(min-width: 744px)">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### Using Module

```js
import("viewport-extra").then(({ apply }) => {
  apply([
    { content: { minimumWidth: 412 } },
    { content: { minimumWidth: 1024 }, media: "(min-width: 744px)" },
  ])
})
```

#### Results of Updating `content` Attribute of `<meta name="viewport">` Element

##### Chrome on Galaxy S24 in Portrait Mode (360px)

`initial-scale=0.8737864077669902,width=412`

##### Chrome on Google Pixel 8 in Portrait Mode (412px)

`initial-scale=1,width=device-width`

##### Safari on iPad mini 6th Gen in Portrait Mode (744px)

`initial-scale=0.7265625,width=1024`

##### Safari on iPad Pro 12.9" in Portrait Mode (1024px)

`initial-scale=1,width=device-width`

### Rescale Page When Viewport Width Changes

Pages containing the following code determine whether to scale up or down not only when displayed but also when the viewport width changes. This is useful in scenarios such as switching between portrait and landscape modes on mobile devices or screen splitting on tablets.

#### Implementation

##### Using Script

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">

<script
  async
  src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"
  id="viewport-extra-script"
></script>

<script>
  const updateViewportMetaEl = () => {
    // To prevent infinite resizing
    new ResizeObserver((_, observer) => {
      observer.unobserve(document.documentElement)
      window.addEventListener("resize", updateViewportMetaEl, { once: true })
    }).observe(document.documentElement)

    ViewportExtra.apply([
      { content: { minimumWidth: 412 } },
      { content: { minimumWidth: 744 }, media: "(min-width: 640px)" },
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

##### Using Module

```js
import("viewport-extra").then(({ apply }) => {
  const updateViewportMetaEl = () => {
    // To prevent infinite resizing
    new ResizeObserver((_, observer) => {
      observer.unobserve(document.documentElement)
      window.addEventListener("resize", updateViewportMetaEl, { once: true })
    }).observe(document.documentElement)

    apply([
      { content: { minimumWidth: 412 } },
      { content: { minimumWidth: 744 }, media: "(min-width: 640px)" },
    ])
  }
  updateViewportMetaEl()
})
```

#### Results of Updating `content` Attribute of `<meta name="viewport">` Element

##### Safari on iPhone 15 in Portrait Mode (393px)

`initial-scale=0.9538834951456311,width=412`

##### Safari on iPhone 15 in Landscape Mode (734px)

`initial-scale=0.9865591397849462,width=744`

### Scale Page Even in Legacy Environments

The standard build used above includes ES2021 syntax and features in the Widely Available stage of the [Web Platform Baseline](https://web.dev/baseline) as of the release of Viewport Extra v3.0.0. To ensure compatibility with environments that do not support these (e.g., iOS Safari < 16, Android Chrome < 108), the ES5 build can be used [(Reference)](https://github.com/dsktschy/viewport-extra/blob/master/docs/en/migration-from-v2.md#build-selection).

#### Implementation

##### Using Script

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="minimum-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### Using Module

```js
import("viewport-extra/immediate/es5").then(({ apply }) => {
  apply([{ content: { minimumWidth: 412 } }])
})
```

#### Results of Updating `content` Attribute of `<meta name="viewport">` Element

##### Safari on iPhone 7 in Portrait Mode (375px)

`initial-scale=0.9101941747572816,width=412`

##### Safari on iPhone 7 in Landscape Mode (667px)

`initial-scale=1,width=device-width`

### Scale Page Without Using `<meta name="viewport-extra">` Element

Pages containing the following code behave the same as the [implementation using the `<meta name="viewport-extra">` element](#using-script-2).

#### Implementation

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport" data-extra-content="minimum-width=412">
<meta name="viewport" data-extra-content="minimum-width=1024" data-extra-media="(min-width: 744px)">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

#### Results of Updating `content` Attribute of `<meta name="viewport">` Element

##### Chrome on Galaxy S24 in Portrait Mode (360px)

`initial-scale=0.8737864077669902,width=412`

##### Chrome on Google Pixel 8 in Portrait Mode (412px)

`initial-scale=1,width=device-width`

##### Safari on iPad mini 6th Gen in Portrait Mode (744px)

`initial-scale=0.7265625,width=1024`

##### Safari on iPad Pro 12.9" in Portrait Mode (1024px)

`initial-scale=1,width=device-width`

## Notes

- `min-width` / `max-width` can be used as alternatives to `minimum-width` / `maximum-width`. However, when both styles are mixed, behavior is not guaranteed, so only one style should be used.

  ```html
  <meta name="viewport-extra" content="min-width=412,max-width=640">
  ```

  Similarly, `minWidth` / `maxWidth` can be used as alternatives to `minimumWidth` / `maximumWidth`. As with the previous case, when both styles are mixed, behavior is not guaranteed, so only one style should be used.

  ```js
  apply([{ content: { minWidth: 412, maxWidth: 640 } }])
  ```

- Using the following style together is recommended to prevent browsers on small mobile devices from unexpectedly changing the text size [(Reference)](https://stackoverflow.com/q/6210788).

  ```css
  body {
    -webkit-text-size-adjust: 100%;
  }
  ```

- When testing with developer tools of desktop browsers, mobile device simulation must be enabled and the viewport must be set to the desired size before navigating to a page that uses Viewport Extra. If the order is reversed, the browser may ignore the `initial-scale` setting of the `<meta name="viewport">` element. This behavior is specific to simulation in developer tools and does not occur in actual mobile browsers.
