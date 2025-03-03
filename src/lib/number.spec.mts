import { describe, expect, it } from "vitest";
import { truncateDecimalNumber } from "./number.mjs";

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
