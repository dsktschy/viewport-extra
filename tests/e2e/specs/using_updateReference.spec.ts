import { expect, test } from "@playwright/test";
import { getMaximumWidthViewportSize } from "../modules/PlaywrightFullProjectList.js";
import { getViewportContentString } from "../modules/PlaywrightPage.js";

for (const { format, moduleFlag, minified } of [
  { format: "es", moduleFlag: true, minified: false },
  { format: "cjs", moduleFlag: true, minified: false },
  { format: "iife", moduleFlag: false, minified: false },
  { format: "iife", moduleFlag: false, minified: true },
]) {
  test.describe(`using ${(minified ? "minified " : "") + format} output`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
    });

    test("reference to viewport meta element is updated", async ({
      page,
      viewport,
    }, { config: { projects } }) => {
      const maxViewportWidth = getMaximumWidthViewportSize(projects).width;
      const maxViewportWidthPlusOne = maxViewportWidth
        ? maxViewportWidth + 1
        : 0;
      const documentClientWidth = viewport ? viewport.width : undefined;
      await page.setContent(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Document</title>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            ${moduleFlag ? "" : `<script src="/viewport-extra${minified ? ".min" : ""}.js"></script>`}
          </head>
          <body>
            <script data-content-after-update-reference='{ "minWidth": ${maxViewportWidthPlusOne} }'></script>
            <script src="/assets/scripts/${format}/using_updateReference.js" type="module"></script>
          </body>
        </html>
      `);
      expect(await getViewportContentString(page)).toBe(
        documentClientWidth && maxViewportWidthPlusOne > 0
          ? documentClientWidth < maxViewportWidthPlusOne
            ? `initial-scale=${(documentClientWidth / maxViewportWidthPlusOne) * 1},width=${maxViewportWidthPlusOne}`
            : "initial-scale=1,width=device-width"
          : "",
      );
    });
  });
}
