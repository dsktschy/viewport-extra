import { expect, test } from '@playwright/test'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'
import { getViewportContentString } from '../modules/PlaywrightPage.js'
;[
  { format: 'es', moduleFlag: true, minified: false },
  { format: 'cjs', moduleFlag: true, minified: false },
  { format: 'iife', moduleFlag: false, minified: false },
  { format: 'iife', moduleFlag: false, minified: true }
].forEach(({ format, moduleFlag, minified }, formatIndex) => {
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    test.describe('updating content attribute of viewport meta element', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
      })

      test.describe('case where min-width is set in (data-extra-)content attribute and media query is set in data-(extra-)media attribute, of viewport(-extra) meta element', () => {
        test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width. Last min-width in matching media queries is used', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const xlViewportWidth =
            getViewportSize(projects, 'xl')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="viewport-extra" content="min-width=${smViewportWidth}" />
                <meta name="viewport-extra" content="min-width=${xlViewportWidth}" data-media="(min-width: 640px)" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0 && xlViewportWidth > 0
              ? documentClientWidth < 640
                ? documentClientWidth < smViewportWidth
                  ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                  : 'initial-scale=1,width=device-width'
                : documentClientWidth < xlViewportWidth
                  ? `initial-scale=${(documentClientWidth / xlViewportWidth) * 1},width=${xlViewportWidth}`
                  : 'initial-scale=1,width=device-width'
              : ''
          )
        })
      })

      test.describe('case where max-width is set in (data-extra-)content attribute and media query is set in data-(extra-)media attribute, of viewport(-extra) meta element', () => {
        test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width. Last max-width in matching media queries is used', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const xsViewportWidth =
            getViewportSize(projects, 'xs')?.use.viewport?.width ?? 0
          const lgViewportWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="viewport-extra" content="max-width=${xsViewportWidth}" />
                <meta name="viewport-extra" content="max-width=${lgViewportWidth}" data-media="(min-width: 640px)" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth &&
              xsViewportWidth < Infinity &&
              lgViewportWidth < Infinity
              ? documentClientWidth < 640
                ? documentClientWidth > xsViewportWidth
                  ? `initial-scale=${(documentClientWidth / xsViewportWidth) * 1},width=${xsViewportWidth}`
                  : 'initial-scale=1,width=device-width'
                : documentClientWidth > lgViewportWidth
                  ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 1},width=${lgViewportWidth}`
                  : 'initial-scale=1,width=device-width'
              : ''
          )
        })
      })
    })

    // Following cases cannot be tested with vitest
    // Because vitest does not update size of document element when viewport element is updated
    // Run only in minimal formats and viewports because they replace unit tests of src/index.spec.ts
    test.describe('comparison with min-width and max-width, and computation of output initial-scale', () => {
      test.beforeEach(async ({ page }, testInfo) => {
        testInfo.skip(formatIndex !== 0)
        testInfo.skip(!['xs', 'xl'].includes(testInfo.project.name))
        await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
      })

      test('width of window without scroll bars when scale is 1 is used for comparison, and initial-scale merged from viewport and viewport-extra meta elements is applied to output initial-scale', async ({
        page,
        viewport
      }, { config: { projects } }) => {
        const smViewportWidth =
          getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
        const lgViewportWidth =
          getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
        const documentClientWidth = viewport ? viewport.width : undefined
        await page.setContent(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Document</title>
              <meta name="viewport" content="width=device-width,initial-scale=0.5"/>
              <meta name="viewport-extra" content="min-width=${smViewportWidth},max-width=${lgViewportWidth}" />
              ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
            </head>
            <body>
              ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
            </body>
          </html>
        `)
        expect(await getViewportContentString(page)).toBe(
          documentClientWidth &&
            smViewportWidth > 0 &&
            lgViewportWidth < Infinity
            ? documentClientWidth < smViewportWidth
              ? `initial-scale=${(documentClientWidth / smViewportWidth) * 0.5},width=${smViewportWidth}`
              : documentClientWidth > lgViewportWidth
                ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 0.5},width=${lgViewportWidth}`
                : 'initial-scale=0.5,width=device-width'
            : ''
        )
      })
    })

    // Following cases cannot be tested with vitest
    // Because vitest does not update size of document element when viewport element is updated
    // Run only in minimal formats and viewports because they replace unit tests of src/index.spec.ts
    test.describe('merging attributes for GlobalParameters, of viewport and viewport-extra meta elements', () => {
      test.beforeEach(async ({ page }, testInfo) => {
        testInfo.skip(formatIndex !== 0)
        testInfo.skip(!['xs'].includes(testInfo.project.name))
        await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
      })

      test.describe('case where data-(extra-)unscaled-computing attribute exists in only viewport meta elements', () => {
        test('unscaledComputing property of internalGlobalParameters variable is set to true', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                <meta name="viewport-extra" />
              </head>
              <body>
                <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${smViewportWidth} } }]'></script>
                <script src="/assets/scripts/${format}/side_effects.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 2},width=${smViewportWidth}`
                : 'initial-scale=2,width=device-width'
              : ''
          )
        })
      })

      test.describe('case where data-(extra-)unscaled-computing attribute exists in only viewport-extra meta elements', () => {
        test('unscaledComputing property of internalGlobalParameters variable is set to true', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                <meta name="viewport-extra" data-extra-unscaled-computing />
              </head>
              <body>
                <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${smViewportWidth} } }]'></script>
                <script src="/assets/scripts/${format}/side_effects.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 2},width=${smViewportWidth}`
                : 'initial-scale=2,width=device-width'
              : ''
          )
        })
      })

      test.describe('case where data-(extra-)unscaled-computing attribute exists in both meta elements', () => {
        test('unscaledComputing property of internalGlobalParameters variable is set to true', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                <meta name="viewport-extra" data-extra-unscaled-computing />
              </head>
              <body>
                <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${smViewportWidth} } }]'></script>
                <script src="/assets/scripts/${format}/side_effects.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 2},width=${smViewportWidth}`
                : 'initial-scale=2,width=device-width'
              : ''
          )
        })
      })

      test.describe('case where data-(extra-)unscaled-computing attribute does not exist in both meta elements', () => {
        test('unscaledComputing property of internalGlobalParameters variable is set to false', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const smViewportWidth =
            (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) / 0.5
          const documentClientWidth = viewport
            ? viewport.width / 0.5
            : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                <meta name="viewport-extra" />
              </head>
              <body>
                <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${smViewportWidth} } }]'></script>
                <script src="/assets/scripts/${format}/side_effects.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 2},width=${smViewportWidth}`
                : 'initial-scale=2,width=device-width'
              : ''
          )
        })
      })
    })

    // Following cases cannot be tested with vitest
    // Because vitest does not provide matchMedia method
    // Run only in minimal formats and viewports because they replace unit tests of src/index.spec.ts
    test.describe('merging attributes for MediaSpecificParameters, of viewport and viewport-extra meta elements', () => {
      test.beforeEach(async ({ page }, testInfo) => {
        testInfo.skip(formatIndex !== 0)
        testInfo.skip(!['xs'].includes(testInfo.project.name))
        await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
      })

      test.describe('case where viewport meta element exists and viewport-extra meta element does not exist', () => {
        test('only attributes of first viewport meta element are used', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const xsViewportWidth =
            getViewportSize(projects, 'xs')?.use.viewport?.width ?? 0
          const smViewportWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${smViewportWidth}" />
                <meta name="viewport" content="width=640,initial-scale=2" />
                <meta name="viewport" data-extra-content="min-width=${xsViewportWidth + 1}" data-extra-media="(min-width: ${xsViewportWidth}px)" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                : 'initial-scale=1,width=device-width'
              : ''
          )
        })
      })

      test.describe('case where viewport meta element does not exist and viewport-extra meta element exists', () => {
        test('attribute values of elements that exist later (for (data-extra-)content attributes, pairs in attribute values of elements that exist later after being decomposed into key-value pairs) in viewport-extra meta elements whose media attributes match viewport are used', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const lgViewportWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? 0
          const xlViewportWidth =
            getViewportSize(projects, 'xl')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport-extra" content="min-width=${xlViewportWidth}" data-media="(min-width: ${lgViewportWidth}px)" />
                <meta name="viewport-extra" content="min-width=${lgViewportWidth}" data-media="(min-width: ${smViewportWidth}px)" />
                <meta name="viewport-extra" content="min-width=${smViewportWidth + 2}" />
                <meta name="viewport-extra" content="min-width=${smViewportWidth + 1}" />
                <meta name="viewport-extra" content="min-width=${smViewportWidth},initial-scale=0.5" />
                <meta name="viewport-extra" content="width=device-width,initial-scale=1" />
                <meta name="viewport-extra" content="width=device-width,initial-scale=2" data-media="(min-width: ${smViewportWidth}px)" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                : 'initial-scale=1,width=device-width'
              : ''
          )
        })
      })

      test.describe('case where both viewport and viewport-extra meta elements exist', () => {
        test('attribute values of elements that exist later (for (data-extra-)content attributes, pairs in attribute values of elements that exist later after being decomposed into key-value pairs) in viewport and viewport-extra meta elements whose media attributes match viewport are used. Viewport-extra meta elements are handled as being after viewport meta element', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const xsViewportWidth =
            getViewportSize(projects, 'xs')?.use.viewport?.width ?? 0
          const smViewportWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport-extra" content="width=device-width,initial-scale=1" data-media="(min-width: ${xsViewportWidth}px)" />
                <meta name="viewport" content="width=device-width,initial-scale=2" data-extra-content="min-width=${smViewportWidth}" />
                <meta name="viewport-extra" content="width=device-width,initial-scale=2,min-width=${smViewportWidth + 1}" data-media="(min-width: ${smViewportWidth}px)" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                : 'initial-scale=1,width=device-width'
              : ''
          )
        })

        test.describe('case where missing attribute values (for (data-extra-)content attributes, missing pairs in attribute values after being decomposed into key-value pairs) are in all viewport and viewport-extra meta elements whose media attributes match viewport', () => {
          test('default values for missing attributes and missing pairs of (data-extra-)content attributes are used', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const xsViewportWidth =
              getViewportSize(projects, 'xs')?.use.viewport?.width ?? 0
            const smViewportWidth =
              getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
            const documentClientWidth = viewport ? viewport.width : undefined
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width" />
                  <meta name="viewport-extra" content="min-width=${smViewportWidth}" data-media="(min-width: ${xsViewportWidth}px)" />
                  <meta name="viewport-extra" content="width=device-width,initial-scale=2,min-width=${smViewportWidth + 1}" data-media="(min-width: ${smViewportWidth}px)" />
                  ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && smViewportWidth > 0
                ? documentClientWidth < smViewportWidth
                  ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                  : 'initial-scale=1,width=device-width'
                : ''
            )
          })
        })
      })
    })
  })
})
