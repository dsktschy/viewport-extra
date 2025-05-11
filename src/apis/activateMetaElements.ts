import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
  getViewportExtraMetaElementList,
} from "../lib/Document.js";
import {
  createGlobalParameters,
  mergePartialGlobalParameters,
} from "../lib/GlobalParameters.js";
import {
  applyMediaSpecificParameters,
  createPartialGlobalParameters,
  createPartialMediaSpecificParameters,
} from "../lib/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "../lib/MatchMedia.js";
import {
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
} from "../lib/MediaSpecificParameters.js";

export const activateMetaElements = (): void => {
  if (typeof window !== "undefined") {
    const viewportMetaElement = ensureViewportMetaElement(document);
    const viewportExtraMetaElementList =
      getViewportExtraMetaElementList(document);
    const globalParameters = createGlobalParameters(
      [
        createPartialGlobalParameters(viewportMetaElement),
        ...viewportExtraMetaElementList.map(createPartialGlobalParameters),
      ].reduce(mergePartialGlobalParameters),
    );
    const partialMediaSpecificParametersList = [
      createPartialMediaSpecificParameters(viewportMetaElement),
      ...viewportExtraMetaElementList.map(createPartialMediaSpecificParameters),
    ];
    applyMediaSpecificParameters(
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
