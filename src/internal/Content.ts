import type { ContentAttribute } from "./ContentAttribute.js";
import type { DecimalPlaces } from "./DecimalPlaces.js";
import { truncateDecimalNumber } from "./number.js";
import { kebabizeCamelCaseString } from "./string.js";

export type Content = {
  width: number | "device-width";
  initialScale: number;
  minimumWidth: number;
  maximumWidth: number;
  /** Alternative to `minimumWidth` */
  minWidth?: number;
  /** Alternative to `maximumWidth` */
  maxWidth?: number;
} & {
  [key: string]: string | number;
};

export const defaultContent = {
  width: "device-width" as const,
  initialScale: 1,
  minimumWidth: 0,
  maximumWidth: Infinity,
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

export const createContentAttribute: {
  (
    content: Content,
    documentClientWidth: number,
    decimalPlaces: DecimalPlaces,
  ): ContentAttribute;
  (): ContentAttribute;
} = (
  content: Content = { ...defaultContent },
  // biome-ignore lint/style/noInferrableTypes: number type cannot be inferred from initialization
  documentClientWidth: number = 0,
  decimalPlaces: DecimalPlaces = 0,
) => {
  const { width, initialScale } = content;
  const {
    minimumWidth: _minimumWidth,
    maximumWidth: _maximumWidth,
    minWidth,
    maxWidth,
    ...contentWithoutExtraProperties
  } = content;
  const minimumWidth = minWidth ?? _minimumWidth;
  const maximumWidth = maxWidth ?? _maximumWidth;
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
};
