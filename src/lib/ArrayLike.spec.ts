import { describe, expect, it } from "vitest";
import { arrayFrom } from "./ArrayLike.js";

describe("arrayFrom", () => {
  describe("case where target of TypeScript is not es5", () => {
    it("should return Array.from", async () => {
      expect(arrayFrom).toBe(Array.from);
    });
  });
});
