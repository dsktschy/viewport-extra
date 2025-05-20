import { describe, expect, it } from "vitest";
import { setMediaSpecificParametersList } from "./setMediaSpecificParametersList.js";

describe("setMediaSpecificParametersList", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", () => {
      expect(() => {
        setMediaSpecificParametersList([{ content: { minWidth: 414 } }]);
      }).not.toThrowError();
    });
  });
});
