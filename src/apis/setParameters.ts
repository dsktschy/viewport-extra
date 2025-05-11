import type { DeepPartial } from "../lib/DeepPartial.js";
import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
} from "../lib/Document.js";
import {
  type GlobalParameters,
  createGlobalParameters,
} from "../lib/GlobalParameters.js";
import { applyMediaSpecificParameters } from "../lib/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "../lib/MatchMedia.js";
import {
  type MediaSpecificParameters,
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
} from "../lib/MediaSpecificParameters.js";

export const setParameters = (
  partialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[],
  partialGlobalParameters: Partial<GlobalParameters> = {},
): void => {
  if (typeof window === "undefined") return;
  const viewportMetaElement = ensureViewportMetaElement(document);
  const globalParameters = createGlobalParameters(partialGlobalParameters);
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
