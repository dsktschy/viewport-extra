import { expect, test } from "@playwright/test";
import { getViewportSize } from "../../modules/PlaywrightFullProjectList.js";
import {
  getViewportContentString,
  waitForAssetScriptComplete,
} from "../../modules/PlaywrightPage.js";

for (const {
  extended,
  typescriptTarget,
  format,
  minified,
  outputScriptSrc,
  assetScriptSrc,
} of [
  {
    extended: false,
    typescriptTarget: "es2021",
    format: "es",
    minified: false,
    outputScriptSrc: "/immediate/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/es/trigger-side-effects.js",
  },
  {
    extended: false,
    typescriptTarget: "es2021",
    format: "cjs",
    minified: false,
    outputScriptSrc: "/immediate/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/cjs/trigger-side-effects.js",
  },
  {
    extended: false,
    typescriptTarget: "es2021",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/iife/trigger-side-effects.js",
  },
  {
    extended: false,
    typescriptTarget: "es2021",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/viewport-extra.min.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/iife/trigger-side-effects.js",
  },
  {
    extended: false,
    typescriptTarget: "es5",
    format: "es",
    minified: false,
    outputScriptSrc: "/immediate/es5/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/es/es5/trigger-side-effects.js",
  },
  {
    extended: false,
    typescriptTarget: "es5",
    format: "cjs",
    minified: false,
    outputScriptSrc: "/immediate/es5/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/cjs/es5/trigger-side-effects.js",
  },
  {
    extended: false,
    typescriptTarget: "es5",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/es5/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/iife/es5/trigger-side-effects.js",
  },
  {
    extended: false,
    typescriptTarget: "es5",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/es5/viewport-extra.min.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/iife/es5/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es2021",
    format: "es",
    minified: false,
    outputScriptSrc: "/immediate/extended/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/es/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es2021",
    format: "cjs",
    minified: false,
    outputScriptSrc: "/immediate/extended/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/cjs/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es2021",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/extended/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/iife/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es2021",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/extended/viewport-extra.min.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/iife/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es5",
    format: "es",
    minified: false,
    outputScriptSrc: "/immediate/extended/es5/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/es/es5/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es5",
    format: "cjs",
    minified: false,
    outputScriptSrc: "/immediate/extended/es5/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/cjs/es5/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es5",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/extended/es5/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/iife/es5/trigger-side-effects.js",
  },
  {
    extended: true,
    typescriptTarget: "es5",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/extended/es5/viewport-extra.min.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/iife/es5/trigger-side-effects.js",
  },
]) {
  test.describe(`using ${minified ? "minified " : ""}${typescriptTarget} ${format} output for ${extended ? "extended " : ""}immediate entry`, () => {
    test.describe("updating content attribute of viewport meta element", () => {
      test.beforeEach(async ({ page }) => {
        await page.goto("/tests/__fixtures__/src/dummy.html");
      });

      test.describe("case where (data-extra-)content attribute with minimum-width, data-(extra-)media attribute are set in viewport(-extra) meta element", () => {
        test("width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width. Last minimum-width in matching media queries is used", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
          const xlViewportWidth =
            getViewportSize(projects, "xl")?.use.viewport?.width ?? 0;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <meta name="viewport-extra" content="minimum-width=${smViewportWidth}">
                <meta name="viewport-extra" content="minimum-width=${xlViewportWidth}" data-media="(min-width: 640px)">
                ${outputScriptSrc ? `<script src="${outputScriptSrc}"></script>` : ""}
              </head>
              <body>
                <script src="${assetScriptSrc}" type="module" data-asset-script data-status="incomplete"></script>
              </body>
            </html>
          `);
          await waitForAssetScriptComplete(page);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0 && xlViewportWidth > 0
              ? documentClientWidth < 640
                ? documentClientWidth < smViewportWidth
                  ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                  : "initial-scale=1,width=device-width"
                : documentClientWidth < xlViewportWidth
                  ? `initial-scale=${(documentClientWidth / xlViewportWidth) * 1},width=${xlViewportWidth}`
                  : "initial-scale=1,width=device-width"
              : "",
          );
        });
      });

      test.describe("case where (data-extra-)content attribute with maximum-width, data-(extra-)media attribute are set in viewport(-extra) meta element", () => {
        test("width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width. Last maximum-width in matching media queries is used", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const xsViewportWidth =
            getViewportSize(projects, "xs")?.use.viewport?.width ?? 0;
          const lgViewportWidth =
            getViewportSize(projects, "lg")?.use.viewport?.width ?? 0;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <meta name="viewport-extra" content="maximum-width=${xsViewportWidth}">
                <meta name="viewport-extra" content="maximum-width=${lgViewportWidth}" data-media="(min-width: 640px)">
                ${outputScriptSrc ? `<script src="${outputScriptSrc}"></script>` : ""}
              </head>
              <body>
                <script src="${assetScriptSrc}" type="module" data-asset-script data-status="incomplete"></script>
              </body>
            </html>
          `);
          await waitForAssetScriptComplete(page);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth &&
              xsViewportWidth < Infinity &&
              lgViewportWidth < Infinity
              ? documentClientWidth < 640
                ? documentClientWidth > xsViewportWidth
                  ? `initial-scale=${(documentClientWidth / xsViewportWidth) * 1},width=${xsViewportWidth}`
                  : "initial-scale=1,width=device-width"
                : documentClientWidth > lgViewportWidth
                  ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 1},width=${lgViewportWidth}`
                  : "initial-scale=1,width=device-width"
              : "",
          );
        });
      });
    });
  });
}
