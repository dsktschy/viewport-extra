import { expect, test } from "@playwright/test";
import { getViewportSize } from "../modules/PlaywrightFullProjectList.js";
import { getViewportContentString } from "../modules/PlaywrightPage.js";

[
  { format: "es", moduleFlag: true, minified: false },
  { format: "cjs", moduleFlag: true, minified: false },
  { format: "iife", moduleFlag: false, minified: false },
  { format: "iife", moduleFlag: false, minified: true },
].forEach(({ format, moduleFlag, minified }, formatIndex) => {
  test.describe(`using ${(minified ? "minified " : "") + format} output`, () => {
    test.describe("updating content attribute of viewport meta element", () => {
      test.beforeEach(async ({ page }) => {
        await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
      });

      test.describe("case where minimum width is provided as argument number", () => {
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
              </head>
              <body>
                <script data-using-number-argument data-min-width="${smViewportWidth}"></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                : "initial-scale=1,width=device-width"
              : "",
          );
        });
      });

      test.describe("case where minWidth property is set in argument object", () => {
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
              </head>
              <body>
                <script data-content='{ "minWidth": ${smViewportWidth} }'></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                : "initial-scale=1,width=device-width"
              : "",
          );
        });
      });

      test.describe("case where maxWidth property is set in argument object", () => {
        test("width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const lgViewportWidth =
            getViewportSize(projects, "lg")?.use.viewport?.width ?? Infinity;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
              </head>
              <body>
                <script data-content='{ "maxWidth": ${lgViewportWidth} }'></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && lgViewportWidth < Infinity
              ? documentClientWidth > lgViewportWidth
                ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 1},width=${lgViewportWidth}`
                : "initial-scale=1,width=device-width"
              : "",
          );
        });
      });
    });

    // Following cases cannot be tested with vitest
    // Because vitest does not update size of document element when viewport meta element is updated
    // Run only in minimal formats and viewports because they replace unit tests of src/index.spec.ts
    test.describe("comparison with minWidth and maxWidth, and computation of output initial-scale", () => {
      test.beforeEach(async ({ page }, testInfo) => {
        testInfo.skip(formatIndex !== 0);
        testInfo.skip(!["xs", "xl"].includes(testInfo.project.name));
        await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
      });

      test.describe("case where unscaledComputing property in internalGlobalParameters variable is false", () => {
        // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
        test.describe("case where initial scale before running ViewportExtra constructor is 1 or less", () => {
          test("width of viewport is used for comparison, and initialScale property merged from current internalPartialMediaSpecificParametersList variable and argument is applied to output initial-scale", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const smViewportWidth =
              (getViewportSize(projects, "sm")?.use.viewport?.width ?? 0) / 0.5;
            const lgViewportWidth =
              (getViewportSize(projects, "lg")?.use.viewport?.width ??
                Infinity) / 0.5;
            const documentClientWidth = viewport
              ? viewport.width / 0.5
              : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=0.5">
                  ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script data-content='{ "initialScale": 2, "minWidth": ${smViewportWidth}, "maxWidth": ${lgViewportWidth} }'></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth &&
                smViewportWidth > 0 &&
                lgViewportWidth < Infinity
                ? documentClientWidth < smViewportWidth
                  ? `initial-scale=${(documentClientWidth / smViewportWidth) * 2},width=${smViewportWidth}`
                  : documentClientWidth > lgViewportWidth
                    ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 2},width=${lgViewportWidth}`
                    : "initial-scale=2,width=device-width"
                : "",
            );
          });
        });

        // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
        test.describe("case where initial scale before running ViewportExtra constructor is greater than 1", () => {
          test("width of window without scroll bars when scale is 1 is used for comparison, and initialScale property merged from current internalPartialMediaSpecificParametersList variable and argument is applied to output initial-scale", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const smViewportWidth =
              getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
            const lgViewportWidth =
              getViewportSize(projects, "lg")?.use.viewport?.width ?? Infinity;
            const documentClientWidth = viewport ? viewport.width : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=2">
                  ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script data-content='{ "initialScale": 0.5, "minWidth": ${smViewportWidth}, "maxWidth": ${lgViewportWidth} }'></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth &&
                smViewportWidth > 0 &&
                lgViewportWidth < Infinity
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

      test.describe("case where unscaledComputing property in internalGlobalParameters variable is true", () => {
        test.describe("case where initial scale before running ViewportExtra constructor is 1 or less", () => {
          test("width of window without scroll bars when scale is 1 is used for comparison, and initialScale property merged from current internalPartialMediaSpecificParametersList variable and argument is applied to output initial-scale", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const smViewportWidth =
              getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
            const lgViewportWidth =
              getViewportSize(projects, "lg")?.use.viewport?.width ?? Infinity;
            const documentClientWidth = viewport ? viewport.width : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing>
                  ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script data-content='{ "initialScale": 2, "minWidth": ${smViewportWidth}, "maxWidth": ${lgViewportWidth} }'></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth &&
                smViewportWidth > 0 &&
                lgViewportWidth < Infinity
                ? documentClientWidth < smViewportWidth
                  ? `initial-scale=${(documentClientWidth / smViewportWidth) * 2},width=${smViewportWidth}`
                  : documentClientWidth > lgViewportWidth
                    ? `initial-scale=${(documentClientWidth / lgViewportWidth) * 2},width=${lgViewportWidth}`
                    : "initial-scale=2,width=device-width"
                : "",
            );
          });
        });

        test.describe("case where initial scale before running ViewportExtra constructor is greater than 1", () => {
          test("width of window without scroll bars when scale is 1 is used for comparison, and initialScale property merged from current internalPartialMediaSpecificParametersList variable and argument is applied to output initial-scale", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const smViewportWidth =
              getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
            const lgViewportWidth =
              getViewportSize(projects, "lg")?.use.viewport?.width ?? Infinity;
            const documentClientWidth = viewport ? viewport.width : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=2" data-extra-unscaled-computing>
                  ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script data-content='{ "initialScale": 0.5, "minWidth": ${smViewportWidth}, "maxWidth": ${lgViewportWidth} }'></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth &&
                smViewportWidth > 0 &&
                lgViewportWidth < Infinity
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

    // Following cases cannot be tested with vitest
    // Because vitest does not provide matchMedia method
    // Run only in minimal formats and viewports because they replace unit tests of src/index.spec.ts
    test.describe("merging current internalPartialMediaSpecificParametersList variable and argument", () => {
      test.beforeEach(async ({ page }, testInfo) => {
        testInfo.skip(formatIndex !== 0);
        testInfo.skip(!["xs"].includes(testInfo.project.name));
        await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
      });

      test.describe("case where argument is number", () => {
        test("properties of objects in current internalPartialMediaSpecificParametersList variable and object based on argument whose media properties match viewport are used. Object based on argument is handled as being after objects in current internalPartialMediaSpecificParametersList variable", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
          const lgViewportWidth =
            getViewportSize(projects, "lg")?.use.viewport?.width ?? 0;
          const xlViewportWidth =
            getViewportSize(projects, "xl")?.use.viewport?.width ?? 0;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-unscaled-computing>
                <meta name="viewport-extra" content="min-width=${xlViewportWidth}" data-media="(min-width: ${lgViewportWidth}px)">
                <meta name="viewport-extra" content="min-width=${lgViewportWidth}" data-media="(min-width: ${smViewportWidth}px)">
                <meta name="viewport-extra" content="min-width=${smViewportWidth + 2}">
                <meta name="viewport-extra" content="min-width=${smViewportWidth + 1}">
                <meta name="viewport-extra" content="width=device-width,initial-scale=2" data-media="(min-width: ${smViewportWidth}px)">
                ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
              </head>
              <body>
                <script data-using-number-argument data-min-width="${smViewportWidth}"></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && smViewportWidth > 0
              ? documentClientWidth < smViewportWidth
                ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
                : "initial-scale=1,width=device-width"
              : "",
          );
        });
      });

      test.describe("case where argument is object", () => {
        test("properties of objects in current internalPartialMediaSpecificParametersList variable and object based on argument whose media properties match viewport are used. Object based on argument is handled as being after objects in current internalPartialMediaSpecificParametersList variable", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
          const lgViewportWidth =
            getViewportSize(projects, "lg")?.use.viewport?.width ?? 0;
          const xlViewportWidth =
            getViewportSize(projects, "xl")?.use.viewport?.width ?? 0;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-unscaled-computing>
                <meta name="viewport-extra" content="min-width=${xlViewportWidth}" data-media="(min-width: ${lgViewportWidth}px)">
                <meta name="viewport-extra" content="min-width=${lgViewportWidth}" data-media="(min-width: ${smViewportWidth}px)">
                <meta name="viewport-extra" content="min-width=${smViewportWidth + 2}">
                <meta name="viewport-extra" content="min-width=${smViewportWidth + 1}">
                <meta name="viewport-extra" content="initial-scale=0.5">
                <meta name="viewport-extra" content="width=device-width,initial-scale=2" data-media="(min-width: ${smViewportWidth}px)">
                ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
              </head>
              <body>
                <script data-content='{ "minWidth": ${smViewportWidth}, "initialScale": 1 }'></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
              </body>
            </html>
          `);
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

    test.describe("displaying message about breaking changes in v3", () => {
      test.beforeEach(async ({ page }, testInfo) => {
        testInfo.skip(!["xs"].includes(testInfo.project.name));
        await page.goto("/tests/e2e/__fixtures__/src/dummy.html");
      });

      test.describe("case where viewport-extra meta element does not have data-extra-no-migration-message attribute", () => {
        test.describe("case where date and time is before 2026-03-01 00:00:00 UTC", () => {
          test("message is displayed in console", async ({ page }, {
            config: { projects },
          }) => {
            const smViewportWidth =
              getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
            const consoleMessages: string[] = [];
            page.on("console", (consoleMessage) => {
              consoleMessages.push(consoleMessage.text());
            });
            await page.clock.setFixedTime(new Date("2026-02-28T23:59:59Z"));
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=1">
                  ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script data-using-number-argument data-min-width="${smViewportWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `);
            expect(
              consoleMessages.filter(
                (consoleMessage) =>
                  consoleMessage.includes("v3") &&
                  consoleMessage.includes("breaking changes"),
              ).length,
            ).toBe(1);
          });
        });

        test.describe("case where date and time is not before 2026-03-01 00:00:00 UTC", () => {
          test("message is not displayed in console", async ({ page }, {
            config: { projects },
          }) => {
            const smViewportWidth =
              getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
            const consoleMessages: string[] = [];
            page.on("console", (consoleMessage) => {
              consoleMessages.push(consoleMessage.text());
            });
            await page.clock.setFixedTime(new Date("2026-03-01T00:00:00Z"));
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=1">
                  ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
                </head>
                <body>
                  <script data-using-number-argument data-min-width="${smViewportWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
                </body>
              </html>
            `);
            expect(
              consoleMessages.filter(
                (consoleMessage) =>
                  consoleMessage.includes("v3") &&
                  consoleMessage.includes("breaking changes"),
              ).length,
            ).toBe(0);
          });
        });
      });

      test.describe("case where viewport-extra meta element has data-extra-no-migration-message attribute", () => {
        test("message is not displayed in console", async ({ page }, {
          config: { projects },
        }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? 0;
          const consoleMessages: string[] = [];
          page.on("console", (consoleMessage) => {
            consoleMessages.push(consoleMessage.text());
          });
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-no-migration-message>
                ${moduleFlag ? "" : `<script src="/${format}/viewport-extra${minified ? ".min" : ""}.js"></script>`}
              </head>
              <body>
                <script data-using-number-argument data-min-width="${smViewportWidth}"></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
              </body>
            </html>
          `);
          expect(
            consoleMessages.filter(
              (consoleMessage) =>
                consoleMessage.includes("v3") &&
                consoleMessage.includes("breaking changes"),
            ).length,
          ).toBe(0);
        });
      });
    });
  });
});
