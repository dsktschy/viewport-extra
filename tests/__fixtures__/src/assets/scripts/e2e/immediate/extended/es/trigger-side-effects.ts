__TYPESCRIPT_TARGET__ !== "es5"
  ? await import("@@/dist/immediate/extended/viewport-extra.mjs")
  : await import("@@/dist/immediate/extended/es5/viewport-extra.mjs");
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
