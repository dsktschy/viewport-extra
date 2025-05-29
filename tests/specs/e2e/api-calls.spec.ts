import { expect, test } from "@playwright/test";
import { getViewportSize } from "../../modules/PlaywrightFullProjectList.js";
import {
  getViewportContentString,
  waitForAssetScriptComplete,
} from "../../modules/PlaywrightPage.js";

for (const {
  immediate,
  extended,
  typescriptTarget,
  format,
  minified,
  outputScriptSrc,
  assetScriptSrc,
} of [
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es2022",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/es/call-apply.js",
  },
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es2022",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/cjs/call-apply.js",
  },
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es2022",
    format: "iife",
    minified: false,
    outputScriptSrc: "/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/iife/call-apply.js",
  },
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es2022",
    format: "iife",
    minified: true,
    outputScriptSrc: "/viewport-extra.min.js",
    assetScriptSrc: "/assets/scripts/e2e/iife/call-apply.js",
  },
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es5",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/es/es5/call-apply.js",
  },
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es5",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/cjs/es5/call-apply.js",
  },
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es5",
    format: "iife",
    minified: false,
    outputScriptSrc: "/es5/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/iife/es5/call-apply.js",
  },
  {
    immediate: false,
    extended: false,
    typescriptTarget: "es5",
    format: "iife",
    minified: true,
    outputScriptSrc: "/es5/viewport-extra.min.js",
    assetScriptSrc: "/assets/scripts/e2e/iife/es5/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es2022",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/extended/es/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es2022",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/extended/cjs/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es2022",
    format: "iife",
    minified: false,
    outputScriptSrc: "/extended/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/extended/iife/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es2022",
    format: "iife",
    minified: true,
    outputScriptSrc: "/extended/viewport-extra.min.js",
    assetScriptSrc: "/assets/scripts/e2e/extended/iife/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es5",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/extended/es/es5/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es5",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/extended/cjs/es5/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es5",
    format: "iife",
    minified: false,
    outputScriptSrc: "/extended/es5/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/extended/iife/es5/call-apply.js",
  },
  {
    immediate: false,
    extended: true,
    typescriptTarget: "es5",
    format: "iife",
    minified: true,
    outputScriptSrc: "/extended/es5/viewport-extra.min.js",
    assetScriptSrc: "/assets/scripts/e2e/extended/iife/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es2022",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/immediate/es/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es2022",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/immediate/cjs/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es2022",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/iife/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es2022",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/viewport-extra.min.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/iife/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es5",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/immediate/es/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es5",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/immediate/cjs/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es5",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/es5/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/iife/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: false,
    typescriptTarget: "es5",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/es5/viewport-extra.min.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/iife/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es2022",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/immediate/extended/es/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es2022",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc: "/assets/scripts/e2e/immediate/extended/cjs/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es2022",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/extended/viewport-extra.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/extended/iife/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es2022",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/extended/viewport-extra.min.js",
    assetScriptSrc: "/assets/scripts/e2e/immediate/extended/iife/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es5",
    format: "es",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/es/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es5",
    format: "cjs",
    minified: false,
    outputScriptSrc: "",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/cjs/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es5",
    format: "iife",
    minified: false,
    outputScriptSrc: "/immediate/extended/es5/viewport-extra.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/iife/es5/call-apply.js",
  },
  {
    immediate: true,
    extended: true,
    typescriptTarget: "es5",
    format: "iife",
    minified: true,
    outputScriptSrc: "/immediate/extended/es5/viewport-extra.min.js",
    assetScriptSrc:
      "/assets/scripts/e2e/immediate/extended/iife/es5/call-apply.js",
  },
]) {
  test.describe(`using ${minified ? "minified " : ""}${typescriptTarget} ${format} output for ${extended ? "extended " : ""}${immediate ? "immediate " : "root "}entry`, () => {
    test.describe("updating content attribute of viewport meta element", () => {
      test.beforeEach(async ({ page }) => {
        await page.goto("/tests/__fixtures__/src/dummy.html");
      });

      test.describe("case where content.minimumWidth and media properties is set in first argument", () => {
        test("width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width. Last minimumWidth in matching media queries is used", async ({
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
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                ${outputScriptSrc ? `<script src="${outputScriptSrc}"></script>` : ""}
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "minimumWidth": ${smViewportWidth} } },
                    { "content": { "minimumWidth": ${xlViewportWidth} }, "media": "(min-width: 640px)" }
                  ]
                `}'></script>
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

      test.describe("case where content.maximumWidth and media properties is set in first argument", () => {
        test("width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width. Last maximumWidth in matching media queries is used", async ({
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
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                ${outputScriptSrc ? `<script src="${outputScriptSrc}"></script>` : ""}
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "maximumWidth": ${xsViewportWidth} } },
                    { "content": { "maximumWidth": ${lgViewportWidth} }, "media": "(min-width: 640px)" }
                  ]
                `}'></script>
                <script src="${assetScriptSrc}" type="module" data-asset-script data-status="incomplete"></script>
              </body>
            </html>
          `);
          await waitForAssetScriptComplete(page);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth &&
              xsViewportWidth < Number.POSITIVE_INFINITY &&
              lgViewportWidth < Number.POSITIVE_INFINITY
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
