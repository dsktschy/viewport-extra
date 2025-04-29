import { describe, expect, it } from "vitest";
import {
  mathTrunc,
  numberIsFinite,
  numberIsNaN,
  truncateDecimalNumber,
} from "./number.js";

describe("numberIsFinite", () => {
  describe("case where target of TypeScript is es5", () => {
    it("should not return Number.isFinite", async () => {
      expect(numberIsFinite).not.toBe(Number.isFinite);
    });

    it("should behave same as Number.isFinite", async () => {
      // biome-ignore lint/style/useNumberNamespace:
      expect(numberIsFinite(Infinity)).toBe(Number.isFinite(Infinity));
      // biome-ignore lint/style/useNumberNamespace:
      expect(numberIsFinite(NaN)).toBe(Number.isFinite(NaN));
      expect(numberIsFinite("0.123456789")).toBe(
        Number.isFinite("0.123456789"),
      );
      expect(numberIsFinite(0.123456789)).toBe(Number.isFinite(0.123456789));
    });
  });
});

describe("mathTrunc", () => {
  describe("case where target of TypeScript is es5", () => {
    it("should not return Math.trunc", async () => {
      expect(mathTrunc).not.toBe(Math.trunc);
    });

    it("should behave same as Math.trunc", async () => {
      expect(mathTrunc(0.123456789)).toBe(Math.trunc(0.123456789));
      expect(mathTrunc(-0.123456789)).toBe(Math.trunc(-0.123456789));
    });
  });
});

describe("numberIsNaN", () => {
  describe("case where target of TypeScript is es5", () => {
    it("should not return Number.isNaN", async () => {
      expect(numberIsNaN).not.toBe(Number.isNaN);
    });

    it("should behave same as Number.isNaN", async () => {
      expect(numberIsNaN(0.123456789)).toBe(Number.isNaN(0.123456789));
      // biome-ignore lint/style/useNumberNamespace:
      expect(numberIsNaN(Infinity)).toBe(Number.isNaN(Infinity));
      expect(numberIsNaN("NaN")).toBe(Number.isNaN("NaN"));
      // biome-ignore lint/style/useNumberNamespace:
      expect(numberIsNaN(NaN)).toBe(Number.isNaN(NaN));
    });
  });
});

describe("truncateDecimalNumber", () => {
  describe("case where second argument is finite", () => {
    it("should return truncated number", () => {
      expect(truncateDecimalNumber(0.123456789, 6)).toBe(0.123456);
    });
  });

  describe("case where second argument is infinite", () => {
    it("should return second argument", () => {
      expect(truncateDecimalNumber(0.123456789, Number.POSITIVE_INFINITY)).toBe(
        0.123456789,
      );
    });
  });
});
