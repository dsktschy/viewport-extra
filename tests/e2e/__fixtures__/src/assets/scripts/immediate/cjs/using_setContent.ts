const { setContent } =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? await import("@@/dist/immediate/viewport-extra.cjs")
    : await import("@@/dist/immediate/es5/viewport-extra.cjs");
const contentAttribute = document
  .querySelector("[data-content]")
  ?.getAttribute("data-content");
if (typeof contentAttribute === "string") {
  setContent(JSON.parse(contentAttribute) as Parameters<typeof setContent>[0]);
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
