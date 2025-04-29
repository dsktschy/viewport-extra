import { expect, test } from "@playwright/test";
import { getMaximumWidthViewportSize } from "../modules/PlaywrightFullProjectList.js";
import {
  getViewportContentString,
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
            ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
          </head>
          <body>
            <script data-content-after-update-reference='{ "minWidth": ${maxViewportWidthPlusOne} }'></script>
            <script src="/assets/scripts/${assetSubDirectory}using_updateReference.js" type="module" data-asset-script data-status="incomplete"></script>
          </body>
        </html>
      `);
      await waitForAssetScriptComplete(page);
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
