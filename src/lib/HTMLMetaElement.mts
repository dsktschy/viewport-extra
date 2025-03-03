import {
  type ContentAttribute,
  createOptionalPartialContent,
  mergeNullableContentAttributes,
} from "./ContentAttribute.mjs";
import {
  type DecimalPlacesAttribute,
  createOptionalDecimalPlaces,
  mergeNullableDecimalPlacesAttribute,
} from "./DecimalPlacesAttribute.mjs";
import type { DeepPartial } from "./DeepPartial.mjs";
import {
  type GlobalParameters,
  assignOptionalDecimalPlaces,
  assignOptionalUnscaledComputing,
  getDecimalPlaces,
  getUnscaledComputing,
} from "./GlobalParameters.mjs";
import {
  type MediaAttribute,
  createOptionalMedia,
  mergeNullableMediaAttribute,
} from "./MediaAttribute.mjs";
import {
  type MediaSpecificParameters,
  assignOptionalMedia,
  assignOptionalPartialContent,
  createContentAttribute,
} from "./MediaSpecificParameters.mjs";
import {
  type UnscaledComputingAttribute,
  createOptionalUnscaledComputing,
  mergeNullableUnscaledComputingAttribute,
} from "./UnscaledComputingAttribute.mjs";

export const getNullableUnscaledComputingAttribute = (
  htmlMetaElement: HTMLMetaElement,
): UnscaledComputingAttribute | null =>
  mergeNullableUnscaledComputingAttribute(
    htmlMetaElement.getAttribute("data-unscaled-computing"),
    htmlMetaElement.getAttribute("data-extra-unscaled-computing"),
  );

export const getNullableDecimalPlacesAttribute = (
  htmlMetaElement: HTMLMetaElement,
): DecimalPlacesAttribute | null =>
  mergeNullableDecimalPlacesAttribute(
    htmlMetaElement.getAttribute("data-decimal-places"),
    htmlMetaElement.getAttribute("data-extra-decimal-places"),
  );

export const createPartialGlobalParameters = (
  htmlMetaElement: HTMLMetaElement,
): Partial<GlobalParameters> =>
  assignOptionalDecimalPlaces(
    assignOptionalUnscaledComputing(
      undefined,
      createOptionalUnscaledComputing(
        getNullableUnscaledComputingAttribute(htmlMetaElement),
      ),
    ),
    createOptionalDecimalPlaces(
      getNullableDecimalPlacesAttribute(htmlMetaElement),
    ),
  );

export const getNullableContentAttribute = (
  htmlMetaElement: HTMLMetaElement,
): ContentAttribute | null =>
  mergeNullableContentAttributes(
    htmlMetaElement.getAttribute("content"),
    htmlMetaElement.getAttribute("data-extra-content"),
  );

export const getNullableMediaAttribute = (
  htmlMetaElement: HTMLMetaElement,
): MediaAttribute | null =>
  mergeNullableMediaAttribute(
    htmlMetaElement.getAttribute("data-media"),
    htmlMetaElement.getAttribute("data-extra-media"),
  );

export const createPartialMediaSpecificParameters = (
  htmlMetaElement: HTMLMetaElement,
): DeepPartial<MediaSpecificParameters> =>
  assignOptionalMedia(
    assignOptionalPartialContent(
      undefined,
      createOptionalPartialContent(
        getNullableContentAttribute(htmlMetaElement),
      ),
    ),
    createOptionalMedia(getNullableMediaAttribute(htmlMetaElement)),
  );

export const setContentAttribute = (
  htmlMetaElement: HTMLMetaElement,
  contentAttribute: ContentAttribute,
): void => htmlMetaElement.setAttribute("content", contentAttribute);

export const applyMediaSpecificParameters = (
  htmlMetaElement: HTMLMetaElement,
  getDocumentClientWidth: () => number,
  getMediaSpecificParameters: () => MediaSpecificParameters,
  globalParameters: GlobalParameters,
): void => {
  if (getUnscaledComputing(globalParameters))
    setContentAttribute(htmlMetaElement, createContentAttribute());
  setContentAttribute(
    htmlMetaElement,
    createContentAttribute(
      getMediaSpecificParameters(),
      getDocumentClientWidth(),
      getDecimalPlaces(globalParameters),
    ),
  );
};

export const applyMediaSpecificParametersUnscaled = (
  htmlMetaElement: HTMLMetaElement,
  getDocumentClientWidth: () => number,
  getMediaSpecificParameters: () => MediaSpecificParameters,
  globalParameters: GlobalParameters,
): void => {
  setContentAttribute(htmlMetaElement, createContentAttribute());
  setContentAttribute(
    htmlMetaElement,
    createContentAttribute(
      getMediaSpecificParameters(),
      getDocumentClientWidth(),
      getDecimalPlaces(globalParameters),
    ),
  );
};
