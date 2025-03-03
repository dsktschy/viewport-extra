import { describe, expect, it } from "vitest";
import { createMedia, mergeOptionalMedia } from "./Media.mjs";

describe("createMedia", () => {
  describe("case where argument is not undefined", () => {
    it("should return argument", () => {
      expect(createMedia("(min-width: 768px)")).toBe("(min-width: 768px)");
    });
  });

  describe("case where argument is undefined", () => {
    it("should return default value", () => {
      expect(createMedia(undefined)).toBe("");
    });
  });
});

describe("mergeOptionalMedia", () => {
  describe("case where only first argument is not undefined", () => {
    it("should return first argument", () => {
      expect(mergeOptionalMedia("(min-width: 768px)", undefined)).toBe(
        "(min-width: 768px)",
      );
    });
  });

  describe("case where only second argument is not undefined", () => {
    it("should return second argument", () => {
      expect(mergeOptionalMedia(undefined, "(min-width: 768px)")).toBe(
        "(min-width: 768px)",
      );
    });
  });

  describe("case where first and second arguments are not undefined", () => {
    it("should return second argument", () => {
      expect(
        mergeOptionalMedia("(min-width: 768px)", "(min-width: 1024px)"),
      ).toBe("(min-width: 1024px)");
    });
  });

  describe("case where first and second arguments are undefined", () => {
    it("should return undefined", () => {
      expect(mergeOptionalMedia(undefined, undefined)).toBe(undefined);
    });
  });
});
