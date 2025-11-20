# Migration Guide from v1 to v3

**English** | [日本語](/docs/ja/migration-from-v1.md)

This guide explains the differences between Viewport Extra v1 and v3. While v1 can still be used, migrating to v3 offers improvements such as avoiding page display delays and adding the feature to apply different minimum / maximum widths for each browser width.

## Highlights

```diff
- v1 syntax
+ v3 syntax
```

### Using Script

<!-- x-release-please-start-previous-root-project-version -->

```diff
  <meta name="viewport" content="width=device-width,initial-scale=1">
+ <meta name="viewport-extra" content="min-width=412">
  <script
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@1.1.1/dist/viewport-extra.min.js"
+   async
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"
  ></script>
- <script>new ViewportExtra(412)</script>

  <meta name="viewport" content="width=device-width,initial-scale=1">
+ <meta name="viewport-extra" content="min-width=412,max-width=640">
  <script
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@1.1.1/dist/viewport-extra.min.js"
+   async
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"
  ></script>
- <script>new ViewportExtra({ minWidth: 412, maxWidth: 640 })</script>

  <!-- For environments that do not support ES2015+ -->
  <script
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@1.1.1/dist/viewport-extra.min.js"
+   async
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/es5/viewport-extra.min.js"
  ></script>
```

<!-- x-release-please-end -->

### Using Module

```diff
- import ViewportExtra from "viewport-extra"
- new ViewportExtra(412)
+ import("viewport-extra").then(({ apply }) => {
+   apply([{ content: { minWidth: 412 } }])
+ })

- import ViewportExtra from "viewport-extra"
- new ViewportExtra({ minWidth: 412, maxWidth: 640 })
+ import("viewport-extra").then(({ apply }) => {
+   apply([{ content: { minWidth: 412, maxWidth: 640 } }])
+ })

  /* For environments that do not support ES2015+ */
- import "viewport-extra"
+ import("viewport-extra/es5")
```

## Details

- [Build Selection](#build-selection)
- [Minimum / Maximum Widths Application API](#minimum--maximum-widths-application-api)

### Build Selection

In v1, a single build is provided. This build requires API calls, making it difficult to use with the `async` attribute of the `<script>` element. Additionally, as it is in [UMD format](https://github.com/umdjs/umd#readme) and does not support `import()` syntax, it may cause page display delays.

In v3, it is possible to select a build that does not require API calls from multiple available builds. Additionally, [IIFE format](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) is provided for scripts, and ESM and CJS formats are provided for modules. The features that determine build selection are as follows:

- **`meta` Element Parsing and Immediate Application:** This feature parses and applies the minimum / maximum widths from `<meta name="viewport">` and `<meta name="viewport-extra">` elements as soon as Viewport Extra becomes executable. No API calls are required.
- **Advanced Features:** Features that are usually unnecessary. As of v3.0.0-rc.4, this includes the feature to specify decimal places.<!-- x-release-please-version -->
- **Support for Legacy Environments:** This feature ensures compatibility with environments that do not support ES2015+ (e.g., IE 11). Additionally, builds without this feature include ES2021 syntax and features in the Widely Available stage of the [Web Platform Baseline](https://web.dev/baseline) as of the release of Viewport Extra v3.0.0. Therefore, this feature can also be used to ensure compatibility with environments that do not support these (e.g., iOS Safari < 16, Android Chrome < 108).

#### Using Script

##### v1 Syntax

Only a single build can be selected. To wait for Viewport Extra to finish loading before calling API, use the `<script>` element without the `async` attribute.

```html
<meta name="viewport" content="width=device-width,initial-scale=1">

<script src="https://cdn.jsdelivr.net/npm/viewport-extra@1.1.1/dist/viewport-extra.min.js"></script>
<script>new ViewportExtra(412)</script>
```

##### v3 Syntax

Multiple builds can be selected.

|                                     File Path in URL | `meta` Element Parsing and Immediate Application | Advanced Features | Support for Legacy Environments |
| ---------------------------------------------------: | :----------------------------------------------: | :---------------: | :-----------------------------: |
|                        `/dist/viewport-extra.min.js` |                        -                         |         -         |                -                |
|                    `/dist/es5/viewport-extra.min.js` |                        -                         |         -         |               ✔                |
|               `/dist/extended/viewport-extra.min.js` |                        -                         |        ✔         |                -                |
|           `/dist/extended/es5/viewport-extra.min.js` |                        -                         |        ✔         |               ✔                |
|              `/dist/immediate/viewport-extra.min.js` |                        ✔                        |         -         |                -                |
|          `/dist/immediate/es5/viewport-extra.min.js` |                        ✔                        |         -         |               ✔                |
|     `/dist/immediate/extended/viewport-extra.min.js` |                        ✔                        |        ✔         |                -                |
| `/dist/immediate/extended/es5/viewport-extra.min.js` |                        ✔                        |        ✔         |               ✔                |

A build that supports `meta` element parsing and immediate application, eliminating the need to call the API, can be selected and used with the `async` attribute of the `<script>` element. In this case, the build with the file path `/dist/immediate/viewport-extra.min.js` in the URL is the lightest and ideal.

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="min-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

To ensure compatibility with environments that do not support ES2015+, selecting a build that includes `es5` in the file path in the URL is required.

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="min-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

If it's difficult to determine the appropriate build, the build with the file path `/dist/immediate/extended/es5/viewport-extra.min.js` in the URL includes all features.

<!-- x-release-please-start-version -->

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="viewport-extra" content="min-width=412">

<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.4/dist/immediate/extended/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

#### Using Module

##### v1 Syntax

Only a single build can be selected. The `import` declaration must be used.

```js
import "viewport-extra"
```

##### v3 Syntax

Multiple builds can be selected.

|                        Module Specifier | `meta` Element Parsing and Immediate Application | Advanced Features | Support for Legacy Environments |
| --------------------------------------: | :----------------------------------------------: | :---------------: | :-----------------------------: |
|                        `viewport-extra` |                        -                         |         -         |                -                |
|                    `viewport-extra/es5` |                        -                         |         -         |               ✔                |
|               `viewport-extra/extended` |                        -                         |        ✔         |                -                |
|           `viewport-extra/extended/es5` |                        -                         |        ✔         |               ✔                |
|              `viewport-extra/immediate` |                        ✔                        |         -         |                -                |
|          `viewport-extra/immediate/es5` |                        ✔                        |         -         |               ✔                |
|     `viewport-extra/immediate/extended` |                        ✔                        |        ✔         |                -                |
| `viewport-extra/immediate/extended/es5` |                        ✔                        |        ✔         |               ✔                |

The `import()` syntax can be used. The build with the module specifier `viewport-extra` is the lightest and ideal.

```js
import("viewport-extra")
```

To ensure compatibility with environments that do not support ES2015+, selecting a build that includes `es5` in the module specifier is required.

```js
import("viewport-extra/es5")
```

If it's difficult to determine the appropriate build, the build with the module specifier `viewport-extra/immediate/extended/es5` includes all features.

```js
import("viewport-extra/immediate/extended/es5")
```

### Minimum / Maximum Widths Application API

The minimum / maximum widths application API in v1, the `ViewportExtra` constructor, accepts a single pair of minimum / maximum widths as arguments. It cannot apply different minimum / maximum widths for each browser width.

The minimum / maximum widths application API in v3, `apply()` function, takes multiple minimum / maximum widths along with media queries as arguments.

#### Using Script

##### v1 Syntax

To apply minimum / maximum widths, use the `ViewportExtra` constructor. It accepts a single minimum width or a single pair of minimum / maximum widths as arguments.

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

##### v3 Syntax

To apply minimum / maximum widths, use `apply()` function.

```html
<script>
  ViewportExtra.apply([{ content: { minWidth: 412 } }])
</script>
```

It can accept multiple minimum / maximum widths along with media queries as arguments.

```html
<script>
  ViewportExtra.apply([
    { content: { minWidth: 412 } }, // If media is omitted, the default is ""
    { content: { minWidth: 1024 }, media: "(min-width: 744px)" },
  ])
</script>
```

#### Using Module

##### v1 Syntax

To apply minimum / maximum widths, use the `ViewportExtra` constructor. It accepts a single minimum width or a single pair of minimum / maximum widths as arguments.

```js
import ViewportExtra from "viewport-extra"

new ViewportExtra(412)
```

```js
import ViewportExtra from "viewport-extra"

new ViewportExtra({ minWidth: 412 })
```

##### v3 Syntax

To apply minimum / maximum widths, use `apply()` function.

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minWidth: 412 } }])
})
```

It can accept multiple minimum / maximum widths along with media queries as arguments.

```js
import("viewport-extra").then(({ apply }) => {
  apply([
    { content: { minWidth: 412 } }, // If media is omitted, the default is ""
    { content: { minWidth: 1024 }, media: "(min-width: 744px)" },
  ])
})
```
