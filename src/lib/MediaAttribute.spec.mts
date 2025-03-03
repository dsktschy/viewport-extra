import { describe, expect, it } from "vitest";
import {
  createOptionalMedia,
  mergeNullableMediaAttribute,
} from "./MediaAttribute.js";

describe("mergeNullableMediaAttribute", () => {
  describe("case where only first argument is not null", () => {
    it("should return first argument", () => {
      expect(mergeNullableMediaAttribute("(min-width: 768px)", null)).toBe(
        "(min-width: 768px)",
      );
    });
  });

  describe("case where only second argument is not null", () => {
    it("should return second argument", () => {
      expect(mergeNullableMediaAttribute(null, "(min-width: 768px)")).toBe(
        "(min-width: 768px)",
      );
    });
  });

  describe("case where first and second arguments are not null", () => {
    it("should return second argument", () => {
      expect(
        mergeNullableMediaAttribute(
          "(min-width: 768px)",
          "(min-width: 1024px)",
        ),
      ).toBe("(min-width: 1024px)");
    });
  });

  describe("case where first and second arguments are null", () => {
    it("should return null", () => {
      expect(mergeNullableMediaAttribute(null, null)).toBe(null);
    });
  });
});

describe("createOptionalMedia", () => {
  describe("case where argument is not null", () => {
    it("should return argument", () => {
      expect(createOptionalMedia("(min-width: 768px)")).toBe(
        "(min-width: 768px)",
      );
    });
  });

  describe("case where argument is null", () => {
    it("should return undefined", () => {
      expect(createOptionalMedia(null)).toBe(undefined);
    });
  });
});
