import { describe, expect, it } from "vitest";

describe("side effects", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", async () => {
      await expect(import("./viewport-extra.mjs")).resolves.not.toThrowError();
    });
  });
});

describe("setParameters", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", async () => {
      const { setParameters } = await import("./viewport-extra.mjs");
      expect(() => {
        setParameters([{ content: { minWidth: 414 } }]);
      }).not.toThrowError();
    });
  });
});

describe("setContent", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", async () => {
      const { setContent } = await import("./viewport-extra.mjs");
      expect(() => {
        setContent({ minWidth: 414 });
      }).not.toThrowError();
    });
  });
});

describe("getContent", () => {
  describe("running in environments where no window object exists", () => {
    it("returns default Content object", async () => {
      const { getContent } = await import("./viewport-extra.mjs");
      expect(getContent()).toStrictEqual({
        width: "device-width",
        initialScale: 1,
        minWidth: 0,
        maxWidth: Number.POSITIVE_INFINITY,
      });
    });
  });
});

describe("updateReference", () => {
  describe("running in environments where no window object exists", () => {
    it("does not throw error", async () => {
      const { updateReference } = await import("./viewport-extra.mjs");
      expect(() => {
        updateReference();
      }).not.toThrowError();
    });
  });
});
