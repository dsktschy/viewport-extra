type ApplyParameters = Parameters<typeof apply>;

const { apply } =
  __TYPESCRIPT_TARGET__ !== "es5"
    ? await import("@@/dist/extended/viewport-extra.cjs")
    : await import("@@/dist/extended/es5/viewport-extra.cjs");
const mediaSpecificParametersListAttribute = document
  .querySelector("[data-media-specific-parameters-list]")
  ?.getAttribute("data-media-specific-parameters-list");
if (typeof mediaSpecificParametersListAttribute === "string") {
  const argumentList: ApplyParameters = [
    JSON.parse(mediaSpecificParametersListAttribute) as ApplyParameters[0],
  ];
  const globalParametersAttribute = document
    .querySelector("[data-global-parameters]")
    ?.getAttribute("data-global-parameters");
  if (typeof globalParametersAttribute === "string")
    argumentList.push(
      JSON.parse(globalParametersAttribute) as ApplyParameters[1],
    );
  apply(...argumentList);
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
