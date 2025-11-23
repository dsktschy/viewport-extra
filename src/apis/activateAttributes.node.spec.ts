import { describe, expect, it } from "vitest";
import { activateAttributes } from "./activateAttributes.js";

describe("activateAttributes", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", () => {
      expect(activateAttributes).not.toThrowError();
    });
  });
});
