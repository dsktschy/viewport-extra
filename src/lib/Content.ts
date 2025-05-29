import type { ContentAttribute } from "./ContentAttribute.js";
import type { DecimalPlaces } from "./DecimalPlaces.js";
import { truncateDecimalNumber } from "./number.js";
import { kebabizeCamelCaseString } from "./string.js";

export interface Content {
  width: number | "device-width";
  initialScale: number;
  minimumWidth: number;
  maximumWidth: number;
  [key: string]: string | number;
}

export const defaultContent = {
  width: "device-width" as const,
  initialScale: 1,
  minimumWidth: 0,
  maximumWidth: Number.POSITIVE_INFINITY,
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
  const { minimumWidth, maximumWidth, ...contentWithoutExtraProperties } =
    content;
  if (minimumWidth <= maximumWidth && width === "device-width") {
    if (documentClientWidth < minimumWidth) {
      contentWithoutExtraProperties.width = minimumWidth;
      contentWithoutExtraProperties.initialScale =
        (documentClientWidth / minimumWidth) * initialScale;
    } else if (documentClientWidth > maximumWidth) {
      contentWithoutExtraProperties.width = maximumWidth;
      contentWithoutExtraProperties.initialScale =
        (documentClientWidth / maximumWidth) * initialScale;
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
