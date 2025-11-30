# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra)

> [!NOTE]
>
> The latest major version is v3.
>
> More info: [How to Handle v3](#how-to-handle-v3)

Viewport Extra enables to set min-width and max-width of viewport, by overriding the content attribute of the viewport meta element. It will reduce the range of viewport that have to be considered when styling.

For example, on devices with a display width of less than 375px (e.g. iPhone SE 1st generation), if a page with a width of 375px or more is displayed, there will usually be horizontal scrolling. In such a case, you can set the min-width of viewport to 375px with Viewport Extra, which will shrink the page to fit perfectly into the 375px display width and remove horizontal scrolling.

## Usage

### CDN

```html
<meta name="viewport" content="width=device-width,initial-scale=1">

<script src="https://cdn.jsdelivr.net/npm/viewport-extra@1.1.1/dist/viewport-extra.min.js"></script>

<script>
  new ViewportExtra({ minWidth: 375, maxWidth: 414 })

  // Shorthand if maxWidth is not required
  new ViewportExtra(375)
</script>
```

### NPM

```bash
npm i viewport-extra
```

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
```

```js
import VewportExtra from 'viewport-extra'

new ViewportExtra({ minWidth: 375, maxWidth: 414 })

// Shorthand if maxWidth is not required
new ViewportExtra(375)
```

## Examples

```js
/**
 * The page will be shrinked
 * on iPhone 5/5s/SE(1st generation) in portrait mode
 * <meta name="viewport" content="width=375,initial-scale=0.8533333333333334">
 *
 * No operation
 * on iPhone >= 6 and iPhone 5/5s/SE(1st generation) in landscape mode
 * <meta name="viewport" content="width=device-width,initial-scale=1">
 */
new ViewportExtra(375)

/**
 * The page will be shrinked
 * on iPad Pro 12.9-inch(3rd generation) in portrait mode
 * <meta name="viewport" content="width=1280,initial-scale=0.8">
 *
 * No operation
 * on iPad Pro 12.9-inch(3rd generation) in landscape mode
 * <meta name="viewport" content="width=device-width,initial-scale=1">
 */
new ViewportExtra(1280)

/**
 * It is recommended to switch value according to the device type
 * by using user agent, etc.
 */
new ViewportExtra(isTablet ? 1280 : 375)

/**
 * The page will be expanded
 * on iPhone >= 6 and iPhone 5/5s/SE(1st generation) in landscape mode
 * <meta name="viewport" content="width=320,initial-scale=1.171875">
 *
 * No operation
 * on iPhone 5/5s/SE(1st generation) in portrait mode
 * <meta name="viewport" content="width=device-width,initial-scale=1">
 */
new ViewportExtra({ minWidth: null, maxWidth: 320 })
```

## How to Handle v3

v3 includes breaking changes. To handle this, continuation of using v1 or migration to v3 are available.

### Continue Using v1

v1 will continue to be maintained and remain available for use even after the release of v3.

### Migrate to v3

Migration to v3 is possible with reference to the guides.

- Reference: [Migration Guide from v1 to v3](https://github.com/dsktschy/viewport-extra/blob/master/docs/en/migration-from-v1.md)

## Note

* Of course, it works on Android devices as well.

* Rotating the screen (switching between portrait and landscape mode) does not rewrite the content attribute of the viewport meta element.

* If using NPM and worried about the delay in applying, switch to using CDN.
