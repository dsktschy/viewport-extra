import { describe, expect, it } from "vitest";
import {
  mathTrunc,
  numberIsFinite,
  numberIsNaN,
  truncateDecimalNumber,
} from "./number.js";

describe("numberIsFinite", () => {
  describe("case where target of TypeScript is not es5", () => {
    it("should return Number.isFinite", async () => {
      expect(numberIsFinite).toBe(Number.isFinite);
    });
  });
});

describe("mathTrunc", () => {
  describe("case where target of TypeScript is not es5", () => {
    it("should return Math.trunc", async () => {
      expect(mathTrunc).toBe(Math.trunc);
    });
  });
});

describe("numberIsNaN", () => {
  describe("case where target of TypeScript is not es5", () => {
    it("should return Number.isNaN", async () => {
      expect(numberIsNaN).toBe(Number.isNaN);
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
