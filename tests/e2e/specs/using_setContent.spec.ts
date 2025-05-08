import { expect, test } from "@playwright/test";
import { getViewportSize } from "../modules/PlaywrightFullProjectList.js";
import {
  getViewportContentString,
  waitForAssetScriptComplete,
} from "../modules/PlaywrightPage.js";
[
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
].forEach(
  (
    {
      typescriptTarget,
      format,
      moduleFlag,
      minified,
      outputSubDirectory,
      assetSubDirectory,
    },
    outputIndex,
  ) => {
    test.describe(`using ${minified ? "minified " : ""}${typescriptTarget} ${format} output`, () => {
      test.describe("updating content attribute of viewport meta element", () => {
        test.beforeEach(async ({ page }) => {
          await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
        });

        test.describe("case where minWidth property is set in argument", () => {
          test("width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const smViewportWidth =
              getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
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
                  <script data-content='{ "minWidth": ${smViewportWidth} }'></script>
                  <script src="/assets/scripts/${assetSubDirectory}using_setContent.js" type="module" data-asset-script data-status="incomplete"></script>
                </body>
              </html>
            `);
            await waitForAssetScriptComplete(page);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && smViewportWidth > 0
                ? documentClientWidth < smViewportWidth
                  ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                  : "initial-scale=1,width=device-width"
                : "",
            );
          });
        });

        test.describe("case where maxWidth property is set in argument", () => {
          test("width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const lgViewportWidth =
              getViewportSize(projects, "lg")?.use.viewport?.width ??
              Number.POSITIVE_INFINITY;
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
                  <script data-content='{ "maxWidth": ${lgViewportWidth} }'></script>
                  <script src="/assets/scripts/${assetSubDirectory}using_setContent.js" type="module" data-asset-script data-status="incomplete"></script>
                </body>
              </html>
            `);
            await waitForAssetScriptComplete(page);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && lgViewportWidth < Number.POSITIVE_INFINITY
                ? documentClientWidth > lgViewportWidth
                  ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 1},width=${lgViewportWidth}`
                  : "initial-scale=1,width=device-width"
                : "",
            );
          });
        });
      });

      test.describe("behavior according to properties that cannot be specified with arguments", () => {
        // Following cases cannot be tested with Vitest,
        // as it does not provide matchMedia method
        test.describe("media property", () => {
          // Run only in minimal outputs and viewports
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(outputIndex !== 0);
            testInfo.skip(!["xs"].includes(testInfo.project.name));
            await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
          });

          test("argument is always used for computing", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const smViewportWidth =
              getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
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
                  <script data-content='{ "minWidth": ${smViewportWidth} }'></script>
                  <script src="/assets/scripts/${assetSubDirectory}using_setContent.js" type="module" data-asset-script data-status="incomplete"></script>
                </body>
              </html>
            `);
            await waitForAssetScriptComplete(page);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && smViewportWidth > 0
                ? documentClientWidth < smViewportWidth
                  ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                  : "initial-scale=1,width=device-width"
                : "",
            );
          });
        });

        // Following cases cannot be tested with Vitest,
        // as it does not update size of document element when viewport meta element is updated
        test.describe("unscaledComputing property", () => {
          // Run only in minimal outputs and viewports
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(outputIndex !== 0);
            testInfo.skip(!["xs", "xl"].includes(testInfo.project.name));
            await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
          });

          test.describe("case where initial-scale before running setContent is 1 or less", () => {
            test("viewport width is used for comparison with minWidth and maxWidth", async ({
              page,
              viewport,
            }, { config: { projects } }) => {
              const smViewportWidth =
                (getViewportSize(projects, "sm")?.use.viewport?.width ?? 0) /
                0.5;
              const lgViewportWidth =
                (getViewportSize(projects, "lg")?.use.viewport?.width ??
                  Number.POSITIVE_INFINITY) / 0.5;
              const documentClientWidth = viewport
                ? viewport.width / 0.5
                : undefined;
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script data-content='{ "initialScale": 2, "minWidth": ${smViewportWidth}, "maxWidth": ${lgViewportWidth} }'></script>
                    <script src="/assets/scripts/${assetSubDirectory}using_setContent.js" type="module" data-asset-script data-status="incomplete"></script>
                  </body>
                </html>
              `);
              await waitForAssetScriptComplete(page);
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth &&
                  smViewportWidth > 0 &&
                  lgViewportWidth < Number.POSITIVE_INFINITY
                  ? documentClientWidth < smViewportWidth
                    ? `initial-scale=${(documentClientWidth / smViewportWidth) * 2},width=${smViewportWidth}`
                    : documentClientWidth > lgViewportWidth
                      ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 2},width=${lgViewportWidth}`
                      : "initial-scale=2,width=device-width"
                  : "",
              );
            });
          });

          test.describe("case where initial-scale before running setContent is greater than 1", () => {
            test("window width without scroll bars when scale is 1 is used for comparison with minWidth and maxWidth", async ({
              page,
              viewport,
            }, { config: { projects } }) => {
              const smViewportWidth =
                getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
              const lgViewportWidth =
                getViewportSize(projects, "lg")?.use.viewport?.width ??
                Number.POSITIVE_INFINITY;
              const documentClientWidth = viewport ? viewport.width : undefined;
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=2" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script data-content='{ "initialScale": 0.5, "minWidth": ${smViewportWidth}, "maxWidth": ${lgViewportWidth} }'></script>
                    <script src="/assets/scripts/${assetSubDirectory}using_setContent.js" type="module" data-asset-script data-status="incomplete"></script>
                  </body>
                </html>
              `);
              await waitForAssetScriptComplete(page);
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth &&
                  smViewportWidth > 0 &&
                  lgViewportWidth < Number.POSITIVE_INFINITY
                  ? documentClientWidth < smViewportWidth
                    ? `initial-scale=${(documentClientWidth / smViewportWidth) * 0.5},width=${smViewportWidth}`
                    : documentClientWidth > lgViewportWidth
                      ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 0.5},width=${lgViewportWidth}`
                      : "initial-scale=0.5,width=device-width"
                  : "",
              );
            });
          });
        });
      });
    });
  },
);
