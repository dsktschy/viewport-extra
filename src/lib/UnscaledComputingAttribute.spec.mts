import { describe, expect, it } from "vitest";
import {
  createOptionalUnscaledComputing,
  mergeNullableUnscaledComputingAttribute,
} from "./UnscaledComputingAttribute.mjs";

describe("mergeNullableUnscaledComputingAttribute", () => {
  describe("case where only first argument is not null", () => {
    it("should return first argument", () => {
      expect(mergeNullableUnscaledComputingAttribute("", null)).toBe("");
    });
  });

  describe("case where only second argument is not null", () => {
    it("should return second argument", () => {
      expect(mergeNullableUnscaledComputingAttribute(null, "")).toBe("");
    });
  });

  describe("case where first and second arguments are not null", () => {
    it("should return second argument", () => {
      expect(mergeNullableUnscaledComputingAttribute("foo", "")).toBe("");
    });
  });

  describe("case where first and second arguments are null", () => {
    it("should return null", () => {
      expect(mergeNullableUnscaledComputingAttribute(null, null)).toBe(null);
    });
  });
});

describe("createOptionalUnscaledComputing", () => {
  describe("case where argument is not null", () => {
    it("should return true", () => {
      expect(createOptionalUnscaledComputing("")).toBe(true);
    });
  });

  describe("case where argument is null", () => {
    it("should return undefined", () => {
      expect(createOptionalUnscaledComputing(null)).toBe(undefined);
    });
  });
});
