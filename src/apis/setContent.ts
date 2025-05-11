import {
  type Content,
  createPartialMediaSpecificParameters,
} from "../lib/Content.js";
import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
} from "../lib/Document.js";
import { createGlobalParameters } from "../lib/GlobalParameters.js";
import { applyMediaSpecificParameters } from "../lib/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "../lib/MatchMedia.js";
import {
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
} from "../lib/MediaSpecificParameters.js";

export const setContent = (partialContent: Partial<Content>): void => {
  if (typeof window === "undefined") return;
  const viewportMetaElement = ensureViewportMetaElement(document);
  const globalParameters = createGlobalParameters();
  const partialMediaSpecificParametersList = [
    createPartialMediaSpecificParameters(partialContent),
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
};
