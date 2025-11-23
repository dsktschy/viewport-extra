import { describe, expect, it } from "vitest";
import { activateMediaSpecificAttributes } from "./activateMediaSpecificAttributes.js";

describe("activateMediaSpecificAttributes", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", () => {
      expect(activateMediaSpecificAttributes).not.toThrowError();
    });
  });
});
