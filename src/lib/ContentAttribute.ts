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
          const [key, value] = equalSeparatedContent.split("=");
          const trimmedKey = key.trim();
          if (!trimmedKey) return partialContent;
          const trimmedValue = value.trim();
          if (!trimmedValue) return partialContent;
          const numberValue = +trimmedValue;
          // biome-ignore lint/suspicious/noSelfCompare: polyfill for Number.isNaN
          const numberIsNaN = (x: unknown) => x !== x;
          partialContent[camelizeKebabCaseString(trimmedKey)] = numberIsNaN(
            numberValue,
          )
            ? trimmedValue
            : numberValue;
          return partialContent;
        }, {})
    : undefined;
