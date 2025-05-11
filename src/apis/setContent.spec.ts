import { beforeEach, describe, expect, it } from "vitest";
import { setContent } from "./setContent.js";

beforeEach(() => {
  document.documentElement.innerHTML = "<head></head><body></body>";
});

describe("setContent", () => {
  describe("viewport meta element to be updated", () => {
    describe("case where viewport meta elements exist", () => {
      it("updates existing first viewport meta element", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        setContent({ minWidth: 414 });
        expect(
          Array.from(document.querySelectorAll('meta[name="viewport"]')).map(
            (element) => element.getAttribute("content"),
          ),
        ).toStrictEqual([
          "initial-scale=0.7729468599033816,width=414",
          "width=device-width,initial-scale=1",
          "width=device-width,initial-scale=1",
        ]);
      });
    });

    describe("case where viewport meta element does not exist", () => {
      it("appends viewport meta element and updates it", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
        `;
        setContent({ minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });
  });

  describe("behavior according to properties of first argument", () => {
    describe("case where minWidth property is greater than viewport width", () => {
      it("updates width to minWidth and initial-scale to value that minWidth fits into viewport", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        setContent({ minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });

    describe("case where maxWidth property is less than viewport width", () => {
      it("updates width to maxWidth and initial-scale to value that maxWidth fits into viewport", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        setContent({ maxWidth: 768 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=1.3333333333333333,width=768");
      });
    });

    describe("case where minWidth property is less than viewport width and maxWidth property is greater than viewport width", () => {
      it("does not update width and initial-scale", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 640,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        setContent({ minWidth: 414, maxWidth: 768 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=1,width=device-width");
      });
    });

    describe("case where initialScale property is set", () => {
      it("multiplies initialScale to computed initial-scale", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        setContent({ initialScale: 0.5, minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.3864734299516908,width=414");
      });
    });

    describe("case where any properties are not set", () => {
      it("computes with values in default Content object", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        setContent({});
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=1,width=device-width");
      });
    });
  });

  describe("behavior according to properties that cannot be specified with arguments", () => {
    describe("decimalPlaces property", () => {
      it("does not update decimal places of calculated content attribute", () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        setContent({ minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });
  });
});
