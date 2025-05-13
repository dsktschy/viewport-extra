import type { ContentAttribute } from "./ContentAttribute.js";
import type { DecimalPlaces } from "./DecimalPlaces.js";
import { truncateDecimalNumber } from "./number.js";
import { kebabizeCamelCaseString } from "./string.js";

export interface Content {
  width: number | "device-width";
  initialScale: number;
  minWidth: number;
  maxWidth: number;
  [key: string]: string | number;
}

export const defaultContent = {
  width: "device-width" as const,
  initialScale: 1,
  minWidth: 0,
  maxWidth: Number.POSITIVE_INFINITY,
};

export const createContent = (
  partialContent: Partial<Content> | undefined = {},
): Content => ({
  ...defaultContent,
  ...partialContent,
});

export const mergeOptionalPartialContent = (
  precedingOptionalPartialContent: Partial<Content> | undefined,
  followingOptionalPartialContent: Partial<Content> | undefined,
): Partial<Content> | undefined =>
  precedingOptionalPartialContent
    ? {
        ...precedingOptionalPartialContent,
        ...(followingOptionalPartialContent ?? {}),
      }
    : followingOptionalPartialContent;

export function createContentAttribute(
  content: Content,
  documentClientWidth: number,
  decimalPlaces: DecimalPlaces,
): ContentAttribute;
export function createContentAttribute(): ContentAttribute;
export function createContentAttribute(
  content: Content = { ...defaultContent },
  documentClientWidth = 0,
  decimalPlaces = 0,
): ContentAttribute {
  const { width, initialScale } = content;
  const { minWidth, maxWidth, ...contentWithoutExtraProperties } = content;
  if (minWidth <= maxWidth && width === "device-width") {
    if (documentClientWidth < minWidth) {
      contentWithoutExtraProperties.width = minWidth;
      contentWithoutExtraProperties.initialScale =
        (documentClientWidth / minWidth) * initialScale;
    } else if (documentClientWidth > maxWidth) {
      contentWithoutExtraProperties.width = maxWidth;
      contentWithoutExtraProperties.initialScale =
        (documentClientWidth / maxWidth) * initialScale;
    }
  }
  return Object.keys(contentWithoutExtraProperties)
    .map(
      (key) =>
        `${kebabizeCamelCaseString(key)}=${
          typeof contentWithoutExtraProperties[key] === "number"
            ? truncateDecimalNumber(
                contentWithoutExtraProperties[key],
                decimalPlaces,
              )
            : contentWithoutExtraProperties[key]
        }`,
    )
    .sort()
    .join(",");
}
