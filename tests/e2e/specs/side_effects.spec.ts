import { expect, test } from "@playwright/test";
import { getViewportSize } from "../modules/PlaywrightFullProjectList.js";
import {
  getViewportContentString,
  waitForAssetScriptComplete,
} from "../modules/PlaywrightPage.js";
[
  {
    entryName: "immediate",
    typescriptTarget: "es2022",
    format: "es",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "immediate/",
    assetSubDirectory: "immediate/es/",
  },
  {
    entryName: "immediate",
    typescriptTarget: "es2022",
    format: "cjs",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "immediate/",
    assetSubDirectory: "immediate/cjs/",
  },
  {
    entryName: "immediate",
    typescriptTarget: "es2022",
    format: "iife",
    moduleFlag: false,
    minified: false,
    outputSubDirectory: "immediate/",
    assetSubDirectory: "immediate/iife/",
  },
  {
    entryName: "immediate",
    typescriptTarget: "es2022",
    format: "iife",
    moduleFlag: false,
    minified: true,
    outputSubDirectory: "immediate/",
    assetSubDirectory: "immediate/iife/",
  },
  {
    entryName: "immediate",
    typescriptTarget: "es5",
    format: "es",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "immediate/es5/",
    assetSubDirectory: "immediate/es/es5/",
  },
  {
    entryName: "immediate",
    typescriptTarget: "es5",
    format: "cjs",
    moduleFlag: true,
    minified: false,
    outputSubDirectory: "immediate/es5/",
    assetSubDirectory: "immediate/cjs/es5/",
  },
  {
    entryName: "immediate",
    typescriptTarget: "es5",
    format: "iife",
    moduleFlag: false,
    minified: false,
    outputSubDirectory: "immediate/es5/",
    assetSubDirectory: "immediate/iife/es5/",
  },
  {
    entryName: "immediate",
    typescriptTarget: "es5",
    format: "iife",
    moduleFlag: false,
    minified: true,
    outputSubDirectory: "immediate/es5/",
    assetSubDirectory: "immediate/iife/es5/",
  },
].forEach(
  (
    {
      entryName,
      typescriptTarget,
      format,
      moduleFlag,
      minified,
      outputSubDirectory,
      assetSubDirectory,
    },
    outputIndex,
  ) => {
    test.describe(`using ${minified ? "minified " : ""}${typescriptTarget} ${format} output for ${entryName} entry`, () => {
      test.describe("updating content attribute of viewport meta element", () => {
        test.beforeEach(async ({ page }) => {
          await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
        });

        test.describe("case where (data-extra-)content attribute with min-width, data-(extra-)media attribute, and data-(extra-)decimal-places attribute are set in viewport(-extra) meta element", () => {
          test("width is updated to minimum width and initial-scale is updated to value with specified decimal places that fits minimum width into viewport, on browser whose viewport width is less than minimum width. Last min-width in matching media queries is used", async ({
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
                  <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-decimal-places="6" />
                  <meta name="viewport-extra" content="min-width=${smViewportWidth}" />
                  <meta name="viewport-extra" content="min-width=${xlViewportWidth}" data-media="(min-width: 640px)" />
                  ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
                </body>
              </html>
            `);
            await waitForAssetScriptComplete(page);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && smViewportWidth > 0 && xlViewportWidth > 0
                ? documentClientWidth < 640
                  ? documentClientWidth < smViewportWidth
                    ? `initial-scale=${Math.trunc((documentClientWidth / smViewportWidth) * 1 * 10 ** 6) / 10 ** 6},width=${smViewportWidth}`
                    : "initial-scale=1,width=device-width"
                  : documentClientWidth < xlViewportWidth
                    ? `initial-scale=${Math.trunc((documentClientWidth / xlViewportWidth) * 1 * 10 ** 6) / 10 ** 6},width=${xlViewportWidth}`
                    : "initial-scale=1,width=device-width"
                : "",
            );
          });
        });

        test.describe("case where (data-extra-)content attribute with max-width, data-(extra-)media attribute, and data-(extra-)decimal-places attribute are set in viewport(-extra) meta element", () => {
          test("width is updated to maximum width and initial-scale is updated to value with specified decimal places that fits maximum width into viewport, on browser whose viewport width is greater than maximum width. Last max-width in matching media queries is used", async ({
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
                  <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-decimal-places="6" />
                  <meta name="viewport-extra" content="max-width=${xsViewportWidth}" />
                  <meta name="viewport-extra" content="max-width=${lgViewportWidth}" data-media="(min-width: 640px)" />
                  ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
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
                    ? `initial-scale=${Math.trunc((documentClientWidth / xsViewportWidth) * 1 * 10 ** 6) / 10 ** 6},width=${xsViewportWidth}`
                    : "initial-scale=1,width=device-width"
                  : documentClientWidth > lgViewportWidth
                    ? `initial-scale=${Math.trunc((documentClientWidth / lgViewportWidth) * 1 * 10 ** 6) / 10 ** 6},width=${lgViewportWidth}`
                    : "initial-scale=1,width=device-width"
                : "",
            );
          });
        });
      });
    });

    // Run only in minimal outputs
    if (outputIndex !== 0) return;
    // Following cases cannot be tested with Vitest
    test.describe("activateMetaElements", () => {
      test.describe("behavior according to attributes of viewport(-extra) meta elements", () => {
        // In Vitest, size of document element is not updated when viewport meta element is updated
        test.describe("(data-extra-)content attribute", () => {
          // Run only in minimal viewports
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(!["xs", "xl"].includes(testInfo.project.name));
            await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
          });

          test.describe("case where initial-scale before running activateMetaElements is 1 or less", () => {
            test("window width without scroll bars when scale is 1 is used for comparison with min-width and max-width", async ({
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
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-content="min-width=${smViewportWidth},max-width=${lgViewportWidth}" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
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

          test.describe("case where initial-scale before running activateMetaElements is greater than 1", () => {
            test("window width without scroll bars when scale is 1 is used for comparison with min-width and max-width", async ({
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
                    <meta name="viewport" content="width=device-width,initial-scale=2" data-extra-content="min-width=${smViewportWidth},max-width=${lgViewportWidth}" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
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
        });

        // In Vitest, matchMedia method is not provided
        test.describe("data-(extra-)media attribute", () => {
          // Run only in minimal viewports
          test.beforeEach(async ({ page }, testInfo) => {
            testInfo.skip(!["xs"].includes(testInfo.project.name));
            await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
          });

          test.describe("case where value is media query that matches viewport width", () => {
            test("(data-extra-)content attribute of same element is used for computing", async ({
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
                    <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${smViewportWidth}" data-extra-media="(max-width: ${smViewportWidth}px)" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
                  </body>
                </html>
              `);
              await waitForAssetScriptComplete(page);
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && smViewportWidth > 0
                  ? documentClientWidth <= smViewportWidth
                    ? documentClientWidth < smViewportWidth
                      ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                      : "initial-scale=1,width=device-width"
                    : "initial-scale=1,width=device-width"
                  : "",
              );
            });
          });

          test.describe("case where value is media query that does not match viewport width", () => {
            test("(data-extra-)content attribute of same element is not used for computing", async ({
              page,
              viewport,
            }, { config: { projects } }) => {
              const lgViewportWidth =
                getViewportSize(projects, "lg")?.use.viewport?.width ?? 0;
              const xlViewportWidth =
                getViewportSize(projects, "xl")?.use.viewport?.width ?? 0;
              const documentClientWidth = viewport ? viewport.width : undefined;
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${xlViewportWidth}" data-extra-media="(min-width: ${lgViewportWidth}px)" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
                  </body>
                </html>
              `);
              await waitForAssetScriptComplete(page);
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && xlViewportWidth > 0
                  ? documentClientWidth >= lgViewportWidth
                    ? documentClientWidth < xlViewportWidth
                      ? `initial-scale=${(documentClientWidth / xlViewportWidth) * 1},width=${xlViewportWidth}`
                      : "initial-scale=1,width=device-width"
                    : "initial-scale=1,width=device-width"
                  : "",
              );
            });
          });

          test.describe("case where attribute is not set", () => {
            test("(data-extra-)content attribute of same element is used for computing", async ({
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
                    <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${smViewportWidth}" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
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
        });
      });

      // In Vitest, matchMedia method is not provided
      test.describe("determination of value to apply from multiple viewport(-extra) meta elements", () => {
        // Run only in minimal viewports
        test.beforeEach(async ({ page }, testInfo) => {
          testInfo.skip(!["xs"].includes(testInfo.project.name));
          await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
        });

        test.describe("(data-extra-)content attributes", () => {
          test.describe("case where media attributes are set", () => {
            test("filtering elements whose data-(extra-)media attribute matches viewport width from all viewport and viewport-extra meta elements, and merging only their attributes recursively", async ({
              page,
              viewport,
            }, { config: { projects } }) => {
              const smViewportWidth =
                getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
              const lgViewportWidth =
                getViewportSize(projects, "lg")?.use.viewport?.width ?? 0;
              const documentClientWidth = viewport ? viewport.width : undefined;
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1" data-extra-content="min-width=0" />
                    <meta name="viewport-extra" content="width=device-width,initial-scale=2,min-width=${smViewportWidth}" data-media="(max-width: ${smViewportWidth}px)" />
                    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5" data-extra-media="(max-width: ${smViewportWidth}px)" />
                    <meta name="viewport-extra" content="width=device-width,initial-scale=2,min-width=${lgViewportWidth}" data-media="not (max-width: ${smViewportWidth}px)" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
                  </body>
                </html>
              `);
              await waitForAssetScriptComplete(page);
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth &&
                  smViewportWidth > 0 &&
                  lgViewportWidth > 0
                  ? documentClientWidth <= smViewportWidth
                    ? documentClientWidth < smViewportWidth
                      ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},maximum-scale=5,minimum-scale=1,width=${smViewportWidth}`
                      : "initial-scale=1,minimum-scale=1,width=device-width"
                    : documentClientWidth < lgViewportWidth
                      ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 1},minimum-scale=1,width=${lgViewportWidth}`
                      : "initial-scale=1,minimum-scale=1,width=device-width"
                  : "",
              );
            });
          });
        });

        test.describe("data-(extra-)decimal-places attributes", () => {
          test.describe("case where media attributes are set", () => {
            test("merging attributes of all viewport and viewport-extra meta elements", async ({
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
                    <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=${smViewportWidth}" data-decimal-places="3" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${smViewportWidth}" data-decimal-places="4" />
                    <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=${smViewportWidth}" data-media="(min-width: ${smViewportWidth}px)" data-decimal-places="5" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${smViewportWidth}" data-extra-media="(min-width: ${smViewportWidth}px)" data-decimal-places="6" />
                    ${moduleFlag ? "" : `<script src="/${outputSubDirectory}viewport-extra${minified ? ".min" : ""}.js"></script>`}
                  </head>
                  <body>
                    <script src="/assets/scripts/${assetSubDirectory}side_effects.js" type="module" data-asset-script data-status="incomplete"></script>
                  </body>
                </html>
              `);
              await waitForAssetScriptComplete(page);
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && smViewportWidth > 0
                  ? documentClientWidth < smViewportWidth
                    ? `initial-scale=${Math.trunc((documentClientWidth / smViewportWidth) * 1 * 10 ** 6) / 10 ** 6},width=${smViewportWidth}`
                    : "initial-scale=1,width=device-width"
                  : "",
              );
            });
          });
        });
      });
    });
  },
);
