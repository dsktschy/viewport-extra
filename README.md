# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra) [![npm version](https://img.shields.io/npm/v/viewport-extra.svg?style=flat-square)](https://www.npmjs.com/package/viewport-extra) [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/dsktschy/viewport-extra/blob/master/LICENSE.txt)

Viewport Extra enables to set min-width and max-width of viewport, by overriding the content attribute of the viewport meta element. It will reduce the range of viewport that have to be considered when styling.

For example, in browsers on mobile devices with a display width less than 375px (e.g. iPhone SE 1st Gen), if a page with width of 375px or more is displayed, there will usually be horizontal scrolling. In such a case, you can set the min-width of viewport to 375px with Viewport Extra, which will scale the page down to fit perfectly into the 375px display width and remove horizontal scrolling.

## Getting Started

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=375"
/>
```

### CDN

<!-- x-release-please-start-version -->

```html
<script
  src="https://cdn.jsdelivr.net/npm/viewport-extra@2.2.0-rc.0/dist/iife/viewport-extra.min.js"
  async
></script>
```

<!-- x-release-please-end-version -->

### Package Managers

```sh
$ npm install viewport-extra
```

```js
import 'viewport-extra'
```

## Recipes

### Scale down on screens < 375px wide

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=375"
/>
```

The page will be scaled down in browsers on mobile devices that display as width less than 375px. No operations will be run in browsers on mobile devices that display as width of 375px or more. This setting will output the following viewport meta elements.

On iPhone SE 1st Gen in portrait mode  
`<meta name="viewport" content="width=375,initial-scale=0.8533333333333334" />`

On Galaxy S22 in portrait mode  
`<meta name="viewport" content="width=375,initial-scale=0.96" />`

On Galaxy S22 Ultra / iPhone 15 / iPad Pro 12.9", in portrait mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

### Scale up on screens > 320px wide

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,max-width=320"
/>
```

The page will be scaled up in browsers on mobile devices that display as width greater than 320px. No operations will be run in browsers on mobile devices that display as width of 320px or less. This setting will output the following viewport meta elements.

On iPhone SE 1st Gen in portrait mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

On Galaxy S22 in portrait mode  
`<meta name="viewport" content="width=320,initial-scale=1.125" />`

On Galaxy S22 Ultra in portrait mode  
`<meta name="viewport" content="width=320,initial-scale=1.2" />`

On iPhone 15 in portrait mode  
`<meta name="viewport" content="width=320,initial-scale=1.228125" />`

On iPad Pro 12.9" in portrait mode  
`<meta name="viewport" content="width=320,initial-scale=3.2" />`

### Scale down on mobile phone screens < 375px wide, and on tablet screens < 1024px wide

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
```

```js
import { setContent } from 'viewport-extra'

/* Define `isMobilePhone` variable to detect mobile phone here */

setContent({ minWidth: isMobilePhone ? 375 : 1024 })
```

The page will be scaled down in browsers on mobile phones that display as width less than 375px, and in browsers on tablets that display as width less than 1024px. No operations will be run in browsers on mobile phones that display as width of 375px or more, and in browsers on tablets that display as width of 1024px or more. This setting will output the following viewport meta elements.

On iPhone SE 1st Gen in portrait mode  
`<meta name="viewport" content="width=375,initial-scale=0.8533333333333334" />`

On Galaxy S22 Ultra / iPhone 15, in portrait mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

On iPad mini 5th Gen in portrait mode  
`<meta name="viewport" content="width=1024,initial-scale=0.75" />`

On iPad Pro 12.9" in portrait mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

## Various Usages

See also [examples](https://github.com/dsktschy/viewport-extra/tree/master/examples).

### Only `meta[name="viewport"]` element

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=375,max-width=414"
/>
```

### `meta[name="viewport"]` and `meta[name="viewport-extra"]` elements

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="viewport-extra" content="min-width=375,max-width=414" />
```

### [Deprecated] Same usage as v1

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
<script src="https://cdn.jsdelivr.net/npm/viewport-extra@2.2.0-rc.0/dist/iife/viewport-extra.min.js"></script>
<script>
  // Shorthand if maxWidth is not required
  new ViewportExtra(375)
</script>
```

<!-- x-release-please-end-version -->

## Notes

- The viewport meta element has effect only in browsers on mobile devices.

- Viewport Extra will not rescale when switching between portrait and landscape modes. If needed, use `setContent()` as an event handler. See also [Stack Overflow](https://stackoverflow.com/questions/12452349).

- For devices with small display widths, it is recommended to set the following style:

  ```css
  body {
    -webkit-text-size-adjust: 100%;
  }
  ```

  It prevents unintended text size adjustments by browsers. See also [the issue](https://github.com/dsktschy/viewport-extra/issues/17).

- Viewport Extra v2 does not support AMD. If it is needed use v1.
