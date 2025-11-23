import { describe, expect, it } from "vitest";
import { arrayFrom } from "./ArrayLike.js";

describe("arrayFrom", () => {
  describe("case where target of TypeScript is es5", () => {
    it("should not return Array.from", async () => {
      expect(arrayFrom).not.toBe(Array.from);
    });

    it("should behave same as Array.from", async () => {
      expect(arrayFrom("foo")).toStrictEqual(Array.from("foo"));
    });
  });
});
