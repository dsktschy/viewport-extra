import { describe, expect, it } from "vitest";
import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
  getViewportExtraMetaElementList,
} from "./Document.js";

describe("ensureViewportMetaElement", () => {
  describe("case where viewport meta element exists", () => {
    it("should return existing viewport meta element", () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=414,initial-scale=2" />
      `;
      expect(ensureViewportMetaElement(document)).toBe(
        document.querySelector('meta[name="viewport"]'),
      );
    });
  });

  describe("case where viewport meta element does not exist", () => {
    it("should append viewport meta element to HTML and returns appended viewport meta element", () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
      `;
      const returnedViewportMetaElement = ensureViewportMetaElement(document);
      const selectedViewportMetaElement = document.querySelector(
        'meta[name="viewport"]',
      );
      expect(selectedViewportMetaElement).not.toBe(null);
      expect(returnedViewportMetaElement).toBe(selectedViewportMetaElement);
    });
  });
});

describe("getViewportExtraMetaElementList", () => {
  describe("case where viewport meta elements exist", () => {
    it("should return existing viewport-extra meta elements without viewport meta element", () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=414" />
        <meta name="viewport-extra" content="max-width=768" />
      `;
      const selectedViewportMetaElementList = document.querySelectorAll(
        'meta[name="viewport-extra"]',
      );
      getViewportExtraMetaElementList(document).forEach(
        (returnedViewportExtraMetaElement, index) => {
          expect(returnedViewportExtraMetaElement).toBe(
            selectedViewportMetaElementList[index],
          );
        },
      );
    });
  });

  describe("case where viewport meta elements do not exist", () => {
    it("should return empty array", () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      `;
      expect(getViewportExtraMetaElementList(document).length).toBe(0);
    });
  });
});

describe("getDocumentClientWidth", () => {
  it("should return document.documentElement.clientWidth", () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      value: 414,
      configurable: true,
    });
    expect(getDocumentClientWidth(document)).toBe(414);
  });
});
