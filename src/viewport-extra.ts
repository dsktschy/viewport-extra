import * as ContentModule from "./lib/Content.js";
import type { Content } from "./lib/Content.js";
import type { DeepPartial } from "./lib/DeepPartial.js";
import {
  ensureViewportElement,
  getDocumentClientWidth,
  getViewportExtraElementList,
} from "./lib/Document.js";
import {
  type GlobalParameters,
  createGlobalParameters,
  mergePartialGlobalParameters,
} from "./lib/GlobalParameters.js";
import * as HTMLMetaElementModule from "./lib/HTMLMetaElement.js";
import {
  applyMediaSpecificParameters,
  applyMediaSpecificParametersUnscaled,
  createPartialGlobalParameters,
} from "./lib/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "./lib/MatchMedia.js";
import {
  type MediaSpecificParameters,
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
} from "./lib/MediaSpecificParameters.js";

if (typeof window !== "undefined") {
  const viewportElement = ensureViewportElement(document);
  const viewportExtraElementList = getViewportExtraElementList(document);
  const globalParameters = createGlobalParameters(
    [
      createPartialGlobalParameters(viewportElement),
      ...viewportExtraElementList.map(createPartialGlobalParameters),
    ].reduce(mergePartialGlobalParameters),
  );
  const partialMediaSpecificParametersList = [
    HTMLMetaElementModule.createPartialMediaSpecificParameters(viewportElement),
    ...viewportExtraElementList.map(
      HTMLMetaElementModule.createPartialMediaSpecificParameters,
    ),
  ];
  // For backward compatibility,
  // side effects force unscaled computing regardless of data-(extra-)unscaled-computing attributes
  // It's so that document.documentElement.clientWidth can work
  // in the case where viewport meta element does not exist
  applyMediaSpecificParametersUnscaled(
    viewportElement,
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

export const setParameters = (
  partialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[],
  partialGlobalParameters: Partial<GlobalParameters> = {},
): void => {
  if (typeof window === "undefined") return;
  const viewportElement = ensureViewportElement(document);
  const globalParameters = createGlobalParameters(partialGlobalParameters);
  applyMediaSpecificParameters(
    viewportElement,
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

export const setContent = (partialContent: Partial<Content>): void => {
  if (typeof window === "undefined") return;
  const viewportElement = ensureViewportElement(document);
  const globalParameters = createGlobalParameters();
  const partialMediaSpecificParametersList = [
    ContentModule.createPartialMediaSpecificParameters(partialContent),
  ];
  applyMediaSpecificParameters(
    viewportElement,
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
