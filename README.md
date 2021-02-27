# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra) [![npm version](https://img.shields.io/npm/v/viewport-extra.svg?style=flat-square)](https://www.npmjs.com/package/viewport-extra) [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/dsktschy/viewport-extra/blob/master/LICENSE.txt)

Viewport Extra enables to set min-width and max-width of viewport, by overriding the content attribute of the viewport meta element. It will reduce the range of viewport that have to be considered when styling.

For example, on devices with a display width of less than 375px (e.g. iPhone SE 1st Gen), if a page with a width of 375px or more is displayed, there will usually be horizontal scrolling. In such a case, you can set the min-width of viewport to 375px with Viewport Extra, which will scale the page down to fit perfectly into the 375px display width and remove horizontal scrolling.

## Quick Start

### CDN

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=375"
/>
<script
  src="https://cdn.jsdelivr.net/npm/viewport-extra@2.0.1/dist/iife/viewport-extra.min.js"
  async
></script>
```

### npm

```bash
npm i viewport-extra
```

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=375"
/>
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

The page will be scaled down on screens that display as width of less than 375px. No operations will be run on screens that display as width of 375px or more. This setting will output the following viewport meta elements.

On iPhone 5(s) / iPhone SE(1st Gen) in portrait mode  
`<meta name="viewport" content="width=375,initial-scale=0.8533333333333334" />`

On Galaxy S20 in portrait mode  
`<meta name="viewport" content="width=375,initial-scale=0.96" />`

On iPhone >= 6 / iPhone SE(2nd Gen) / Galaxy S20 Ultra / tablets, in portrait mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

### Scale up on screens > 320px wide

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,max-width=320"
/>
```

The page will be scaled up on screens that display as width of more than 320px. No operations will be run on screens that display as width of 320px or less. This setting will output the following viewport meta elements.

On iPhone 5(s) / iPhone SE(1st Gen) in portrait mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

On Galaxy S20 in portrait mode  
`<meta name="viewport" content="width=320,initial-scale=1.125" />`

On iPhone 12 Pro Max in portrait mode  
`<meta name="viewport" content="width=320,initial-scale=1.3375" />`

### Scale down on mobile phone screens < 375px wide, and on tablet screens < 1280px wide

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
```

```js
import { setContent } from 'viewport-extra'

/* Define `isMobilePhone` variable to detect mobile phone here */

setContent({ minWidth: isMobilePhone ? 375 : 1280 })
```

The page will be scaled down on mobile phone screens that display as width of less than 375px, and on tablet screens that display as width of less than 1280px. No operations will be run on mobile phone screens that display as width of 375px or more, and on tablet screens that display as width of 1280px or more. This setting will output the following viewport meta elements.

On iPhone 5(s) / iPhone SE(1st Gen) in portrait mode  
`<meta name="viewport" content="width=375,initial-scale=0.8533333333333334" />`

On iPhone >= 6 / iPhone SE(2nd Gen) / Galaxy S20 Ultra, in portrait mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

On iPad Pro 12.9" in portrait mode  
`<meta name="viewport" content="width=1280,initial-scale=0.8" />`

On iPad Pro 12.9" in landscape mode  
`<meta name="viewport" content="width=device-width,initial-scale=1" />`

### Re-scale when some event occurs

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=375"
/>
```

```js
import { setContent } from 'viewport-extra'

window.addEventListener('click', () => {
  setContent({ minWidth: 375 })
})
```

The page will be scale according to viewport size when clicked.

Note: If you want to re-scale when switching between portrait and landscape modes, you need to run `setContent` at a time when you can be sure of getting the viewport size after the switch. However, it seems that such timing has not yet been discovered. [https://stackoverflow.com/questions/12452349](https://stackoverflow.com/questions/12452349)

## Various usages

### Viewport extra meta element and CDN

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=375,max-width=414"
/>
<script
  src="https://cdn.jsdelivr.net/npm/viewport-extra@2.0.1/dist/iife/viewport-extra.min.js"
  async
></script>
```

Note: Don't forget async attribute of script element not to block rendering.

### Viewport extra meta element and npm

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=375,max-width=414"
/>
```

```js
import 'viewport-extra'
```

### Viewport meta element and CDN

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=375,max-width=414"
/>
<script
  src="https://cdn.jsdelivr.net/npm/viewport-extra@2.0.1/dist/iife/viewport-extra.min.js"
  async
></script>
```

Note: Don't forget async attribute of script element not to block rendering.

### Viewport meta element and npm

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=375,max-width=414"
/>
```

```js
import 'viewport-extra'
```

### Programmatic usage

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
```

```js
import { setContent } from 'viewport-extra'
setContent({ minWidth: 375, maxWidth: 414 })
```

### [Deprecated] Same usage as v1 using CDN

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
<script src="https://cdn.jsdelivr.net/npm/viewport-extra@2.0.1/dist/iife/viewport-extra.min.js"></script>
<script>
  // Shorthand if maxWidth is not required
  new ViewportExtra(375)
</script>
```

Note: Don't set async attribute of script element so that ViewportExtra object does not become undefined.

### [Deprecated] Same usage as v1 using npm

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
```

```js
import ViewportExtra from 'viewport-extra'
// Shorthand if maxWidth is not required
new ViewportExtra(375)
```

## Note

- Viewport Extra supports only clients that support the viewport meta element. Note that the viewport meta element is only supported by mobile browsers.

- Unless you write code for it, Viewport Extra will not re-scale when switching between portrait and landscape modes. [Re-scale when some event occurs](#re-scale-when-some-event-occurs)

- If worried about the delay in applying, use CDN with script element has async attribute.

- Viewport Extra v2 does not support AMD. If it is needed use v1.
