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
    test.describe('putting no viewport and viewport-extra meta elements', () => {
      test('viewport meta element is created', async ({ page }) => {
        const width = 'device-width'
        const initialScale = 1
        await page.setContent(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Document</title>
              ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
            </head>
            <body>
              ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
            </body>
          </html>
        `)
        expect(await getViewportContentString(page)).toBe(
          convertToViewportContentString({ width, initialScale })
        )
      })
    })

    test.describe('putting only viewport meta element', () => {
      test.describe('setting no min-width and max-width', () => {
        test('viewport content is not updated', async ({ page }) => {
          const width = 'device-width'
          const initialScale = 1
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            convertToViewportContentString({ width, initialScale })
          )
        })
      })

      test.describe('setting only min-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" data-extra-content="min-width=${minWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && minWidth > 0
              ? viewport.width < minWidth
                ? convertToViewportContentString({
                    width: minWidth,
                    initialScale: viewport.width / minWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting only max-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" data-extra-content="max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && maxWidth < Infinity
              ? viewport.width > maxWidth
                ? convertToViewportContentString({
                    width: maxWidth,
                    initialScale: viewport.width / maxWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting min-width and max-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && minWidth > 0 && maxWidth < Infinity
              ? viewport.width < minWidth
                ? convertToViewportContentString({
                    width: minWidth,
                    initialScale: viewport.width / minWidth
                  })
                : viewport.width > maxWidth
                  ? convertToViewportContentString({
                      width: maxWidth,
                      initialScale: viewport.width / maxWidth
                    })
                  : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })
    })

    test.describe('putting only viewport-extra meta element', () => {
      test.describe('setting no min-width and max-width', () => {
        test('viewport content is not updated', async ({ page }) => {
          const width = 'device-width'
          const initialScale = 1
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport-extra" content="width=${width},initial-scale=${initialScale}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            convertToViewportContentString({ width, initialScale })
          )
        })
      })

      test.describe('setting only min-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport-extra" content="width=${width},initial-scale=${initialScale},min-width=${minWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && minWidth > 0
              ? viewport.width < minWidth
                ? convertToViewportContentString({
                    width: minWidth,
                    initialScale: viewport.width / minWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting only max-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport-extra" content="width=${width},initial-scale=${initialScale},max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && maxWidth < Infinity
              ? viewport.width > maxWidth
                ? convertToViewportContentString({
                    width: maxWidth,
                    initialScale: viewport.width / maxWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting min-width and max-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport-extra" content="width=${width},initial-scale=${initialScale},min-width=${minWidth},max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && minWidth > 0 && maxWidth < Infinity
              ? viewport.width < minWidth
                ? convertToViewportContentString({
                    width: minWidth,
                    initialScale: viewport.width / minWidth
                  })
                : viewport.width > maxWidth
                  ? convertToViewportContentString({
                      width: maxWidth,
                      initialScale: viewport.width / maxWidth
                    })
                  : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })
    })

    test.describe('putting viewport and viewport-extra meta elements', () => {
      test.describe('setting only min-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                <meta name="viewport-extra" content="min-width=${minWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && minWidth > 0
              ? viewport.width < minWidth
                ? convertToViewportContentString({
                    width: minWidth,
                    initialScale: viewport.width / minWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting only max-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                <meta name="viewport-extra" content="max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && maxWidth < Infinity
              ? viewport.width > maxWidth
                ? convertToViewportContentString({
                    width: maxWidth,
                    initialScale: viewport.width / maxWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting min-width and max-width', () => {
        test('viewport content is updated to correct values', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
                <meta name="viewport-extra" content="min-width=${minWidth},max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/first_run.js" type="module"></script>` : ''}
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            viewport && minWidth > 0 && maxWidth < Infinity
              ? viewport.width < minWidth
                ? convertToViewportContentString({
                    width: minWidth,
                    initialScale: viewport.width / minWidth
                  })
                : viewport.width > maxWidth
                  ? convertToViewportContentString({
                      width: maxWidth,
                      initialScale: viewport.width / maxWidth
                    })
                  : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })
    })
  })
})
