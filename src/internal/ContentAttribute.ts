import type { Content } from "./Content.js";
import { camelizeKebabCaseString } from "./string.js";

export type ContentAttribute = string;

export const mergeNullableContentAttributes = (
  precedingNullableContentAttribute: ContentAttribute | null,
  followingNullableContentAttribute: ContentAttribute | null,
): ContentAttribute | null =>
  precedingNullableContentAttribute
    ? followingNullableContentAttribute
      ? [
          precedingNullableContentAttribute,
          followingNullableContentAttribute,
        ].join(",")
      : precedingNullableContentAttribute
    : followingNullableContentAttribute;

export const createOptionalPartialContent = (
  nullableContentAttribute: ContentAttribute | null,
): Partial<Content> | undefined =>
  nullableContentAttribute
    ? nullableContentAttribute
        .split(",")
        .reduce<Partial<Content>>((partialContent, equalSeparatedContent) => {
          const [key, value] = equalSeparatedContent
            .split("=")
            .map((keyOrValue) => keyOrValue.trim());
          if (key && value) {
            const numberValue = +value;
            // biome-ignore lint/suspicious/noGlobalIsNan: isNaN is safe to use here
            partialContent[camelizeKebabCaseString(key)] = isNaN(numberValue)
              ? value
              : numberValue;
          }
          return partialContent;
        }, {})
    : undefined;
