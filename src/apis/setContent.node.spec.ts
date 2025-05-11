import { describe, expect, it } from "vitest";
import { setContent } from "./setContent.js";

describe("setContent", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", () => {
      expect(() => {
        setContent({ minWidth: 414 });
      }).not.toThrowError();
    });
  });
});
