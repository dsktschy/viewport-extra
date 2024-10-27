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
      test('width and initial-scale are updated in viewports less than min-width', async ({
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
                  initialScale: documentClientWidth / minWidth
                })
              : convertToViewportContentString({ width, initialScale })
            : ''
        )
      })
    })

    test.describe('using object argument', () => {
      test.describe('setting min-width', () => {
        test('width and initial-scale are updated in viewports less than min-width', async ({
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
                    initialScale: documentClientWidth / minWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting max-width', () => {
        test('width and initial-scale are updated in viewports greater than max-width', async ({
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
                    initialScale: documentClientWidth / maxWidth
                  })
                : convertToViewportContentString({ width, initialScale })
              : ''
          )
        })
      })

      test.describe('setting min-width and max-width', () => {
        test('width and initial-scale are updated in viewports less than min-width and viewports greater than max-width', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const width = 'device-width'
          const initialScale = 1
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
                    initialScale: documentClientWidth / minWidth
                  })
                : documentClientWidth > maxWidth
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
  })
})
