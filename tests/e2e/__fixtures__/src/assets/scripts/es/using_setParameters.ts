const { setParameters } =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? await import("@@/dist/viewport-extra.mjs")
    : await import("@@/dist/es5/viewport-extra.mjs");
const globalParametersAttribute = document
  .querySelector("[data-global-parameters]")
  ?.getAttribute("data-global-parameters");
const mediaSpecificParametersListAttribute = document
  .querySelector("[data-media-specific-parameters-list]")
  ?.getAttribute("data-media-specific-parameters-list");
if (typeof mediaSpecificParametersListAttribute === "string") {
  const argumentList: Parameters<typeof setParameters> = [
    JSON.parse(mediaSpecificParametersListAttribute) as Parameters<
      typeof setParameters
    >[0],
  ];
  if (typeof globalParametersAttribute === "string")
    argumentList.push(
      JSON.parse(globalParametersAttribute) as Parameters<
        typeof setParameters
      >[1],
    );
  setParameters(...argumentList);
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
