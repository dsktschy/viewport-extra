import { describe, expect, it } from "vitest";

describe("side effects", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", async () => {
      await expect(import("./viewport-extra.js")).resolves.not.toThrowError();
    });
  });
});

describe("setParameters", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", async () => {
      const { setParameters } = await import("./viewport-extra.js");
      expect(() => {
        setParameters([{ content: { minWidth: 414 } }]);
      }).not.toThrowError();
    });
  });
});

describe("setContent", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", async () => {
      const { setContent } = await import("./viewport-extra.js");
      expect(() => {
        setContent({ minWidth: 414 });
      }).not.toThrowError();
    });
  });
});
