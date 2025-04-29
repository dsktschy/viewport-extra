__TYPESCRIPT_TARGET__ !== "es5"
  ? await import("@@/dist/viewport-extra.mjs")
  : await import("@@/dist/es5/viewport-extra.mjs");
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
