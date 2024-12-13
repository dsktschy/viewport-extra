import { expect, test } from '@playwright/test'
import { convertToViewportContentString } from '../modules/NumberStringRecord.js'
import { getViewportContentString } from '../modules/PlaywrightPage.js'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
})
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
          test.describe('case where minWidth property is set in argument', () => {
            test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const width = 'device-width'
              const initialScale = 1
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  </head>
                  <body>
                    <script data-min-width="${minWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale: documentClientWidth / minWidth
                      })
                    : convertToViewportContentString({ width, initialScale })
                  : ''
              )
            })
          })

          test.describe('case where maxWidth property is set in argument', () => {
            test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const width = 'device-width'
              const initialScale = 1
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  </head>
                  <body>
                    <script data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && maxWidth < Infinity
                  ? documentClientWidth > maxWidth
                    ? convertToViewportContentString({
                        width: maxWidth,
                        initialScale: documentClientWidth / maxWidth
                      })
                    : convertToViewportContentString({ width, initialScale })
                  : ''
              )
            })
          })
        })

        // Following cases cannot be tested with vitest
        // Because vitest does not update size of document element when viewport element is updated
        // Run in only one format because purpose is to check library behavior, not to verify bundled code
        test.describe('comparison with minimum and maximum width, and computation of output initial scale', () => {
          // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
          test.describe('case where initial scale before running setContent is 1 or less', () => {
            test('width of viewport is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
              page,
              viewport
            }, testInfo) => {
              testInfo.skip(formatIndex !== 0)
              const { config } = testInfo
              const { projects } = config
              const width = 'device-width'
              const initialScaleBefore = 0.5
              const initialScaleAfter = 2
              const minWidth =
                (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                initialScaleBefore
              const maxWidth =
                (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity) / initialScaleBefore
              const documentClientWidth = viewport
                ? viewport.width / initialScaleBefore
                : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScaleBefore}" />
                  </head>
                  <body>
                    <script data-initial-scale="${initialScaleAfter}" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale:
                          (documentClientWidth / minWidth) * initialScaleAfter
                      })
                    : documentClientWidth > maxWidth
                      ? convertToViewportContentString({
                          width: maxWidth,
                          initialScale:
                            (documentClientWidth / maxWidth) * initialScaleAfter
                        })
                      : convertToViewportContentString({
                          width,
                          initialScale: initialScaleAfter
                        })
                  : ''
              )
            })
          })

          // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
          test.describe('case where initial scale before running setContent is greater than 1', () => {
            test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
              page,
              viewport
            }, testInfo) => {
              testInfo.skip(formatIndex !== 0)
              const { config } = testInfo
              const { projects } = config
              const width = 'device-width'
              const initialScaleBefore = 2
              const initialScaleAfter = 0.5
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScaleBefore}" />
                  </head>
                  <body>
                    <script data-initial-scale="${initialScaleAfter}" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale:
                          (documentClientWidth / minWidth) * initialScaleAfter
                      })
                    : documentClientWidth > maxWidth
                      ? convertToViewportContentString({
                          width: maxWidth,
                          initialScale:
                            (documentClientWidth / maxWidth) * initialScaleAfter
                        })
                      : convertToViewportContentString({
                          width,
                          initialScale: initialScaleAfter
                        })
                  : ''
              )
            })
          })
        })
      })

      test.describe('using default export', () => {
        test.describe('updating content attribute of viewport meta element', () => {
          test.describe('case where minWidth property is set in argument', () => {
            test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const width = 'device-width'
              const initialScale = 1
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  </head>
                  <body>
                    <script data-using-default-export data-min-width="${minWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale: documentClientWidth / minWidth
                      })
                    : convertToViewportContentString({ width, initialScale })
                  : ''
              )
            })
          })

          test.describe('case where maxWidth property is set in argument', () => {
            test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const width = 'device-width'
              const initialScale = 1
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  </head>
                  <body>
                    <script data-using-default-export data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && maxWidth < Infinity
                  ? documentClientWidth > maxWidth
                    ? convertToViewportContentString({
                        width: maxWidth,
                        initialScale: documentClientWidth / maxWidth
                      })
                    : convertToViewportContentString({ width, initialScale })
                  : ''
              )
            })
          })
        })

        // Following cases cannot be tested with vitest
        // Because vitest does not update size of document element when viewport element is updated
        // Run in only one format because purpose is to check library behavior, not to verify bundled code
        test.describe('comparison with minimum and maximum width, and computation of output initial scale', () => {
          // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
          test.describe('case where initial scale before running setContent is 1 or less', () => {
            test('width of viewport is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
              page,
              viewport
            }, testInfo) => {
              testInfo.skip(formatIndex !== 0)
              const { config } = testInfo
              const { projects } = config
              const width = 'device-width'
              const initialScaleBefore = 0.5
              const initialScaleAfter = 2
              const minWidth =
                (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                initialScaleBefore
              const maxWidth =
                (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity) / initialScaleBefore
              const documentClientWidth = viewport
                ? viewport.width / initialScaleBefore
                : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScaleBefore}" />
                  </head>
                  <body>
                    <script data-using-default-export data-initial-scale="${initialScaleAfter}" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale:
                          (documentClientWidth / minWidth) * initialScaleAfter
                      })
                    : documentClientWidth > maxWidth
                      ? convertToViewportContentString({
                          width: maxWidth,
                          initialScale:
                            (documentClientWidth / maxWidth) * initialScaleAfter
                        })
                      : convertToViewportContentString({
                          width,
                          initialScale: initialScaleAfter
                        })
                  : ''
              )
            })
          })

          // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
          test.describe('case where initial scale before running setContent is greater than 1', () => {
            test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
              page,
              viewport
            }, testInfo) => {
              testInfo.skip(formatIndex !== 0)
              const { config } = testInfo
              const { projects } = config
              const width = 'device-width'
              const initialScaleBefore = 2
              const initialScaleAfter = 0.5
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScaleBefore}" />
                  </head>
                  <body>
                    <script data-using-default-export data-initial-scale="${initialScaleAfter}" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale:
                          (documentClientWidth / minWidth) * initialScaleAfter
                      })
                    : documentClientWidth > maxWidth
                      ? convertToViewportContentString({
                          width: maxWidth,
                          initialScale:
                            (documentClientWidth / maxWidth) * initialScaleAfter
                        })
                      : convertToViewportContentString({
                          width,
                          initialScale: initialScaleAfter
                        })
                  : ''
              )
            })
          })
        })
      })
    } else {
      test.describe('using global variable', () => {
        test.describe('updating content attribute of viewport meta element', () => {
          test.describe('case where minWidth property is set in argument', () => {
            test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const width = 'device-width'
              const initialScale = 1
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-min-width="${minWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale: documentClientWidth / minWidth
                      })
                    : convertToViewportContentString({ width, initialScale })
                  : ''
              )
            })
          })

          test.describe('case where maxWidth property is set in argument', () => {
            test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const width = 'device-width'
              const initialScale = 1
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && maxWidth < Infinity
                  ? documentClientWidth > maxWidth
                    ? convertToViewportContentString({
                        width: maxWidth,
                        initialScale: documentClientWidth / maxWidth
                      })
                    : convertToViewportContentString({ width, initialScale })
                  : ''
              )
            })
          })
        })

        // Following cases cannot be tested with vitest
        // Because vitest does not update size of document element when viewport element is updated
        // Run in only one format because purpose is to check library behavior, not to verify bundled code
        test.describe('comparison with minimum and maximum width, and computation of output initial scale', () => {
          // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
          test.describe('case where initial scale before running setContent is 1 or less', () => {
            test('width of viewport is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
              page,
              viewport
            }, testInfo) => {
              testInfo.skip(formatIndex !== 0)
              const { config } = testInfo
              const { projects } = config
              const width = 'device-width'
              const initialScaleBefore = 0.5
              const initialScaleAfter = 2
              const minWidth =
                (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                initialScaleBefore
              const maxWidth =
                (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity) / initialScaleBefore
              const documentClientWidth = viewport
                ? viewport.width / initialScaleBefore
                : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScaleBefore}" />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-initial-scale="${initialScaleAfter}" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale:
                          (documentClientWidth / minWidth) * initialScaleAfter
                      })
                    : documentClientWidth > maxWidth
                      ? convertToViewportContentString({
                          width: maxWidth,
                          initialScale:
                            (documentClientWidth / maxWidth) * initialScaleAfter
                        })
                      : convertToViewportContentString({
                          width,
                          initialScale: initialScaleAfter
                        })
                  : ''
              )
            })
          })

          // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
          test.describe('case where initial scale before running setContent is greater than 1', () => {
            test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
              page,
              viewport
            }, testInfo) => {
              testInfo.skip(formatIndex !== 0)
              const { config } = testInfo
              const { projects } = config
              const width = 'device-width'
              const initialScaleBefore = 2
              const initialScaleAfter = 0.5
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=${width},initial-scale=${initialScaleBefore}" />
                    <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
                  </head>
                  <body>
                    <script data-initial-scale="${initialScaleAfter}" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? convertToViewportContentString({
                        width: minWidth,
                        initialScale:
                          (documentClientWidth / minWidth) * initialScaleAfter
                      })
                    : documentClientWidth > maxWidth
                      ? convertToViewportContentString({
                          width: maxWidth,
                          initialScale:
                            (documentClientWidth / maxWidth) * initialScaleAfter
                        })
                      : convertToViewportContentString({
                          width,
                          initialScale: initialScaleAfter
                        })
                  : ''
              )
            })
          })
        })
      })
    }
  })
})
