import type { Page } from "@playwright/test";

export const getViewportContentString = async (page: Page) =>
  await page.evaluate(
    ({ document }) =>
      document.querySelector('meta[name="viewport"]')?.getAttribute("content"),
    await page.evaluateHandle<Window>("window"),
  );

export const waitForAssetScriptComplete = async (page: Page) =>
  await page.waitForFunction(
    ({ document }) =>
      document
        .querySelector("[data-asset-script]")
        ?.getAttribute("data-status") === "complete",
    await page.evaluateHandle<Window>("window"),
  );
