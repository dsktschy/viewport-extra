import { beforeEach, describe, expect, it } from "vitest";
import { setMediaSpecificParametersList } from "./setMediaSpecificParametersList.js";

beforeEach(() => {
  document.documentElement.innerHTML = "<head></head><body></body>";
});

describe("setMediaSpecificParametersList", () => {
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
        setMediaSpecificParametersList([{ content: { minWidth: 414 } }]);
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
        setMediaSpecificParametersList([{ content: { minWidth: 414 } }]);
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });
  });

  describe("behavior according to argument", () => {
    describe("content property", () => {
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
          setMediaSpecificParametersList([{ content: { minWidth: 414 } }]);
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
          setMediaSpecificParametersList([{ content: { maxWidth: 768 } }]);
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
          setMediaSpecificParametersList([
            { content: { minWidth: 414, maxWidth: 768 } },
          ]);
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
          setMediaSpecificParametersList([
            { content: { initialScale: 0.5, minWidth: 414 } },
          ]);
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.3864734299516908,width=414");
        });
      });

      describe("case where no properties are set", () => {
        it("computes with default Content object", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
          `;
          setMediaSpecificParametersList([]);
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
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
          setMediaSpecificParametersList([{}]);
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
        });
      });
    });
  });

  describe("determination of value to apply from multiple values in argument", () => {
    describe("content properties", () => {
      describe("case where media properties are not set", () => {
        it("merges properties of all items recursively", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
          `;
          setMediaSpecificParametersList([
            { content: { initialScale: 0.25, minWidth: 1024 } },
            { content: { initialScale: 0.5, minWidth: 768 } },
            { content: { initialScale: 1, minWidth: 414 } },
          ]);
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7729468599033816,width=414");
        });
      });
    });
  });
});
