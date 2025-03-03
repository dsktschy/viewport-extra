import { expect, test } from "@playwright/test";
import { getViewportSize } from "../modules/PlaywrightFullProjectList.js";
import { getGetContentResultString } from "../modules/PlaywrightPage.js";

for (const { format, moduleFlag, minified } of [
  { format: "esm", moduleFlag: true, minified: false },
  { format: "cjs", moduleFlag: true, minified: false },
  { format: "iife", moduleFlag: false, minified: false },
  { format: "iife", moduleFlag: false, minified: true },
]) {
  test.describe(`using ${(minified ? "minified " : "") + format} output`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
    });

    test("Content object used to update content attribute of viewport meta element is gotten if no media queries are specified", async ({
      page,
    }, { config: { projects } }) => {
      const smViewportWidth =
        getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
      const lgViewportWidth =
        getViewportSize(projects, "lg")?.use.viewport?.width ??
        Number.POSITIVE_INFINITY;
      await page.setContent(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Document</title>
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${smViewportWidth},max-width=${lgViewportWidth}" />
            ${moduleFlag ? "" : `<script src="/viewport-extra${minified ? ".min" : ""}.js"></script>`}
          </head>
          <body>
            <script data-get-content-result></script>
            <script src="/assets/scripts/${format}/using_getContent.js" type="module"></script>
          </body>
        </html>
      `);
      expect(await getGetContentResultString(page)).toBe(
        `{"initialScale":1,"maxWidth":${lgViewportWidth},"minWidth":${smViewportWidth},"width":"device-width"}`,
      );
    });
  });
}
