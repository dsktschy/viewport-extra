import type { Content, ContentMinWidth } from "./lib/Content.js";
import * as ContentModule from "./lib/Content.js";
import type { DeepPartial } from "./lib/DeepPartial.js";
import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
  getViewportExtraMetaElementList,
} from "./lib/Document.js";
import {
  createGlobalParameters,
  type GlobalParameters,
  mergePartialGlobalParameters,
} from "./lib/GlobalParameters.js";
import * as HTMLMetaElementModule from "./lib/HTMLMetaElement.js";
import {
  applyMediaSpecificParameters,
  applyMediaSpecificParametersUnscaled,
  createPartialGlobalParameters,
} from "./lib/HTMLMetaElement.js";
import { createMatchMediaPredicate } from "./lib/MatchMedia.js";
import * as MediaSpecificParametersModule from "./lib/MediaSpecificParameters.js";
import {
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
  type MediaSpecificParameters,
  mergePartialMediaSpecificParameters,
} from "./lib/MediaSpecificParameters.js";
import { createPartialContent } from "./lib/number.js";

let viewportMetaElement: HTMLMetaElement | null = null;
let viewportExtraMetaElementList: HTMLMetaElement[] = [];
let internalGlobalParameters: GlobalParameters | null = null;
let internalPartialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[] =
  [];

if (typeof window !== "undefined") {
  viewportMetaElement = ensureViewportMetaElement(document);
  viewportExtraMetaElementList = getViewportExtraMetaElementList(document);
  internalGlobalParameters = createGlobalParameters(
    [
      createPartialGlobalParameters(viewportMetaElement),
      ...viewportExtraMetaElementList.map(createPartialGlobalParameters),
    ].reduce(mergePartialGlobalParameters),
  );
  internalPartialMediaSpecificParametersList = [
    HTMLMetaElementModule.createPartialMediaSpecificParameters(
      viewportMetaElement,
    ),
    ...viewportExtraMetaElementList.map(
      HTMLMetaElementModule.createPartialMediaSpecificParameters,
    ),
  ];
  // For backward compatibility,
  // side effects force unscaled computing regardless of data-(extra-)unscaled-computing attributes
  // It's so that document.documentElement.clientWidth can work
  // in the case where viewport meta element does not exist
  applyMediaSpecificParametersUnscaled(
    viewportMetaElement,
    () => getDocumentClientWidth(document),
    () =>
      createMediaSpecificParameters(
        internalPartialMediaSpecificParametersList.reduce(
          createPartialMediaSpecificParametersMerger(
            createMatchMediaPredicate(matchMedia),
          ),
          // Value that does not need to check matching current viewport
          createMediaSpecificParameters(),
        ),
      ),
    internalGlobalParameters,
  );
  if (
    Date.now() < Date.UTC(2026, 1, 23, 0, 0, 0) &&
    !viewportMetaElement.hasAttribute("data-extra-no-migration-message")
  ) {
    // x-release-please-start-version
    console.info(
      "[Viewport Extra]\n\n" +
        "v3 includes breaking changes.\n\n" +
        "More info: https://github.com/dsktschy/viewport-extra/blob/v2.5.1-rc.0/README.md#how-to-handle-v3\n\n" +
        'To suppress this message, add the `data-extra-no-migration-message` attribute to the `<meta name="viewport">` element.',
    );
    // x-release-please-end
  }
}

export const setParameters = (
  partialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[],
  partialGlobalParameters: Partial<GlobalParameters> = {},
): void => {
  if (
    typeof window === "undefined" ||
    !viewportMetaElement ||
    !internalGlobalParameters
  )
    return;
  internalGlobalParameters = createGlobalParameters(
    [internalGlobalParameters, partialGlobalParameters].reduce(
      mergePartialGlobalParameters,
    ),
  );
  internalPartialMediaSpecificParametersList = [
    ...internalPartialMediaSpecificParametersList,
    ...partialMediaSpecificParametersList,
  ];
  applyMediaSpecificParameters(
    viewportMetaElement,
    () => getDocumentClientWidth(document),
    () =>
      createMediaSpecificParameters(
        internalPartialMediaSpecificParametersList.reduce(
          createPartialMediaSpecificParametersMerger(
            createMatchMediaPredicate(matchMedia),
          ),
          // Value that does not need to check matching current viewport
          createMediaSpecificParameters(),
        ),
      ),
    internalGlobalParameters,
  );
};

export const setContent = (partialContent: Partial<Content>): void => {
  if (
    typeof window === "undefined" ||
    !viewportMetaElement ||
    !internalGlobalParameters
  )
    return;
  internalPartialMediaSpecificParametersList = [
    ...internalPartialMediaSpecificParametersList,
    ContentModule.createPartialMediaSpecificParameters(partialContent),
  ];
  applyMediaSpecificParameters(
    viewportMetaElement,
    () => getDocumentClientWidth(document),
    () =>
      createMediaSpecificParameters(
        internalPartialMediaSpecificParametersList.reduce(
          createPartialMediaSpecificParametersMerger(
            createMatchMediaPredicate(matchMedia),
          ),
          // Value that does not need to check matching current viewport
          createMediaSpecificParameters(),
        ),
      ),
    internalGlobalParameters,
  );
};

/**
 * - Merge content properties of all objects in internalPartialMediaSpecificParametersList variable and return it
 * - Feature assuming that media properties are not used
 * @deprecated
 * */
export const getContent = (): Content =>
  MediaSpecificParametersModule.getContent(
    createMediaSpecificParameters(
      internalPartialMediaSpecificParametersList.reduce(
        mergePartialMediaSpecificParameters,
        // For environments where no window object exists
        createMediaSpecificParameters(),
      ),
    ),
  );

export const updateReference = (): void => {
  if (typeof window === "undefined") return;
  viewportMetaElement = ensureViewportMetaElement(document);
};

/**
 * - For compatibility with v1
 * @deprecated
 */
export default class ViewportExtra {
  constructor(
    partialContentOrContentMinWidth: Partial<Content> | ContentMinWidth,
  ) {
    setContent(
      typeof partialContentOrContentMinWidth === "number"
        ? createPartialContent(partialContentOrContentMinWidth)
        : partialContentOrContentMinWidth,
    );
  }
  static setParameters = setParameters;
  static setContent = setContent;
  static getContent = getContent;
  static updateReference = updateReference;
}
