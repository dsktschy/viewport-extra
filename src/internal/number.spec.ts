import { describe, expect, it } from "vitest";
import { mathTrunc, truncateDecimalNumber } from "./number.js";

describe("mathTrunc", () => {
  describe("case where target of TypeScript is not es5", () => {
    it("should return Math.trunc", async () => {
      expect(mathTrunc).toBe(Math.trunc);
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
      expect(truncateDecimalNumber(0.123456789, Infinity)).toBe(0.123456789);
    });
  });
});
