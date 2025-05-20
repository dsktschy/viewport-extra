import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
  getMetaElementList,
} from "../lib/Document.js";
import {
  createGlobalParameters,
  mergePartialGlobalParameters,
} from "../lib/GlobalParameters.js";
import {
  applyMediaSpecificParametersTruncated,
  createPartialGlobalParameters,
  createPartialMediaSpecificParameters,
} from "../lib/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "../lib/MatchMedia.js";
import {
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
} from "../lib/MediaSpecificParameters.js";

export const activateAttributes = (): void => {
  if (typeof window !== "undefined") {
    const viewportMetaElement = ensureViewportMetaElement(document);
    const metaElementList = getMetaElementList(document);
    const globalParameters = createGlobalParameters(
      metaElementList
        .map(createPartialGlobalParameters)
        .reduce(mergePartialGlobalParameters),
    );
    const partialMediaSpecificParametersList = metaElementList.map(
      createPartialMediaSpecificParameters,
    );
    applyMediaSpecificParametersTruncated(
      viewportMetaElement,
      () => getDocumentClientWidth(document),
      () =>
        createMediaSpecificParameters(
          partialMediaSpecificParametersList.reduce(
            createPartialMediaSpecificParametersMerger(
              createMatchMediaPredicate(matchMedia),
            ),
            // Value that does not need to check matching current viewport
            createMediaSpecificParameters(),
          ),
        ),
      globalParameters,
    );
  }
};
