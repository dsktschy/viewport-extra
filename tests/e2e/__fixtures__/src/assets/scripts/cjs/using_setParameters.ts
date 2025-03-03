import { setParameters } from "@@/dist/viewport-extra.cjs";

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
