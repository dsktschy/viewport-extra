# Viewport Extra [![](https://data.jsdelivr.com/v1/package/npm/viewport-extra/badge)](https://www.jsdelivr.com/package/npm/viewport-extra)

Viewport Extra enables to set min-width and max-width for viewport.  
If you set 360 to min-width, Viewport Extra will overwrite content attribute in meta tag of viewport, in device whose screen width is less than 360px (e.g. iPhone SE).

## CDN

https://cdn.jsdelivr.net/npm/viewport-extra@1.0.3/dist/viewport-extra.min.js

## Usage

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<script src="https://cdn.jsdelivr.net/npm/viewport-extra@1.0.3/dist/viewport-extra.min.js"></script>

<!-- Require to put just after meta tag of viewport -->
<script>

  // Overwrite content attribute to
  // "width=360,initial-scale=0.8888888888888888" on iPhone SE
  // "width=375,initial-scale=1.104"              on iPhone 8 Plus
  // No overwriting on Galaxy S5 and iPhone 8
  new ViewportExtra({ minWidth: 360, maxWidth: 375 })

  // minWidth can also be set with single number argument
  new ViewportExtra(360)

</script>
```
