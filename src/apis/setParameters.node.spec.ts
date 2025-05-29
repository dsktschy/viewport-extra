import { describe, expect, it } from "vitest";
import { setParameters } from "./setParameters.js";

describe("setParameters", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", () => {
      expect(() => {
        setParameters([{ content: { minimumWidth: 414 } }]);
      }).not.toThrowError();
    });
  });
});
