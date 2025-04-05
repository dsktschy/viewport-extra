# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra) [![npm version](https://img.shields.io/npm/v/viewport-extra.svg?style=flat-square)](https://www.npmjs.com/package/viewport-extra) [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/dsktschy/viewport-extra/blob/master/LICENSE.txt)

Viewport Extra enables setting the minimum and maximum width of the viewport, by overriding the content attribute of the viewport meta element. It will reduce the range of the viewport that needs to be considered when styling.

For example, if a page with a width of 430px is displayed in mobile device browsers that display a width of 360px (e.g. Galaxy S24 in portrait mode), horizontal scrolling will typically occur. Therefore, styling for media less than 430px is needed. However, by setting the minimum width of the viewport for the page to 430px with Viewport Extra, the page will be scaled down to fit perfectly into a width of 360px and horizontal scrolling will not occur. As a result, styling for media less than 430px is not needed.

## Recipes

It is recommended to use a script element with the async attribute or the dynamic import.

### Scale down on small mobile devices

The following codes will scale the page down in mobile device browsers that display a width less than 430px, and will do nothing in mobile device browsers that display a width of 430px or greater. Scaling occurs only once when the page is displayed. See also ["Rescale when device orientation changes"](#Rescale-when-device-orientation-changes).

#### Using script

<!-- x-release-please-start-version -->
<!-- prettier-ignore-start -->

```html
<meta name="viewport-extra" content="min-width=430" />

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>
```

<!-- prettier-ignore-end -->
<!-- x-release-please-end-version -->

#### Using module

<!-- prettier-ignore-start -->

```ts
import('viewport-extra').then(({ setContent }) => {
  setContent({ minWidth: 430 })
})
```

<!-- prettier-ignore-end -->

#### Results

##### On Galaxy S24 in portrait mode (360px)

`<meta name="viewport" content="initial-scale=0.8372093023255814,width=430" />`

##### On iPhone 15 in portrait mode (393px)

`<meta name="viewport" content="initial-scale=0.913953488372093,width=430" />`

##### On iPhone 15 Pro Max in portrait mode (430px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

##### On iPhone 15 in landscape mode (734px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

##### On iPad Pro 12.9" in portrait mode (1024px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

### Scale up on large mobile devices

The following codes will scale the page up in mobile device browsers that display a width greater than 393px, and will do nothing in mobile device browsers that display a width of 393px or less. Scaling occurs only once when the page is displayed. See also ["Rescale when device orientation changes"](#Rescale-when-device-orientation-changes).

#### Using script

<!-- x-release-please-start-version -->
<!-- prettier-ignore-start -->

```html
<meta name="viewport-extra" content="max-width=393" />

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>
```

<!-- prettier-ignore-end -->
<!-- x-release-please-end-version -->

#### Using module

<!-- prettier-ignore-start -->

```ts
import('viewport-extra').then(({ setContent }) => {
  setContent({ maxWidth: 393 })
})
```

<!-- prettier-ignore-end -->

#### Results

##### On Galaxy S24 in portrait mode (360px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

##### On iPhone 15 in portrait mode (393px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

##### On iPhone 15 Pro Max in portrait mode (430px)

`<meta name="viewport" content="initial-scale=1.094147582697201,width=393" />`

##### On iPhone 15 in landscape mode (734px)

`<meta name="viewport" content="initial-scale=1.8676844783715012,width=393" />`

##### On iPad Pro 12.9" in portrait mode (1024px)

`<meta name="viewport" content="initial-scale=2.6055979643765905,width=393" />`

### Scale differently for each media query

The following codes will scale the page down in mobile device browsers that display a width less than 430px or between 744px and 1023px, and will do nothing in mobile device browsers that display a width between 430px and 743px or 1024px and above. Scaling occurs only once when the page is displayed. See also ["Rescale when device orientation changes"](#Rescale-when-device-orientation-changes).

#### Using script

<!-- x-release-please-start-version -->
<!-- prettier-ignore-start -->

```html
<meta name="viewport-extra" content="min-width=430" />
<meta name="viewport-extra" content="min-width=1024" data-media="(min-width: 744px)" />

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>
```

<!-- prettier-ignore-end -->
<!-- x-release-please-end-version -->

#### Using module

<!-- prettier-ignore-start -->

```js
import('viewport-extra').then(({ setParameters }) => {
  setParameters([
    { content: { minWidth: 430 } },
    { content: { minWidth: 1024 }, media: '(min-width: 744px)' }
  ])
})
```

<!-- prettier-ignore-end -->

#### Results

##### On Galaxy S24 in portrait mode (360px)

`<meta name="viewport" content="initial-scale=0.8372093023255814,width=430" />`

##### On iPhone 15 Pro Max in portrait mode (430px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

##### On iPad mini 6th Gen in portrait mode (744px)

`<meta name="viewport" content="initial-scale=0.7265625,width=1024" />`

##### On iPad Pro 12.9" in portrait mode (1024px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

### Rescale when device orientation changes

The following codes will scale the page not only when it is displayed, but also each time the mobile devices switch between portrait and landscape mode.

#### Using script

<!-- x-release-please-start-version -->
<!-- prettier-ignore-start -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1" data-extra-unscaled-computing />
<meta name="viewport-extra" content="min-width=430" />
<meta name="viewport-extra" content="min-width=744" data-media="(min-width: 640px)" />

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>

<script>
  const handleOrientationChange = () => {
    if (!ViewportExtra) return
    window.addEventListener(
      'resize',
      () => ViewportExtra.setParameters([]),
      { once: true }
    )
  }
  if (screen && screen.orientation) {
    screen.orientation.addEventListener('change', handleOrientationChange)
  } else {
    window.addEventListener('orientationchange', handleOrientationChange)
  }
</script>
```

<!-- prettier-ignore-end -->
<!-- x-release-please-end-version -->

#### Using module

<!-- prettier-ignore-start -->

```js
import('viewport-extra').then(({ setParameters }) => {
  setParameters(
    [
      { content: { minWidth: 430 } },
      { content: { minWidth: 744 }, media: '(min-width: 640px)' }
    ],
    { unscaledComputing: true }
  )

  const handleOrientationChange = () => {
    window.addEventListener(
      'resize',
      () => setParameters([]),
      { once: true }
    )
  }
  if (screen && screen.orientation) {
    screen.orientation.addEventListener('change', handleOrientationChange)
  } else {
    window.addEventListener('orientationchange', handleOrientationChange)
  }
})
```

<!-- prettier-ignore-end -->

#### Results

##### On iPhone 15 in portrait mode (393px)

`<meta name="viewport" content="initial-scale=0.913953488372093,width=430" />`

##### On iPhone 15 in landscape mode (734px)

`<meta name="viewport" content="initial-scale=0.9865591397849462,width=744 />`

### Specify the number of decimal places

The following codes will truncate numbers in the content attribute of the viewport meta element to 6 decimal places.

#### Using script

<!-- x-release-please-start-version -->
<!-- prettier-ignore-start -->

```html
<meta name="viewport-extra" content="min-width=430" data-decimal-places="6" />

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>
```

<!-- prettier-ignore-end -->
<!-- x-release-please-end-version -->

#### Using module

<!-- prettier-ignore-start -->

```ts
import('viewport-extra').then(({ setParameters }) => {
  setParameters(
    [
      { content: { minWidth: 430 } }
    ],
    { decimalPlaces: 6 }
  )
})
```

<!-- prettier-ignore-end -->

#### Results

##### On Galaxy S24 in portrait mode (360px)

`<meta name="viewport" content="initial-scale=0.837209,width=430" />`

##### On iPhone 15 in portrait mode (393px)

`<meta name="viewport" content="initial-scale=0.913953,width=430" />`

##### On iPhone 15 Pro Max in portrait mode (430px)

`<meta name="viewport" content="initial-scale=1,width=device-width" />`

## Various ways to set parameters

All of the parameter settings below have the same meaning, even if the width and initial scale in the content attribute or the content property are omitted.

### Using only `meta[name="viewport-extra"]` element

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=430,max-width=640"
/>
```

### Using only `meta[name="viewport"]` element

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430,max-width=640"
/>
```

### Using both `meta[name="viewport"]` and `meta[name="viewport-extra"]` elements

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="viewport-extra" content="min-width=430,max-width=640" />
```

### Using setContent function

```ts
setContent({
  width: 'device-width',
  initialScale: 1,
  minWidth: 430,
  maxWidth: 640
})
```

### Using setParameters function

```ts
setParameters([
  {
    content: {
      width: 'device-width',
      initialScale: 1,
      minWidth: 430,
      maxWidth: 640
    }
  }
])
```

## Notes

- For small mobile devices, it is recommended to set the following style:

  ```css
  body {
    -webkit-text-size-adjust: 100%;
  }
  ```

  It prevents unintentional text size adjustments by browsers. See also [the issue](https://github.com/dsktschy/viewport-extra/issues/17).

- Viewport Extra v2 does not support AMD. If it is needed use v1.
