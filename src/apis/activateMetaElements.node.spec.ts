import { describe, expect, it } from "vitest";
import { activateMetaElements } from "./activateMetaElements.js";

describe("activateMetaElements", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", () => {
      expect(activateMetaElements).not.toThrowError();
    });
  });
});
