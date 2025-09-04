import type { Page } from "@playwright/test";

export const getViewportContentString = async (page: Page) =>
  await page.evaluate(
    ({ document }) =>
      document.querySelector('meta[name="viewport"]')?.getAttribute("content"),
    await page.evaluateHandle<Window>("window"),
  );

export const getGetContentResultString = async (page: Page) =>
  await page.evaluate(
    ({ document }) =>
      document
        .querySelector("[data-get-content-result]")
        ?.getAttribute("data-get-content-result"),
    await page.evaluateHandle<Window>("window"),
  );
