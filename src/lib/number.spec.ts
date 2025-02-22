import { describe, expect, it } from "vitest";
import { createPartialContent, truncateDecimalNumber } from "./number.js";

describe("createPartialContent", () => {
  it("should return object whose min-width property is argument value", () => {
    expect(createPartialContent(414)).toStrictEqual({ minWidth: 414 });
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
