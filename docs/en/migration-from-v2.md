# Migration Guide from v2 to v3

**English** | [日本語](/docs/ja/migration-from-v2.md)

This guide explains the differences between Viewport Extra v2 and v3. While v2 can still be used, migrating to v3 offers improvements such as reduced file size, ensuring consistency with the [W3C specifications](https://www.w3.org/TR/css-viewport-1/#meta-properties), and avoiding the [Dual Package Hazard](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_dual_package_hazard).

## Highlights

### Using Script

<!-- x-release-please-start-previous-root-project-version -->

```diff
+ <!-- Deprecated: data-(extra-)unscaled-computing attribute -->
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

  <!-- For environments that do not support ES2021 syntax and features in the Widely Available stage of the Web Platform Baseline as of the release of Viewport Extra v3.0.0 -->
  <script
    async
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/es5/viewport-extra.min.js"
  ></script>

  <!-- When using the data-(extra-)decimal-places attribute -->
  <script
    async
-   src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"
+   src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/extended/viewport-extra.min.js"
  ></script>
```

<!-- x-release-please-end -->

### Using Module

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

  // For environments that do not support ES2021 syntax and features in the Widely Available stage of the Web Platform Baseline as of the release of Viewport Extra v3.0.0
- import("viewport-extra")
+ import("viewport-extra/es5")

  // When using the decimalPlaces property
- import("viewport-extra")
+ import("viewport-extra/extended")

  import("viewport-extra").then(({
-   setParameters,
-   updateReference
+   apply
  }) => {
-   updateReference()
+   // Deprecated: updateReference() function

-   setParameters(
-     [{ content: { minWidth: 412 } }],
-     { unscaledComputing: true }
+   apply(
+     [{ content: { minimumWidth: 412 } }]
+     // Deprecated: unscaledComputing property
    )

    window.addEventListener("awesome-event", () => {
-     setParameters([])
+     apply([{ content: { minimumWidth: 412 } }]) // Arguments cannot be omitted
    })
  })
```

## Details

- [Build Selection](#build-selection)
- [Minimum / Maximum Widths Application API](#minimum--maximum-widths-application-api)
- [Terms for Minimum / Maximum](#terms-for-minimum--maximum)
- [Scale Reset Before Minimum / Maximum Widths Application](#scale-reset-before-minimum--maximum-widths-application)
- [Retention of Minimum / Maximum Widths Internally in Viewport Extra](#retention-of-minimum--maximum-widths-internally-in-viewport-extra)
- [Retention of `<meta name="viewport">` Element Internally in Viewport Extra](#retention-of-meta-nameviewport-element-internally-in-viewport-extra)

### Build Selection

In v2, a single build containing all features is provided. Even if only some features are used, the file size cannot be reduced.

In v3, multiple builds with varying scopes of included features are provided. The features that determine build selection are as follows:

- **`meta` Element Parsing and Immediate Application:** This feature parses and applies the minimum / maximum widths from `<meta name="viewport">` and `<meta name="viewport-extra">` elements as soon as Viewport Extra becomes executable. No API calls are required.
- **Advanced Features:** Features that are usually unnecessary. As of v3.0.0-rc.0, this includes the feature to specify decimal places.<!-- x-release-please-version -->
- **Support for Legacy Environments:** This feature ensures compatibility with environments that do not support ES2015+ (e.g., IE 11). Additionally, builds without this feature include ES2021 syntax and features in the Widely Available stage of the [Web Platform Baseline](https://web.dev/baseline) as of the release of Viewport Extra v3.0.0. Therefore, this feature can also be used to ensure compatibility with environments that do not support these (e.g., iOS Safari < 16, Android Chrome < 108).

#### Using Script

##### v2 Syntax

Only a single build can be selected.

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>
```

##### v3 Syntax

Multiple builds can be selected.

|                                     File Path in URL | `meta` Element Parsing and Immediate Application | Advanced Features | Support for Legacy Environments |
| ---------------------------------------------------: | :----------------------------------------------: | :---------------: | :-----------------------------: |
|                        `/dist/viewport-extra.min.js` |                        -                         |         -         |                -                |
|                    `/dist/es5/viewport-extra.min.js` |                        -                         |         -         |               ✔                |
|               `/dist/extended/viewport-extra.min.js` |                        -                         |        ✔         |                -                |
|           `/dist/extended/es5/viewport-extra.min.js` |                        -                         |        ✔         |               ✔                |
|                                               (None) |                        ✔                        |         -         |                -                |
|          `/dist/immediate/es5/viewport-extra.min.js` |                        ✔                        |         -         |               ✔                |
|     `/dist/immediate/extended/viewport-extra.min.js` |                        ✔                        |        ✔         |                -                |
| `/dist/immediate/extended/es5/viewport-extra.min.js` |                        ✔                        |        ✔         |               ✔                |

If you are using `meta` element parsing and immediate application, the build with no file path part in the URL is the smallest and ideal.

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0"></script>
```

<!-- x-release-please-end -->

If you are not using `meta` element parsing and immediate application and only using API calls, the build with the file path `/dist/viewport-extra.min.js` in the URL is the smallest and ideal.

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

If you need to ensure compatibility with environments that do not support ES2021 syntax and features in the Widely Available stage of the [Web Platform Baseline](https://web.dev/baseline) as of the release of Viewport Extra v3.0.0, a build that includes `es5` in the file path in the URL is required.

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

If you are using the feature to specify decimal places, a build that includes `extended` in the file path in the URL is required.

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/extended/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

If it's difficult to determine the appropriate build, the build with the file path `/dist/immediate/extended/es5/viewport-extra.min.js` in the URL includes all features.

<!-- x-release-please-start-version -->

```html
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0/dist/immediate/extended/es5/viewport-extra.min.js"></script>
```

<!-- x-release-please-end -->

#### Using Module

##### v2 Syntax

Only a single build can be selected.

```js
import("viewport-extra")
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

The build with the module specifier `viewport-extra` is the smallest and ideal.

```js
import("viewport-extra")
```

If you need to ensure compatibility with environments that do not support ES2021 syntax and features in the Widely Available stage of the [Web Platform Baseline](https://web.dev/baseline) as of the release of Viewport Extra v3.0.0, a build that includes `es5` in the module specifier is required.

```js
import("viewport-extra/es5")
```

If you are using the feature to specify decimal places, a build that includes `extended` in the module specifier is required.

```js
import("viewport-extra/extended")
```

If it's difficult to determine the appropriate build, the build with the module specifier `viewport-extra/immediate/extended/es5` includes all features.

```js
import("viewport-extra/immediate/extended/es5")
```

### Minimum / Maximum Widths Application API

In v2, two methods are provided for the minimum / maximum widths application API. One of them, `setParameters()` function, was added in v2.2. The other, `setContent()` function, has been retained to avoid breaking changes, which has contributed to a larger file size.

In v3, only `apply()` function is provided as the minimum / maximum widths application API.

#### Using Script

##### v2 Syntax

To apply minimum / maximum widths, use either `setContent()` function or `setParameters()` function.

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

##### v3 Syntax

To apply minimum / maximum widths, use `apply()` function. The interface is the same as `setParameters()` function in v2.

```html
<script>
  ViewportExtra.apply([{ content: { minimumWidth: 430 } }])
</script>
```

#### Using Module

##### v2 Syntax

To apply minimum / maximum widths, use either `setContent()` function or `setParameters()` function.

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

##### v3 Syntax

To apply minimum / maximum widths, use `apply()` function. The interface is the same as `setParameters()` function in v2.

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minimumWidth: 430 } }])
})
```

### Terms for Minimum / Maximum

In v2, the terms `min` / `max` are used in both the `(data-extra-)content` attribute of the `meta` element (e.g., `min-width`) and the minimum / maximum widths application API (e.g., `minWidth`). However, the terms used in the [W3C specifications](https://www.w3.org/TR/css-viewport-1/#meta-properties) are `minimum` / `maximum` (e.g., `minimum-scale`), which is inconsistent.

In v3, the terms `minimum` / `maximum` are used in both the `(data-extra-)content` attribute of the `meta` element (e.g., `minimum-width`) and the minimum / maximum widths application API (e.g., `minimumWidth`).

#### Using Script

##### v2 Syntax

In the `data-extra-content` attribute of the `<meta name="viewport">` element, use the keywords `min-width` / `max-width`.

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430,max-width=640"
>
```

In the `content` attribute of the `<meta name="viewport-extra">` element, also use the keywords `min-width` / `max-width`.

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=430,max-width=640"
>
```

In the arguments of `setContent()` function and `setParameters()` function, use the property names `minWidth` / `maxWidth`.

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

##### v3 Syntax

In the `data-extra-content` attribute of the `<meta name="viewport">` element, use the keywords `minimum-width` / `maximum-width`.

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="minimum-width=430,maximum-width=640"
>
```

In the `content` attribute of the `<meta name="viewport-extra">` element, also use the keywords `minimum-width` / `maximum-width`.

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,minimum-width=430,maximum-width=640"
>
```

In the arguments of `apply()` function, use the property names `minimumWidth` / `maximumWidth`.

```html
<script>
  ViewportExtra.apply([{ content: { minimumWidth: 430, maximumWidth: 640 } }])
</script>
```

#### Using Module

##### v2 Syntax

In the arguments of `setContent()` function and `setParameters()` function, use the property names `minWidth` / `maxWidth`.

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

##### v3 Syntax

In the arguments of `apply()` function, use the property names `minimumWidth` / `maximumWidth`.

```js
import("viewport-extra").then(({ apply }) => {
  apply([{ content: { minimumWidth: 430, maximumWidth: 640 } }])
})
```

### Scale Reset Before Minimum / Maximum Widths Application

The width used in the calculations for minimum / maximum width application fluctuates according to the scale. Therefore, it is necessary to reset the scale before minimum / maximum width application.

In v2, a feature for automatic scale resetting is provided as the `data-(extra-)unscaled-computing` attribute of the `meta` element and the `unscaledComputing` property in the arguments for the minimum / maximum width application API. This feature was added in v2.2 and is disabled by default to avoid breaking changes. There is no reason to intentionally disable it, and the file size is larger due to the option to enable or disable it.

In v3, the feature for automatic scale resetting is enabled by default, and no method is provided to disable it.

#### Using Script

##### v2 Syntax

If `setContent()` function and `setParameters()` function are to be called multiple times, the `data-extra-unscaled-computing` attribute is required on the `<meta name="viewport">` element.

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430"
  data-extra-unscaled-computing
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>

<script>
  window.addEventListener("awesome-event", () =>
    window.ViewportExtra?.setParameters([{ content: { minWidth: 430 } }]),
  )
</script>
```

If `setContent()` function and `setParameters()` function are to be called multiple times, the `data-unscaled-computing` attribute is required on the `<meta name="viewport-extra">` element.

```html
<meta
  name="viewport-extra"
  content="width=device-width,initial-scale=1,min-width=430"
  data-unscaled-computing
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@2.4.1/dist/iife/viewport-extra.min.js"></script>

<script>
  window.addEventListener("awesome-event", () =>
    window.ViewportExtra?.setParameters([{ content: { minWidth: 430 } }]),
  )
</script>
```

##### v3 Syntax

Even if `apply()` function is to be called multiple times, no special attributes are required.

<!-- x-release-please-start-version -->

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
  data-extra-content="min-width=430"
>
<script async src="https://cdn.jsdelivr.net/npm/viewport-extra@3.0.0-rc.0"></script>

<script>
  window.addEventListener("awesome-event", () =>
    window.ViewportExtra?.apply([{ content: { minimumWidth: 430 } }]),
  )
</script>
```

<!-- x-release-please-end -->

#### Using Module

##### v2 Syntax

If `setParameters()` function is to be called multiple times, the `unscaledComputing` property in the arguments must be set to `true`. Note that `setContent()` function cannot set the `unscaledComputing` property in its arguments, so it cannot be used in this case.

```js
import("viewport-extra").then(({ setParameters }) => {
  window.addEventListener("awesome-event", () =>
    setParameters(
      [{ content: { minWidth: 430 } }],
      { unscaledComputing: true }
    ),
  )
})
```

##### v3 Syntax

Even if `apply()` function is to be called multiple times, no special properties in the arguments are required.

```js
import("viewport-extra").then(({ apply }) => {
  window.addEventListener("awesome-event", () =>
    apply([{ content: { minimumWidth: 430 } }]),
  )
})
```

### Retention of Minimum / Maximum Widths Internally in Viewport Extra

In v2, Viewport Extra retains the applied minimum / maximum widths internally. These are used as fallbacks for the arguments in the next call to the minimum / maximum widths application API. However, retaining values internally in the package can cause [Dual Package Hazard](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_dual_package_hazard) when using module.

In v3, Viewport Extra does not retain the applied minimum / maximum widths internally, and no fallbacks for the arguments are performed.

#### Using Script

##### v2 Syntax

In multiple calls to `setContent()` function and `setParameters()` function, if the initially applied minimum / maximum widths are to be reapplied, the arguments can be omitted.

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
    () => window.ViewportExtra?.setContent(), // 430 is used as minWidth
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
    () => window.ViewportExtra?.setParameters([]), // 430 is used as minWidth
  )
</script>
```

##### v3 Syntax

In multiple calls to `apply()` function, even if the initially applied minimum / maximum widths are to be reapplied, the arguments cannot be omitted.

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
    () => window.ViewportExtra?.apply([{ content: { minimumWidth: 430 } }]), // If arguments are omitted, minimumWidth defaults to 0
  )
</script>
```

<!-- x-release-please-end -->

#### Using Module

##### v2 Syntax

In multiple calls to `setParameters()` function, if the initially applied minimum / maximum widths are to be reapplied, the arguments can be omitted. Note that `setContent()` function cannot set the `unscaledComputing` property in its arguments, so it cannot be used in this case.

```js
import("viewport-extra").then(({ setParameters }) => {
  setParameters([{ content: { minWidth: 430 } }], { unscaledComputing: true })
  window.addEventListener(
    "awesome-event",
    () => setParameters([]), // 430 is used as minWidth
  )
})
```

##### v3 Syntax

In multiple calls to `apply()` function, even if the initially applied minimum / maximum widths are to be reapplied, the arguments cannot be omitted.

```js
import("viewport-extra").then(({ apply }) => {
  const parameters = [{ content: { minWidth: 430 } }]
  apply(parameters)
  window.addEventListener(
    "awesome-event",
    () => apply(parameters), // If arguments are omitted, minimumWidth defaults to 0
  )
})
```

### Retention of `<meta name="viewport">` Element Internally in Viewport Extra

In v2, Viewport Extra retains the `<meta name="viewport">` element to which the minimum / maximum widths are applied. This is used as a target in the next minimum / maximum widths application. Additionally, if the `<meta name="viewport">` element is replaced, the new one must be retained, and the `updateReference()` API is provided for this. However, retaining values internally in the package can cause [Dual Package Hazard](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_dual_package_hazard) when using module.

In v3, Viewport Extra does not retain the `<meta name="viewport">` element to which the minimum / maximum widths are applied, and no API is provided to retain a new `<meta name="viewport">` element.

#### Using Module

##### v2 Syntax

Next.js replaces the existing `<meta name="viewport">` element with a new one on every page transition, so `updateReference()` needs to be called before `setContent()` function and `setParameters()` function.

```jsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const ViewportExtra = () => {
  const pathname = usePathname()

  // Side effects executed on every page transition
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

##### v3 Syntax

Next.js replaces the existing `<meta name="viewport">` element with a new one on every page transition, but no special operations are required before calling `apply()` function.

```jsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const ViewportExtra = () => {
  const pathname = usePathname()

  // Side effects executed on every page transition
  useEffect(() => {
    import("viewport-extra").then(({ apply }) => {
      apply([{ minWidth: 430 }])
    })
  }, [pathname])

  return <></>
}

export default ViewportExtra
```
