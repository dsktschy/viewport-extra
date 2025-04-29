const { setContent, updateReference } =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? await import("@@/dist/viewport-extra.cjs")
    : await import("@@/dist/es5/viewport-extra.cjs");
const firstViewportMetaElement = document.querySelector(
  'meta[name="viewport"]',
);
if (firstViewportMetaElement) {
  const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
  document.head.removeChild(firstViewportMetaElement);
  document.head.appendChild(secondViewportMetaElement);
  updateReference();
  const contentAfterUpdateReferenceAttribute = document
    .querySelector("[data-content-after-update-reference]")
    ?.getAttribute("data-content-after-update-reference");
  if (typeof contentAfterUpdateReferenceAttribute === "string")
    setContent(
      JSON.parse(contentAfterUpdateReferenceAttribute) as Parameters<
        typeof setContent
      >[0],
    );
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
