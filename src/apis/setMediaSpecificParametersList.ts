import type { DeepPartial } from "../internal/DeepPartial.js";
import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
} from "../internal/Document.js";
import { applyMediaSpecificParameters } from "../internal/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "../internal/MatchMedia.js";
import {
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
  type MediaSpecificParameters,
} from "../internal/MediaSpecificParameters.js";

export const setMediaSpecificParametersList = (
  partialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[],
): void => {
  if (typeof window === "undefined") return;
  applyMediaSpecificParameters(
    ensureViewportMetaElement(document),
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
};
