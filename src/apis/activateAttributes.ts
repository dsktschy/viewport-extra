import { getMetaElementList } from "../internal/Document.js";
import { mergePartialGlobalParameters } from "../internal/GlobalParameters.js";
import {
  createPartialGlobalParameters,
  createPartialMediaSpecificParameters,
} from "../internal/HTMLMetaElement.js";
import { setParameters } from "./setParameters.js";

export const activateAttributes = (): void => {
  if (typeof window === "undefined") return;
  const metaElementList = getMetaElementList(document);
  setParameters(
    metaElementList.map(createPartialMediaSpecificParameters),
    metaElementList
      .map(createPartialGlobalParameters)
      .reduce(mergePartialGlobalParameters),
  );
};
