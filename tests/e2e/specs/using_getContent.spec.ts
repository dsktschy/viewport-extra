import { expect, test } from "@playwright/test";
import { getViewportSize } from "../modules/PlaywrightFullProjectList.js";
import {
  getGetContentResultString,
  waitForAssetScriptComplete,
} from "../modules/PlaywrightPage.js";

for (const {
  typescriptTarget,
  format,
  moduleFlag,
  minified,
  outputSubDirectory,
  assetSubDirectory,
} of [
  {
    typescriptTarget: "es2022",
    format: "es",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "",
    assetSubDirectory: "es/",
  },
  {
    typescriptTarget: "es2022",
    format: "cjs",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "",
    assetSubDirectory: "cjs/",
  },
  {
    typescriptTarget: "es2022",
    format: "iife",
    moduleFlag: false,
    minified: false,
    outputSubDirectory: "",
    assetSubDirectory: "iife/",
  },
  {
    typescriptTarget: "es2022",
    format: "iife",
    moduleFlag: false,
    minified: true,
    outputSubDirectory: "",
    assetSubDirectory: "iife/",
  },
  {
    typescriptTarget: "es5",
    format: "es",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "es5/",
    assetSubDirectory: "es/es5/",
  },
  {
    typescriptTarget: "es5",
    format: "cjs",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "es5/",
    assetSubDirectory: "cjs/es5/",
  },
  {
    typescriptTarget: "es5",
    format: "iife",
    moduleFlag: false,
    minified: false,
    outputSubDirectory: "es5/",
    assetSubDirectory: "iife/es5/",
  },
  {
    typescriptTarget: "es5",
    format: "iife",
    moduleFlag: false,
    minified: true,
    outputSubDirectory: "es5/",
    assetSubDirectory: "iife/es5/",
  },
]) {
  test.describe(`using ${minified ? "minified " : ""}${typescriptTarget} ${format} output`, () => {
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
            ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
          </head>
          <body>
            <script data-get-content-result></script>
            <script src="/assets/scripts/${assetSubDirectory}using_getContent.js" type="module" data-asset-script data-status="incomplete"></script>
          </body>
        </html>
      `);
      await waitForAssetScriptComplete(page);
      expect(await getGetContentResultString(page)).toBe(
        `{"initialScale":1,"maxWidth":${lgViewportWidth},"minWidth":${smViewportWidth},"width":"device-width"}`,
      );
    });
  });
}
