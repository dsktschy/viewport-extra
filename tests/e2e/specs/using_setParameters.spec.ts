import { expect, test } from '@playwright/test'
import { getViewportContentString } from '../modules/PlaywrightPage.js'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'
;[
  { format: 'es', moduleFlag: true, minified: false },
  { format: 'cjs', moduleFlag: true, minified: false },
  { format: 'iife', moduleFlag: false, minified: false },
  { format: 'iife', moduleFlag: false, minified: true }
].forEach(({ format, moduleFlag, minified }, formatIndex) => {
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    if (moduleFlag) {
      test.describe('using named export', () => {
        test.describe('updating content attribute of viewport meta element', () => {
          test.beforeEach(async ({ page }) => {
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where minWidth property is set in first argument', () => {
            test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                  </head>
                  <body>
                    <script data-media-specific-parameters-list='[{ "content": { "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 1},width=${minWidth}`
                    : 'initial-scale=1,width=device-width'
                  : ''
              )
            })
          })

          test.describe('case where maxWidth property is set in first argument', () => {
            test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                  </head>
                  <body>
                    <script data-media-specific-parameters-list='[{ "content": { "maxWidth": ${maxWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && maxWidth < Infinity
                  ? documentClientWidth > maxWidth
                    ? `initial-scale=${(documentClientWidth / maxWidth) * 1},width=${maxWidth}`
                    : 'initial-scale=1,width=device-width'
                  : ''
              )
            })
          })
        })

        // Following cases cannot be tested with vitest
        // Because vitest does not update size of document element when viewport element is updated
        // Run in only one format because purpose is to check library behavior, not to verify bundled code
        test.describe('comparison with minimum and maximum width, and computation of output initial scale', () => {
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            testInfo.skip(!['xs', 'xl'].includes(testInfo.project.name))
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where unscaledComputing property in merged globalParameters object is false', () => {
            // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
            test.describe('case where initial scale before running setParameters is 1 or less', () => {
              test('width of viewport is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                  0.5
                const maxWidth =
                  (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                    Infinity) / 0.5
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
                    </head>
                    <body>
                      <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                        : 'initial-scale=2,width=device-width'
                    : ''
                )
              })
            })

            // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
            test.describe('case where initial scale before running setParameters is greater than 1', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=2" />
                    </head>
                    <body>
                      <script data-media-specific-parameters-list='[{ "content": { "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                        : 'initial-scale=0.5,width=device-width'
                    : ''
                )
              })
            })
          })

          test.describe('case where unscaledComputing property in merged globalParameters object is true', () => {
            test.describe('case where initial scale before running setParameters is 1 or less', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                    </head>
                    <body>
                      <script data-global-parameters='{ "unscaledComputing": true }' data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                        : 'initial-scale=2,width=device-width'
                    : ''
                )
              })
            })

            test.describe('case where initial scale before running setParameters is greater than 1', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=2" />
                    </head>
                    <body>
                      <script data-global-parameters='{ "unscaledComputing": true }' data-media-specific-parameters-list='[{ "content": { "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                        : 'initial-scale=0.5,width=device-width'
                    : ''
                )
              })
            })
          })
        })

        test.describe('merging current GlobalParameters object and second argument', () => {
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            testInfo.skip(!['xs'].includes(testInfo.project.name))
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where second argument is provided', () => {
            test('values in second argument is used', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                0.5
              const documentClientWidth = viewport
                ? viewport.width / 0.5
                : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                  </head>
                  <body>
                    <script data-global-parameters='{ "unscaledComputing": false }' data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })

          test.describe('case where second argument is not provided', () => {
            test('values in current GlobalParameters object is used', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                  </head>
                  <body>
                    <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })
        })
      })

      test.describe('using default export', () => {
        test.describe('updating content attribute of viewport meta element', () => {
          test.beforeEach(async ({ page }) => {
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where minWidth property is set in first argument', () => {
            test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                  </head>
                  <body>
                    <script data-using-default-export data-media-specific-parameters-list='[{ "content": { "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 1},width=${minWidth}`
                    : 'initial-scale=1,width=device-width'
                  : ''
              )
            })
          })

          test.describe('case where maxWidth property is set in first argument', () => {
            test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                  </head>
                  <body>
                    <script data-using-default-export data-media-specific-parameters-list='[{ "content": { "maxWidth": ${maxWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && maxWidth < Infinity
                  ? documentClientWidth > maxWidth
                    ? `initial-scale=${(documentClientWidth / maxWidth) * 1},width=${maxWidth}`
                    : 'initial-scale=1,width=device-width'
                  : ''
              )
            })
          })
        })

        // Following cases cannot be tested with vitest
        // Because vitest does not update size of document element when viewport element is updated
        // Run in only one format because purpose is to check library behavior, not to verify bundled code
        test.describe('comparison with minimum and maximum width, and computation of output initial scale', () => {
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            testInfo.skip(!['xs', 'xl'].includes(testInfo.project.name))
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where unscaledComputing property in merged globalParameters object is false', () => {
            // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
            test.describe('case where initial scale before running setParameters is 1 or less', () => {
              test('width of viewport is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                  0.5
                const maxWidth =
                  (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                    Infinity) / 0.5
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
                    </head>
                    <body>
                      <script data-using-default-export data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                        : 'initial-scale=2,width=device-width'
                    : ''
                )
              })
            })

            // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
            test.describe('case where initial scale before running setParameters is greater than 1', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=2" />
                    </head>
                    <body>
                      <script data-using-default-export data-media-specific-parameters-list='[{ "content": { "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                        : 'initial-scale=0.5,width=device-width'
                    : ''
                )
              })
            })
          })

          test.describe('case where unscaledComputing property in merged globalParameters object is true', () => {
            test.describe('case where initial scale before running setParameters is 1 or less', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                    </head>
                    <body>
                      <script data-using-default-export data-global-parameters='{ "unscaledComputing": true }' data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                        : 'initial-scale=2,width=device-width'
                    : ''
                )
              })
            })

            test.describe('case where initial scale before running setParameters is greater than 1', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=2" />
                    </head>
                    <body>
                      <script data-using-default-export data-global-parameters='{ "unscaledComputing": true }' data-media-specific-parameters-list='[{ "content": { "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                        : 'initial-scale=0.5,width=device-width'
                    : ''
                )
              })
            })
          })
        })

        test.describe('merging current GlobalParameters object and second argument', () => {
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            testInfo.skip(!['xs'].includes(testInfo.project.name))
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where second argument is provided', () => {
            test('values in second argument is used', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                0.5
              const documentClientWidth = viewport
                ? viewport.width / 0.5
                : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                  </head>
                  <body>
                    <script data-using-default-export data-global-parameters='{ "unscaledComputing": false }' data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })

          test.describe('case where second argument is not provided', () => {
            test('values in current GlobalParameters object is used', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                  </head>
                  <body>
                    <script data-using-default-export data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })
        })
      })
    } else {
      test.describe('using global variable', () => {
        test.describe('updating content attribute of viewport meta element', () => {
          test.beforeEach(async ({ page }) => {
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where minWidth property is set in first argument', () => {
            test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-media-specific-parameters-list='[{ "content": { "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 1},width=${minWidth}`
                    : 'initial-scale=1,width=device-width'
                  : ''
              )
            })
          })

          test.describe('case where maxWidth property is set in first argument', () => {
            test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-media-specific-parameters-list='[{ "content": { "maxWidth": ${maxWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && maxWidth < Infinity
                  ? documentClientWidth > maxWidth
                    ? `initial-scale=${(documentClientWidth / maxWidth) * 1},width=${maxWidth}`
                    : 'initial-scale=1,width=device-width'
                  : ''
              )
            })
          })
        })

        // Following cases cannot be tested with vitest
        // Because vitest does not update size of document element when viewport element is updated
        // Run in only one format because purpose is to check library behavior, not to verify bundled code
        test.describe('comparison with minimum and maximum width, and computation of output initial scale', () => {
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            testInfo.skip(!['xs', 'xl'].includes(testInfo.project.name))
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where unscaledComputing property in merged globalParameters object is false', () => {
            // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
            test.describe('case where initial scale before running setParameters is 1 or less', () => {
              test('width of viewport is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                  0.5
                const maxWidth =
                  (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                    Infinity) / 0.5
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
                      <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                    </head>
                    <body>
                      <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                        : 'initial-scale=2,width=device-width'
                    : ''
                )
              })
            })

            // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
            test.describe('case where initial scale before running setParameters is greater than 1', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=2" />
                      <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                    </head>
                    <body>
                      <script data-media-specific-parameters-list='[{ "content": { "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                        : 'initial-scale=0.5,width=device-width'
                    : ''
                )
              })
            })
          })

          test.describe('case where unscaledComputing property in merged globalParameters object is true', () => {
            test.describe('case where initial scale before running setParameters is 1 or less', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                      <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                    </head>
                    <body>
                      <script data-global-parameters='{ "unscaledComputing": true }' data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                        : 'initial-scale=2,width=device-width'
                    : ''
                )
              })
            })

            test.describe('case where initial scale before running setParameters is greater than 1', () => {
              test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in first argument is applied to output initial scale', async ({
                page,
                viewport
              }, { config: { projects } }) => {
                const minWidth =
                  getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
                const maxWidth =
                  getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity
                const documentClientWidth = viewport
                  ? viewport.width
                  : undefined
                await page.setContent(`
                  <!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>Document</title>
                      <meta name="viewport" content="width=device-width,initial-scale=2" />
                      <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                    </head>
                    <body>
                      <script data-global-parameters='{ "unscaledComputing": true }' data-media-specific-parameters-list='[{ "content": { "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} } }]'></script>
                      <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                    </body>
                  </html>
                `)
                expect(await getViewportContentString(page)).toBe(
                  documentClientWidth && minWidth > 0 && maxWidth < Infinity
                    ? documentClientWidth < minWidth
                      ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                      : documentClientWidth > maxWidth
                        ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                        : 'initial-scale=0.5,width=device-width'
                    : ''
                )
              })
            })
          })
        })

        test.describe('merging current GlobalParameters object and second argument', () => {
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            testInfo.skip(!['xs'].includes(testInfo.project.name))
            await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
          })

          test.describe('case where second argument is provided', () => {
            test('values in second argument is used', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                0.5
              const documentClientWidth = viewport
                ? viewport.width / 0.5
                : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-global-parameters='{ "unscaledComputing": false }' data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })

          test.describe('case where second argument is not provided', () => {
            test('values in current GlobalParameters object is used', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-media-specific-parameters-list='[{ "content": { "initialScale": 2, "minWidth": ${minWidth} } }]'></script>
                    <script src="/assets/scripts/${format}/using_setParameters.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })
        })
      })
    }
  })
})
