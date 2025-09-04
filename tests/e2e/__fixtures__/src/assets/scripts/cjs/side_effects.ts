import { setParameters } from "@@/dist/cjs/index.js";

const mediaSpecificParametersListAttribute = document
  .querySelector("[data-media-specific-parameters-list]")
  ?.getAttribute("data-media-specific-parameters-list");
if (typeof mediaSpecificParametersListAttribute === "string") {
  const argumentList: Parameters<typeof setParameters> = [
    JSON.parse(mediaSpecificParametersListAttribute) as Parameters<
      typeof setParameters
    >[0],
  ];
  setParameters(...argumentList);
}
