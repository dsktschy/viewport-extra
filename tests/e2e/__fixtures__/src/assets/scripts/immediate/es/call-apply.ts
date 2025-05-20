type ApplyParameters = Parameters<typeof apply>;

const { apply } =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? await import("@@/dist/immediate/viewport-extra.mjs")
    : await import("@@/dist/immediate/es5/viewport-extra.mjs");
const mediaSpecificParametersListAttribute = document
  .querySelector("[data-media-specific-parameters-list]")
  ?.getAttribute("data-media-specific-parameters-list");
if (typeof mediaSpecificParametersListAttribute === "string")
  apply(JSON.parse(mediaSpecificParametersListAttribute) as ApplyParameters[0]);
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
