__TYPESCRIPT_TARGET__ !== "es5"
  ? await import("@@/dist/immediate/viewport-extra.cjs")
  : await import("@@/dist/immediate/es5/viewport-extra.cjs");
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
