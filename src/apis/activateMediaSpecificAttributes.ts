import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
  getMetaElementList,
} from "../lib/Document.js";
import {
  applyMediaSpecificParameters,
  createPartialMediaSpecificParameters,
} from "../lib/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "../lib/MatchMedia.js";
import {
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
} from "../lib/MediaSpecificParameters.js";

export const activateMediaSpecificAttributes = (): void => {
  if (typeof window !== "undefined") {
    const viewportMetaElement = ensureViewportMetaElement(document);
    const metaElementList = getMetaElementList(document);
    const partialMediaSpecificParametersList = metaElementList.map(
      createPartialMediaSpecificParameters,
    );
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
    );
  }
};
