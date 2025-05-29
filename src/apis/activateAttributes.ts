import { getMetaElementList } from "../lib/Document.js";
import { mergePartialGlobalParameters } from "../lib/GlobalParameters.js";
import {
  createPartialGlobalParameters,
  createPartialMediaSpecificParameters,
} from "../lib/HTMLMetaElement.js";
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
