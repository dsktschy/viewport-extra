import { setMediaSpecificParametersList } from "@@/src/apis/setMediaSpecificParametersList.js";

type SetMediaSpecificParametersListParameters = Parameters<
  typeof setMediaSpecificParametersList
>;

const mediaSpecificParametersListAttribute = document
  .querySelector("[data-media-specific-parameters-list]")
  ?.getAttribute("data-media-specific-parameters-list");
if (typeof mediaSpecificParametersListAttribute === "string")
  setMediaSpecificParametersList(
    JSON.parse(
      mediaSpecificParametersListAttribute,
    ) as SetMediaSpecificParametersListParameters[0],
  );
