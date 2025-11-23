import { expect, test } from "@playwright/test";
import { getViewportSize } from "../../modules/PlaywrightFullProjectList.js";
import { getViewportContentString } from "../../modules/PlaywrightPage.js";

test.beforeEach(async ({ page }, { project: { name } }) => {
  if (name !== "xs") new Error(`Invalid project: ${name} (expected: xs)`);
  await page.goto("/tests/__fixtures__/src/dummy.html");
});

test.describe("activateMediaSpecificAttributes", () => {
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
              <meta charset="UTF-8">
              <title>Document</title>
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="minimum-width=${smViewportWidth}">
            </head>
            <body>
              <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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
              <meta charset="UTF-8">
              <title>Document</title>
              <meta name="viewport-extra" content="width=device-width,initial-scale=1,minimum-width=${smViewportWidth}">
            </head>
            <body>
              <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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
      test.describe("case where minimum-width value is greater than viewport width", () => {
        test("updates width to minimum width and initial-scale to value that minimum width fits into viewport", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="minimum-width=${xsViewportWidth + 1}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where maximum-width value is less than viewport width", () => {
        test("updates width to maximum width and initial-scale to value that maximum width fits into viewport", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="maximum-width=${xsViewportWidth - 1}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where minimum-width value is less than viewport width and maximum-width value is greater than viewport width", () => {
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="minimum-width=${xsViewportWidth - 1},maximum-width=${xsViewportWidth + 1}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where min-width value is greater than viewport width", () => {
        test("updates width to minimum width and initial-scale to value that minimum width fits into viewport", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${xsViewportWidth + 1}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where max-width value is less than viewport width", () => {
        test("updates width to maximum width and initial-scale to value that maximum width fits into viewport", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="max-width=${xsViewportWidth - 1}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where min-width value is less than viewport width and max-width value is greater than viewport width", () => {
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${xsViewportWidth - 1},max-width=${xsViewportWidth + 1}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where initial-scale value is set", () => {
        test("multiplies initial-scale to computed initial-scale", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-content="minimum-width=${smViewportWidth}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where attribute is not set", () => {
        test("computes with default Content object", async ({ page }) => {
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            "initial-scale=1,width=device-width",
          );
        });
      });

      test.describe("case where any values are not set", () => {
        test("computes with values in default Content object", async ({
          page,
        }) => {
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="" data-extra-content="">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            "initial-scale=1,width=device-width",
          );
        });
      });

      test.describe("case where initial-scale before running activateMediaSpecificAttributes is 1 or less", () => {
        test.describe("comparison with minimum width", () => {
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
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-content="minimum-width=${xsViewportWidth + 1}">
                </head>
                <body>
                  <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

        test.describe("comparison with maximum width", () => {
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
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-content="maximum-width=${xsViewportWidth - 1}">
                </head>
                <body>
                  <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where initial-scale before running activateMediaSpecificAttributes is greater than 1", () => {
        test.describe("comparison with minimum width", () => {
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
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=2" data-extra-content="minimum-width=${xsViewportWidth + 1}">
                </head>
                <body>
                  <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

        test.describe("comparison with maximum width", () => {
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
                  <meta charset="UTF-8">
                  <title>Document</title>
                  <meta name="viewport" content="width=device-width,initial-scale=2" data-extra-content="maximum-width=${xsViewportWidth - 1}">
                </head>
                <body>
                  <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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
    });

    test.describe("data-(extra-)media attribute", () => {
      test.describe("case where value is media query that matches viewport width", () => {
        test("(data-extra-)content attribute of same element is used for computing", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="minimum-width=${smViewportWidth}" data-extra-media="(max-width: ${smViewportWidth}px)">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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
        test("(data-extra-)content attribute of same element is not used for computing", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="minimum-width=${xlViewportWidth}" data-extra-media="(min-width: ${lgViewportWidth}px)">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

      test.describe("case where attribute is not set", () => {
        test("(data-extra-)content attribute of same element is used for computing", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="minimum-width=${smViewportWidth}">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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

  test.describe("determination of value to apply from multiple viewport(-extra) meta elements", () => {
    test.describe("(data-extra-)content attributes", () => {
      test.describe("case where media attributes are not set", () => {
        test("merges attributes of all viewport and viewport-extra meta elements recursively", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport-extra" content="initial-scale=0.5,minimum-width=${lgViewportWidth}">
                <meta name="viewport" content="width=device-width">
                <meta name="viewport-extra" content="minimum-width=${smViewportWidth}">
                <meta name="viewport" content="initial-scale=1">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
              </body>
            </html>
          `);
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth &&
              !Number.isNaN(smViewportWidth) &&
              !Number.isNaN(lgViewportWidth)
              ? `initial-scale=${(documentClientWidth / smViewportWidth) * 1},width=${smViewportWidth}`
              : "",
          );
        });
      });

      test.describe("case where media attributes are set", () => {
        test("filtering elements whose data-(extra-)media attribute matches viewport width from all viewport and viewport-extra meta elements, and merging only their attributes recursively", async ({
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
                <meta charset="UTF-8">
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1" data-extra-content="minimum-width=0">
                <meta name="viewport-extra" content="width=device-width,initial-scale=2,minimum-width=${smViewportWidth}" data-media="(max-width: ${smViewportWidth}px)">
                <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5" data-extra-media="(max-width: ${smViewportWidth}px)">
                <meta name="viewport-extra" content="width=device-width,initial-scale=2,minimum-width=${lgViewportWidth}" data-media="not (max-width: ${smViewportWidth}px)">
              </head>
              <body>
                <script src="/assets/scripts/unit/call-activateMediaSpecificAttributes.js" type="module"></script>
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
