import type { DeepPartial } from "../internal/DeepPartial.js";
import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
} from "../internal/Document.js";
import {
  createGlobalParameters,
  type GlobalParameters,
} from "../internal/GlobalParameters.js";
import { applyMediaSpecificParametersTruncated } from "../internal/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "../internal/MatchMedia.js";
import {
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
  type MediaSpecificParameters,
} from "../internal/MediaSpecificParameters.js";

export const setParameters = (
  partialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[],
  partialGlobalParameters: Partial<GlobalParameters> = {},
): void => {
  if (typeof window === "undefined") return;
  applyMediaSpecificParametersTruncated(
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
    createGlobalParameters(partialGlobalParameters),
  );
};
