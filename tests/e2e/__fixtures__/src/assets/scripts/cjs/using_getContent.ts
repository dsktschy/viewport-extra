import { convertToJsonString } from "@@/tests/e2e/modules/NumberStringRecord.js";

const { getContent } =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? await import("@@/dist/viewport-extra.cjs")
    : await import("@@/dist/es5/viewport-extra.cjs");
document
  .querySelector("[data-get-content-result]")
  ?.setAttribute("data-get-content-result", convertToJsonString(getContent()));
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
