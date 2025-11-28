# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra) [![npm version](https://img.shields.io/npm/v/viewport-extra.svg?style=flat-square)](https://www.npmjs.com/package/viewport-extra) [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/dsktschy/viewport-extra/blob/master/LICENSE.txt)

**English** | [日本語](https://github.com/dsktschy/viewport-extra/blob/2.x/README.ja.md)

Viewport Extra is a library that enables setting the minimum / maximum width of the viewport. It reduces the range of the viewport that needs to be considered when styling.

<!--
Display images on following pages with as much spacing as possible

- https://github.com/dsktschy/viewport-extra/tree/2.x#readme
- https://github.com/dsktschy/viewport-extra/blob/2.x/README.md
- https://www.npmjs.com/package/viewport-extra/v/2.5.1-rc.0#readme # x-release-please-version
- https://www.jsdelivr.com/package/npm/viewport-extra?version=2.5.1-rc.0#tabRouteReadme # x-release-please-version
-->
<div align="center">
  <img
    src="https://raw.githubusercontent.com/dsktschy/viewport-extra-demo-images/refs/tags/v2.0.0-artifacts/scale-down-page-on-small-viewport-widths-en/before-applying.gif"
    alt="Before Viewport Extra"
  >
  <picture>
    <source
      srcset="https://raw.githubusercontent.com/dsktschy/viewport-extra/2.x/docs/images/spacer-100x0.svg"
      media="(min-width: 1054px)"
    >
    <source
      srcset="https://raw.githubusercontent.com/dsktschy/viewport-extra/2.x/docs/images/spacer-0x0.svg"
      media="(min-width: 768px)"
    >
    <source
      srcset="https://raw.githubusercontent.com/dsktschy/viewport-extra/2.x/docs/images/spacer-100x0.svg"
      media="(min-width: 702px)"
    >
    <img
      src="https://raw.githubusercontent.com/dsktschy/viewport-extra/2.x/docs/images/spacer-0x0.svg"
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

## Use Cases

- [Scale Down Page on Small Viewport Widths](#scale-down-page-on-small-viewport-widths)
- [Scale Up Page on Large Viewport Widths](#scale-up-page-on-large-viewport-widths)
- [Set Different Minimum / Maximum Widths per Media Query](#set-different-minimum--maximum-widths-per-media-query)
- [Rescale Page When Viewport Width Changes](#rescale-page-when-viewport-width-changes)

### Scale Down Page on Small Viewport Widths

Pages containing the following code are scaled down on mobile browsers with viewport widths less than 412px, but are not scaled down on other browsers. Whether to scale down is determined only once when the pages are displayed [(Reference)](#rescale-page-when-viewport-width-changes).

#### Implementation

##### Using Script

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="min-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.1-rc.0/dist/iife/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### Using Module

```js
import("viewport-extra").then(({ setContent }) => {
  setContent({ minWidth: 412 })
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
<meta name="viewport-extra" content="max-width=393">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.1-rc.0/dist/iife/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### Using Module

```js
import("viewport-extra").then(({ setContent }) => {
  setContent({ maxWidth: 393 })
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
<meta name="viewport-extra" content="min-width=412">
<meta name="viewport-extra" content="min-width=1024" data-media="(min-width: 744px)">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.1-rc.0/dist/iife/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

##### Using Module

```js
import("viewport-extra").then(({ setParameters }) => {
  setParameters([
    { content: { minWidth: 412 } },
    { content: { minWidth: 1024 }, media: "(min-width: 744px)" },
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
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-unscaled-computing
>

<script
  async
  src="https://cdn.jsdelivr.net/npm/viewport-extra@2.5.1-rc.0/dist/iife/viewport-extra.min.js"
  id="viewport-extra-script"
></script>

<script>
  const updateViewportMetaEl = () => {
    // To prevent infinite resizing
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

##### Using Module

```js
import("viewport-extra").then(({ setParameters }) => {
  const updateViewportMetaEl = () => {
    // To prevent infinite resizing
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

#### Results of Updating `content` Attribute of `<meta name="viewport">` Element

##### Safari on iPhone 15 in Portrait Mode (393px)

`initial-scale=0.9538834951456311,width=412`

##### Safari on iPhone 15 in Landscape Mode (734px)

`initial-scale=0.9865591397849462,width=744`

## How to Handle v3

**English** | [日本語](https://github.com/dsktschy/viewport-extra/blob/2.x/README.ja.md#v3-への対応方法)

v3 includes breaking changes. To handle this, continuation of using v2 and v1 or migration to v3 are available.

### Continue Using v2 and v1

v2 and v1 will continue to be maintained and remain available for use even after the release of v3.

#### Suppress Console Message

In v2.5, during the period before and after the release of v3, a message about v3 is displayed in the web browser console. The following code can suppress the message.

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-no-migration-message
>
```

### Migrate to v3

Migration to v3 is possible with reference to the guides.

- Reference: [Migration Guide from v2 to v3](https://github.com/dsktschy/viewport-extra/blob/master/docs/en/migration-from-v2.md)
- Reference: [Migration Guide from v1 to v3](https://github.com/dsktschy/viewport-extra/blob/master/docs/en/migration-from-v1.md)

## Notes

- Using the following style together is recommended to prevent browsers on small mobile devices from unexpectedly changing the text size [(Reference)](https://stackoverflow.com/q/6210788).

  ```css
  body {
    -webkit-text-size-adjust: 100%;
  }
  ```

- When testing with developer tools of desktop browsers, mobile device simulation must be enabled and the viewport must be set to the desired size before navigating to a page that uses Viewport Extra. If the order is reversed, the browser may ignore the `initial-scale` setting of the `<meta name="viewport">` element. This behavior is specific to simulation in developer tools and does not occur in actual mobile browsers.
