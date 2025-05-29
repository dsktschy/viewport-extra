import { expect, test } from "@playwright/test";
import { getViewportSize } from "../../modules/PlaywrightFullProjectList.js";
import { getViewportContentString } from "../../modules/PlaywrightPage.js";

test.beforeEach(async ({ page }, { project: { name } }) => {
  if (name !== "xs") new Error(`Invalid project: ${name} (expected: xs)`);
  await page.goto("/tests/__fixtures__/src/dummy.html");
});

test.describe("setMediaSpecificParametersList", () => {
  test.describe("viewport meta element to be updated", () => {
    test.describe("case where viewport meta elements exist", () => {
      test("updates existing first viewport meta element", async ({
        page,
        viewport,
      }, { config: { projects } }) => {
        const smViewportWidth =
          getViewportSize(projects, "sm")?.use.viewport?.width ?? Number.NaN;
        const documentClientWidth = viewport ? viewport.width : undefined;
        await page.setContent(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Document</title>
              <meta name="viewport" content="width=device-width,initial-scale=1" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            </head>
            <body>
              <script data-media-specific-parameters-list='${`
                [
                  { "content": { "minimumWidth": ${smViewportWidth} } }
                ]
              `}'></script>
              <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
            </body>
          </html>
        `);
        expect(await getViewportContentString(page)).toBe(
          documentClientWidth && !Number.isNaN(smViewportWidth)
            ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
            : "",
        );
      });
    });

    test.describe("case where viewport meta element does not exist", () => {
      test("appends viewport meta element and updates it", async ({
        page,
        viewport,
      }, { config: { projects } }) => {
        const smViewportWidth =
          getViewportSize(projects, "sm")?.use.viewport?.width ?? Number.NaN;
        const documentClientWidth = viewport ? viewport.width : undefined;
        await page.setContent(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Document</title>
            </head>
            <body>
              <script data-media-specific-parameters-list='${`
                [
                  { "content": { "minimumWidth": ${smViewportWidth} } }
                ]
              `}'></script>
              <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
            </body>
          </html>
        `);
        expect(await getViewportContentString(page)).toBe(
          documentClientWidth && !Number.isNaN(smViewportWidth)
            ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
            : "",
        );
      });
    });
  });

  test.describe("behavior according to attributes of viewport(-extra) meta elements", () => {
    test.describe("(data-extra-)content attribute", () => {
      test.describe("case where initial-scale before running setMediaSpecificParametersList is 1 or less", () => {
        test.describe("comparison with minimumWidth", () => {
          test("window width without scroll bars when scale is 1 is used", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const xsViewportWidth =
              getViewportSize(projects, "xs")?.use.viewport?.width ??
              Number.NaN;
            const documentClientWidth = viewport ? viewport.width : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                </head>
                <body>
                  <script data-media-specific-parameters-list='${`
                    [
                      { "content": { "initialScale": 2, "minimumWidth": ${xsViewportWidth + 1} } }
                    ]
                  `}'></script>
                  <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && !Number.isNaN(xsViewportWidth)
                ? `initial-scale=${(documentClientWidth / (xsViewportWidth + 1)) * 2},width=${xsViewportWidth + 1}`
                : "",
            );
          });
        });

        test.describe("comparison with maximumWidth", () => {
          test("window width without scroll bars when scale is 1 is used", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const xsViewportWidth =
              getViewportSize(projects, "xs")?.use.viewport?.width ??
              Number.NaN;
            const documentClientWidth = viewport ? viewport.width : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                </head>
                <body>
                  <script data-media-specific-parameters-list='${`
                    [
                      { "content": { "initialScale": 2, "maximumWidth": ${xsViewportWidth - 1} } }
                    ]
                  `}'></script>
                  <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && !Number.isNaN(xsViewportWidth)
                ? `initial-scale=${(documentClientWidth / (xsViewportWidth - 1)) * 2},width=${xsViewportWidth - 1}`
                : "",
            );
          });
        });
      });

      test.describe("case where initial-scale before running setMediaSpecificParametersList is greater than 1", () => {
        test.describe("comparison with minimumWidth", () => {
          test("window width without scroll bars when scale is 1 is used", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const xsViewportWidth =
              getViewportSize(projects, "xs")?.use.viewport?.width ??
              Number.NaN;
            const documentClientWidth = viewport ? viewport.width : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=2" />
                </head>
                <body>
                  <script data-media-specific-parameters-list='${`
                    [
                      { "content": { "initialScale": 0.5, "minimumWidth": ${xsViewportWidth + 1} } }
                    ]
                  `}'></script>
                  <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && !Number.isNaN(xsViewportWidth)
                ? `initial-scale=${(documentClientWidth / (xsViewportWidth + 1)) * 0.5},width=${xsViewportWidth + 1}`
                : "",
            );
          });
        });

        test.describe("comparison with maximumWidth", () => {
          test("window width without scroll bars when scale is 1 is used", async ({
            page,
            viewport,
          }, { config: { projects } }) => {
            const xsViewportWidth =
              getViewportSize(projects, "xs")?.use.viewport?.width ??
              Number.NaN;
            const documentClientWidth = viewport ? viewport.width : undefined;
            await page.setContent(`
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=2" />
                </head>
                <body>
                  <script data-media-specific-parameters-list='${`
                    [
                      { "content": { "initialScale": 0.5, "maximumWidth": ${xsViewportWidth - 1} } }
                    ]
                  `}'></script>
                  <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
                </body>
              </html>
            `);
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && !Number.isNaN(xsViewportWidth)
                ? `initial-scale=${(documentClientWidth / (xsViewportWidth - 1)) * 0.5},width=${xsViewportWidth - 1}`
                : "",
            );
          });
        });
      });
    });
  });

  test.describe("behavior according to argument", () => {
    test.describe("content property", () => {
      test.describe("case where minimumWidth property is greater than viewport width", () => {
        test("updates width to minimumWidth and initial-scale to value that minimumWidth fits into viewport", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const xsViewportWidth =
            getViewportSize(projects, "xs")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "minimumWidth": ${xsViewportWidth + 1} } }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && !Number.isNaN(xsViewportWidth)
              ? `initial-scale=${(documentClientWidth / (xsViewportWidth + 1)) * 1},width=${xsViewportWidth + 1}`
              : "",
          );
        });
      });

      test.describe("case where maximumWidth property is less than viewport width", () => {
        test("updates width to maximumWidth and initial-scale to value that maximumWidth fits into viewport", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const xsViewportWidth =
            getViewportSize(projects, "xs")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "maximumWidth": ${xsViewportWidth - 1} } }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && !Number.isNaN(xsViewportWidth)
              ? `initial-scale=${(documentClientWidth / (xsViewportWidth - 1)) * 1},width=${xsViewportWidth - 1}`
              : "",
          );
        });
      });

      test.describe("case where minimumWidth property is less than viewport width and maximumWidth property is greater than viewport width", () => {
        test("does not update width and initial-scale", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const xsViewportWidth =
            getViewportSize(projects, "xs")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "minimumWidth": ${xsViewportWidth - 1}, "maximumWidth": ${xsViewportWidth + 1} } }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && !Number.isNaN(xsViewportWidth)
              ? "initial-scale=1,width=device-width"
              : "",
          );
        });
      });

      test.describe("case where initialScale property is set", () => {
        test("multiplies initialScale to computed initial-scale", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "initialScale": 0.5, "minimumWidth": ${smViewportWidth} } }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && !Number.isNaN(smViewportWidth)
              ? `initial-scale=${(documentClientWidth / smViewportWidth) * 0.5},width=${smViewportWidth}`
              : "",
          );
        });
      });

      test.describe("case where no properties are set", () => {
        test("computes with default Content object", async ({ page }) => {
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  []
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            "initial-scale=1,width=device-width",
          );
        });
      });

      test.describe("case where any properties are not set", () => {
        test("computes with values in default Content object", async ({
          page,
        }) => {
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [{}]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            "initial-scale=1,width=device-width",
          );
        });
      });
    });

    test.describe("media property", () => {
      test.describe("case where value is media query that matches viewport width", () => {
        test("content property of same item is used for computing", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "minimumWidth": ${smViewportWidth} }, "media": "(max-width: ${smViewportWidth}px)" }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && !Number.isNaN(smViewportWidth)
              ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
              : "",
          );
        });
      });

      test.describe("case where value is media query that does not match viewport width", () => {
        test("content property of same item is not used for computing", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const lgViewportWidth =
            getViewportSize(projects, "lg")?.use.viewport?.width ?? Number.NaN;
          const xlViewportWidth =
            getViewportSize(projects, "xl")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "minimumWidth": ${xlViewportWidth} }, "media": "(min-width: ${lgViewportWidth}px)" }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth &&
              !Number.isNaN(lgViewportWidth) &&
              !Number.isNaN(xlViewportWidth)
              ? "initial-scale=1,width=device-width"
              : "",
          );
        });
      });

      test.describe("case where property is not set", () => {
        test("content property of same item is used for computing", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "minimumWidth": ${smViewportWidth} } }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && !Number.isNaN(smViewportWidth)
              ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
              : "",
          );
        });
      });
    });
  });

  test.describe("determination of value to apply from multiple values in argument", () => {
    test.describe("content properties", () => {
      test.describe("case where media properties are not set", () => {
        test("merges properties of all items recursively", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? Number.NaN;
          const lgViewportWidth =
            getViewportSize(projects, "lg")?.use.viewport?.width ?? Number.NaN;
          const xlViewportWidth =
            getViewportSize(projects, "xl")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "initialScale": 0.25, "minimumWidth": ${xlViewportWidth} } },
                    { "content": { "initialScale": 0.5, "minimumWidth": ${lgViewportWidth} } },
                    { "content": { "initialScale": 1, "minimumWidth": ${smViewportWidth} } }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth &&
              !Number.isNaN(smViewportWidth) &&
              !Number.isNaN(lgViewportWidth) &&
              !Number.isNaN(xlViewportWidth)
              ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
              : "",
          );
        });
      });

      test.describe("case where media properties are set", () => {
        test("filtering items whose media property matches viewport width and merging only their attributes recursively", async ({
          page,
          viewport,
        }, { config: { projects } }) => {
          const smViewportWidth =
            getViewportSize(projects, "sm")?.use.viewport?.width ?? Number.NaN;
          const lgViewportWidth =
            getViewportSize(projects, "lg")?.use.viewport?.width ?? Number.NaN;
          const documentClientWidth = viewport ? viewport.width : undefined;
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-media-specific-parameters-list='${`
                  [
                    { "content": { "initialScale": 2, "minimumWidth": ${smViewportWidth}, "maximumScale": 5 }, "media": "(max-width: ${smViewportWidth}px)" },
                    { "content": { "initialScale": 1, "minimumWidth": 0, "minimumScale": 1 } },
                    { "content": { "initialScale": 1, "minimumWidth": ${smViewportWidth} }, "media": "(max-width: ${smViewportWidth}px)" },
                    { "content": { "initialScale": 1, "minimumWidth": ${lgViewportWidth} }, "media": "not (max-width: ${smViewportWidth}px)" }
                  ]
                `}'></script>
                <script src="/assets/scripts/unit/call-setMediaSpecificParametersList.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth &&
              !Number.isNaN(smViewportWidth) &&
              !Number.isNaN(lgViewportWidth)
              ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},maximum-scale=5,minimum-scale=1,width=${smViewportWidth}`
              : "",
          );
        });
      });
    });
  });
});
