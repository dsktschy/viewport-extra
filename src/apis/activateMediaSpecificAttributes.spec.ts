import { beforeEach, describe, expect, it } from "vitest";
import { activateMediaSpecificAttributes } from "./activateMediaSpecificAttributes.js";

beforeEach(() => {
  document.documentElement.innerHTML = "<head></head><body></body>";
});

describe("activateMediaSpecificAttributes", () => {
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
          <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" />
        `;
        activateMediaSpecificAttributes();
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
          <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" />
        `;
        activateMediaSpecificAttributes();
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });
  });

  describe("behavior according to attributes of viewport(-extra) meta elements", () => {
    describe("(data-extra-)content attribute", () => {
      describe("case where min-width value is greater than viewport width", () => {
        it("updates width to min-width and initial-scale to value that min-width fits into viewport", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" />
          `;
          activateMediaSpecificAttributes();
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7729468599033816,width=414");
        });
      });

      describe("case where max-width value is less than viewport width", () => {
        it("updates width to max-width and initial-scale to value that max-width fits into viewport", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 1024,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="max-width=768" />
          `;
          activateMediaSpecificAttributes();
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1.3333333333333333,width=768");
        });
      });

      describe("case where min-width value is less than viewport width and max-width value is greater than viewport width", () => {
        it("does not update width and initial-scale", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 640,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414,max-width=768" />
          `;
          activateMediaSpecificAttributes();
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
        });
      });

      describe("case where initial-scale value is set", () => {
        it("multiplies initial-scale to computed initial-scale", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-content="min-width=414" />
          `;
          activateMediaSpecificAttributes();
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.3864734299516908,width=414");
        });
      });

      describe("case where attribute is not set", () => {
        it("computes with default Content object", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" />
          `;
          activateMediaSpecificAttributes();
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
        });
      });

      describe("case where any values are not set", () => {
        it("computes with values in default Content object", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="" data-extra-content="" />
          `;
          activateMediaSpecificAttributes();
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
        });
      });
    });
  });

  describe("determination of value to apply from multiple viewport(-extra) meta elements", () => {
    describe("(data-extra-)content attributes", () => {
      describe("case where media attributes are not set", () => {
        it("merges attributes of all viewport and viewport-extra meta elements recursively", () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport-extra" content="initial-scale=0.5,min-width=768" />
            <meta name="viewport" content="width=device-width" />
            <meta name="viewport-extra" content="min-width=414" />
            <meta name="viewport" content="initial-scale=1" />
          `;
          activateMediaSpecificAttributes();
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
