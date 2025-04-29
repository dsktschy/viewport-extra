__TYPESCRIPT_TARGET__ !== "es5"
  ? await import("@@/dist/viewport-extra.cjs")
  : await import("@@/dist/es5/viewport-extra.cjs");
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
