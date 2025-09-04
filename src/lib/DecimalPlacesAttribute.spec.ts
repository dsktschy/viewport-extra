import { describe, expect, it } from "vitest";
import {
  createOptionalDecimalPlaces,
  mergeNullableDecimalPlacesAttribute,
} from "./DecimalPlacesAttribute.js";

describe("mergeNullableDecimalPlacesAttribute", () => {
  describe("case where only first argument is not null", () => {
    it("should return first argument", () => {
      expect(mergeNullableDecimalPlacesAttribute("6", null)).toBe("6");
    });
  });

  describe("case where only second argument is not null", () => {
    it("should return second argument", () => {
      expect(mergeNullableDecimalPlacesAttribute(null, "6")).toBe("6");
    });
  });

  describe("case where first and second arguments are not null", () => {
    it("should return second argument", () => {
      expect(mergeNullableDecimalPlacesAttribute("6", "0")).toBe("0");
    });
  });

  describe("case where first and second arguments are null", () => {
    it("should return null", () => {
      expect(mergeNullableDecimalPlacesAttribute(null, null)).toBe(null);
    });
  });
});

describe("createOptionalDecimalPlaces", () => {
  describe("case where argument string is finite number", () => {
    it("should convert argument to number type and return it", () => {
      expect(createOptionalDecimalPlaces("6")).toBe(6);
    });
  });

  describe("case where argument string is Infinity", () => {
    it("should convert argument to number type and return it", () => {
      expect(createOptionalDecimalPlaces("Infinity")).toBe(Infinity);
    });
  });

  describe("case where argument is null", () => {
    it("should return undefined", () => {
      expect(createOptionalDecimalPlaces(null)).toBe(undefined);
    });
  });
});
