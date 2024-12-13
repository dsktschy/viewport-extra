import { expect, test } from '@playwright/test'
import { convertToViewportContentString } from '../modules/NumberStringRecord.js'
import { getViewportContentString } from '../modules/PlaywrightPage.js'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'
import { defaultContent } from '../../../src/lib/Content.js'

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
    test.describe('updating content attribute of viewport meta element', () => {
      test.describe('case where min-width are set in data-extra-content attribute of viewport meta element or content attribute of viewport-extra meta element', () => {
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
                <meta name="viewport-extra" content="min-width=${minWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
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

      test.describe('case where max-width are set in data-extra-content attribute of viewport meta element or content attribute of viewport-extra meta element', () => {
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
                <meta name="viewport-extra" content="max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
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
      test.describe('case where content attribute of viewport meta element is valid', () => {
        test('width of window without scroll bars when scale is 1 is used for comparison, and initial-scale in content attributes of viewport and viewport-extra meta elements is applied to output initial scale', async ({
          page,
          viewport
        }, testInfo) => {
          testInfo.skip(formatIndex !== 0)
          const { config } = testInfo
          const { projects } = config
          const width = 'device-width'
          const initialScale = 0.5
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
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}"/>
                <meta name="viewport-extra" content="min-width=${minWidth},max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
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

      test.describe('case where content attribute of viewport meta element is invalid', () => {
        test('width of window without scroll bars when scale is 1 is used for comparison, and default initialScale value of Content type is applied to output initial scale', async ({
          page,
          viewport
        }, testInfo) => {
          testInfo.skip(formatIndex !== 0)
          const { config } = testInfo
          const { projects } = config
          const { width, initialScale } = defaultContent
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
                <meta name="viewport" />
                <meta name="viewport-extra" content="min-width=${minWidth},max-width=${maxWidth}" />
                ${moduleFlag ? '' : `<script async src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
              </head>
              <body>
                ${moduleFlag ? `<script src="/assets/scripts/${format}/side_effects.js" type="module"></script>` : ''}
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
  })
})
