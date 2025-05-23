import { setParameters } from "@@/src/apis/setParameters.js";

type SetParametersParameters = Parameters<typeof setParameters>;

const mediaSpecificParametersListAttribute = document
  .querySelector("[data-media-specific-parameters-list]")
  ?.getAttribute("data-media-specific-parameters-list");
if (typeof mediaSpecificParametersListAttribute === "string") {
  const argumentList: SetParametersParameters = [
    JSON.parse(
      mediaSpecificParametersListAttribute,
    ) as SetParametersParameters[0],
  ];
  const globalParametersAttribute = document
    .querySelector("[data-global-parameters]")
    ?.getAttribute("data-global-parameters");
  if (typeof globalParametersAttribute === "string")
    argumentList.push(
      JSON.parse(globalParametersAttribute) as SetParametersParameters[1],
    );
  setParameters(...argumentList);
}
