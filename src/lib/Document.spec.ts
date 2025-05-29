import { describe, expect, it } from "vitest";
import {
  ensureViewportMetaElement,
  getDocumentClientWidth,
  getMetaElementList,
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

describe("getMetaElementList", () => {
  describe("case where viewport and viewport-extra meta elements exist", () => {
    it("should return all existing viewport and viewport-extra meta elements as array", () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="viewport" content="initial-scale=1" />
        <meta name="viewport-extra" content="minimum-width=414" />
        <meta name="viewport-extra" content="maximum-width=768" />
      `;
      expect(
        getMetaElementList(document).map(
          (returnedMetaElement) => returnedMetaElement.outerHTML,
        ),
      ).toStrictEqual([
        '<meta name="viewport" content="width=device-width">',
        '<meta name="viewport" content="initial-scale=1">',
        '<meta name="viewport-extra" content="minimum-width=414">',
        '<meta name="viewport-extra" content="maximum-width=768">',
      ]);
    });
  });

  describe("case where viewport and viewport-extra meta elements do not exist", () => {
    it("should return empty array", () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
      `;
      expect(getMetaElementList(document)).toStrictEqual([]);
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
