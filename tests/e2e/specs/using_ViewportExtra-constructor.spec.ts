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
].forEach(({ format, moduleFlag, minified }) => {
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    test.describe('using number argument', () => {
      test('viewport content is updated to correct values', async ({
        page,
        viewport
      }, { config: { projects } }) => {
        const width = 'device-width'
        const initialScale = 0.5
        const minWidth =
          (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
          initialScale
        const documentClientWidth = viewport
          ? viewport.width / initialScale
          : undefined
        await page.setContent(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Document</title>
              <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
              ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
            </head>
            <body>
              <script data-using-number-argument data-min-width="${minWidth}"></script>
              <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
            </body>
          </html>
        `)
        expect(await getViewportContentString(page)).toBe(
          documentClientWidth && minWidth > 0
            ? documentClientWidth < minWidth
              ? convertToViewportContentString({
                  width: minWidth,
                  initialScale: (documentClientWidth / minWidth) * initialScale
                })
              : convertToViewportContentString({ width, initialScale })
            : ''
        )
      })
    })

    test.describe('using object argument', () => {
      test.describe('setting min-width', () => {
        test.describe('setting initial-scale', () => {
          test('viewport content is updated to correct values', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const width = 'device-width'
            const initialScaleBeforeSetContent = 1
            const initialScaleAfterSetContent = 0.5
            const minWidth =
              (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
              initialScaleBeforeSetContent
            const documentClientWidth = viewport
              ? viewport.width / initialScaleBeforeSetContent
              : undefined
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScaleBeforeSetContent}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script data-initial-scale="${initialScaleAfterSetContent}" data-min-width="${minWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && minWidth > 0
                ? documentClientWidth < minWidth
                  ? convertToViewportContentString({
                      width: minWidth,
                      initialScale:
                        (documentClientWidth / minWidth) *
                        initialScaleAfterSetContent
                    })
                  : convertToViewportContentString({
                      width,
                      initialScale: initialScaleAfterSetContent
                    })
                : ''
            )
          })
        })

        test.describe('not setting initial-scale', () => {
          test('viewport content is updated to correct values', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const width = 'device-width'
            const initialScale = 0.5
            const minWidth =
              (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
              initialScale
            const documentClientWidth = viewport
              ? viewport.width / initialScale
              : undefined
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script data-min-width="${minWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && minWidth > 0
                ? documentClientWidth < minWidth
                  ? convertToViewportContentString({
                      width: minWidth,
                      initialScale:
                        (documentClientWidth / minWidth) * initialScale
                    })
                  : convertToViewportContentString({ width, initialScale })
                : ''
            )
          })
        })
      })

      test.describe('setting max-width', () => {
        test.describe('setting initial-scale', () => {
          test('viewport content is updated to correct values', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const width = 'device-width'
            const initialScaleBeforeSetContent = 1
            const initialScaleAfterSetContent = 0.5
            const maxWidth =
              (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                Infinity) / initialScaleBeforeSetContent
            const documentClientWidth = viewport
              ? viewport.width / initialScaleBeforeSetContent
              : undefined
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScaleBeforeSetContent}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script data-initial-scale="${initialScaleAfterSetContent}" data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && maxWidth < Infinity
                ? documentClientWidth > maxWidth
                  ? convertToViewportContentString({
                      width: maxWidth,
                      initialScale:
                        (documentClientWidth / maxWidth) *
                        initialScaleAfterSetContent
                    })
                  : convertToViewportContentString({
                      width,
                      initialScale: initialScaleAfterSetContent
                    })
                : ''
            )
          })
        })

        test.describe('not setting initial-scale', () => {
          test('viewport content is updated to correct values', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const width = 'device-width'
            const initialScale = 0.5
            const maxWidth =
              (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                Infinity) / initialScale
            const documentClientWidth = viewport
              ? viewport.width / initialScale
              : undefined
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && maxWidth < Infinity
                ? documentClientWidth > maxWidth
                  ? convertToViewportContentString({
                      width: maxWidth,
                      initialScale:
                        (documentClientWidth / maxWidth) * initialScale
                    })
                  : convertToViewportContentString({ width, initialScale })
                : ''
            )
          })
        })
      })

      test.describe('setting min-width and max-width', () => {
        test.describe('setting initial-scale', () => {
          test('viewport content is updated to correct values', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const width = 'device-width'
            const initialScaleBeforeSetContent = 1
            const initialScaleAfterSetContent = 0.5
            const minWidth =
              (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
              initialScaleBeforeSetContent
            const maxWidth =
              (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                Infinity) / initialScaleBeforeSetContent
            const documentClientWidth = viewport
              ? viewport.width / initialScaleBeforeSetContent
              : undefined
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScaleBeforeSetContent}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script data-initial-scale="${initialScaleAfterSetContent}" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && minWidth > 0 && maxWidth < Infinity
                ? documentClientWidth < minWidth
                  ? convertToViewportContentString({
                      width: minWidth,
                      initialScale:
                        (documentClientWidth / minWidth) *
                        initialScaleAfterSetContent
                    })
                  : documentClientWidth > maxWidth
                    ? convertToViewportContentString({
                        width: maxWidth,
                        initialScale:
                          (documentClientWidth / maxWidth) *
                          initialScaleAfterSetContent
                      })
                    : convertToViewportContentString({
                        width,
                        initialScale: initialScaleAfterSetContent
                      })
                : ''
            )
          })
        })

        test.describe('not setting initial-scale', () => {
          test('viewport content is updated to correct values', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const width = 'device-width'
            const initialScale = 0.5
            const minWidth =
              (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
              initialScale
            const maxWidth =
              (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                Infinity) / initialScale
            const documentClientWidth = viewport
              ? viewport.width / initialScale
              : undefined
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && minWidth > 0 && maxWidth < Infinity
                ? documentClientWidth < minWidth
                  ? convertToViewportContentString({
                      width: minWidth,
                      initialScale:
                        (documentClientWidth / minWidth) * initialScale
                    })
                  : documentClientWidth > maxWidth
                    ? convertToViewportContentString({
                        width: maxWidth,
                        initialScale:
                          (documentClientWidth / maxWidth) * initialScale
                      })
                    : convertToViewportContentString({ width, initialScale })
                : ''
            )
          })
        })
      })

      test.describe('not setting min-width and max-width', () => {
        test.describe('setting initial-scale', () => {
          test('viewport content is updated to correct values', async ({
            page
          }, testInfo) => {
            const { project, config } = testInfo
            testInfo.skip(project !== config.projects[0])
            const width = 'device-width'
            const initialScaleBeforeSetContent = 1
            const initialScaleAfterSetContent = 0.5
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScaleBeforeSetContent}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script data-initial-scale="${initialScaleAfterSetContent}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              convertToViewportContentString({
                width,
                initialScale: initialScaleAfterSetContent
              })
            )
          })
        })

        test.describe('not setting initial-scale', () => {
          test('viewport content is not updated', async ({
            page
          }, testInfo) => {
            const { project, config } = testInfo
            testInfo.skip(project !== config.projects[0])
            const width = 'device-width'
            const initialScale = 0.5
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                  ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                </head>
                <body>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              convertToViewportContentString({ width, initialScale })
            )
          })
        })
      })
    })
  })
})
