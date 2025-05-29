import { describe, expect, it } from "vitest";
import {
  createContent,
  createContentAttribute,
  mergeOptionalPartialContent,
} from "./Content.js";

describe("createContent", () => {
  describe("case where argument has properties", () => {
    it("should return object that inherits properties of argument", () => {
      expect(
        createContent({
          width: "device-width",
          initialScale: 1,
          minimumWidth: 414,
          maximumWidth: 768,
          interactiveWidget: "resizes-content",
        }),
      ).toStrictEqual({
        width: "device-width",
        initialScale: 1,
        minimumWidth: 414,
        maximumWidth: 768,
        interactiveWidget: "resizes-content",
      });
    });
  });

  describe("case where argument is missing properties as Content type", () => {
    it("should return object with default values for missing properties as Content type", () => {
      expect(createContent({})).toStrictEqual({
        width: "device-width",
        initialScale: 1,
        minimumWidth: 0,
        maximumWidth: Number.POSITIVE_INFINITY,
      });
    });
  });

  describe("case where argument is undefined", () => {
    it("should return object with default values of Content type", () => {
      expect(createContent()).toStrictEqual({
        width: "device-width",
        initialScale: 1,
        minimumWidth: 0,
        maximumWidth: Number.POSITIVE_INFINITY,
      });
    });
  });
});

describe("mergeOptionalPartialContent", () => {
  describe("case where only first argument is not undefined", () => {
    it("should return first argument", () => {
      expect(
        mergeOptionalPartialContent(
          {
            width: "device-width",
            minimumWidth: 414,
            interactiveWidget: "resizes-content",
          },
          undefined,
        ),
      ).toStrictEqual({
        width: "device-width",
        minimumWidth: 414,
        interactiveWidget: "resizes-content",
      });
    });
  });

  describe("case where only second argument is not undefined", () => {
    it("should return second argument", () => {
      expect(
        mergeOptionalPartialContent(undefined, {
          width: "device-width",
          minimumWidth: 414,
          interactiveWidget: "resizes-content",
        }),
      ).toStrictEqual({
        width: "device-width",
        minimumWidth: 414,
        interactiveWidget: "resizes-content",
      });
    });
  });

  describe("case where first and second arguments are not undefined", () => {
    it("should return object that first and second arguments are merged", () => {
      expect(
        mergeOptionalPartialContent(
          {
            width: "device-width",
            initialScale: 1,
          },
          {
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
        ),
      ).toStrictEqual({
        width: "device-width",
        initialScale: 1,
        minimumWidth: 414,
        maximumWidth: 768,
        interactiveWidget: "resizes-content",
      });
    });

    describe("case where first and second arguments have same properties", () => {
      it("should return object that values of second argument are used", () => {
        expect(
          mergeOptionalPartialContent(
            {
              width: "device-width",
              initialScale: 1,
              interactiveWidget: "resizes-content",
            },
            {
              width: 414,
              initialScale: 2,
              interactiveWidget: "overlays-content",
            },
          ),
        ).toStrictEqual({
          width: 414,
          initialScale: 2,
          interactiveWidget: "overlays-content",
        });
      });
    });
  });

  describe("case where first and second arguments are undefined", () => {
    it("should return undefined", () => {
      expect(mergeOptionalPartialContent(undefined, undefined)).toBe(undefined);
    });
  });
});

describe("createContentAttribute", () => {
  describe("case where all arguments are undefined", () => {
    it("should return string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in default value of Content type", () => {
      expect(createContentAttribute()).toBe(
        "initial-scale=1,width=device-width",
      );
    });
  });

  describe("case where second argument is greater than minimumWidth and less than maximumWidth in first argument", () => {
    it("should return string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in first argument", () => {
      expect(
        createContentAttribute(
          {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          640,
          Number.POSITIVE_INFINITY,
        ),
      ).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=device-width",
      );
    });
  });

  describe("case where second argument is less than minimumWidth in first argument", () => {
    it("should compute width and initialScale from first and second argument to fit minimum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth, and return it", () => {
      expect(
        createContentAttribute(
          {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          375,
          Number.POSITIVE_INFINITY,
        ),
      ).toBe(
        "initial-scale=1.8115942028985508,interactive-widget=resizes-content,width=414",
      );
    });
  });

  describe("case where second argument is greater than maximumWidth in first argument", () => {
    it("should compute width and initialScale from first and second argument to fit maximum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth, and return it", () => {
      expect(
        createContentAttribute(
          {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          1024,
          Number.POSITIVE_INFINITY,
        ),
      ).toBe(
        "initial-scale=2.6666666666666665,interactive-widget=resizes-content,width=768",
      );
    });
  });

  describe("case where minimumWidth is greater than maximumWidth in first argument", () => {
    it("should return string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in first argument", () => {
      expect(
        createContentAttribute(
          {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 768,
            maximumWidth: 414,
            interactiveWidget: "resizes-content",
          },
          375,
          Number.POSITIVE_INFINITY,
        ),
      ).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=device-width",
      );
    });
  });

  describe("case where width is number in first argument", () => {
    it("should return string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in first argument", () => {
      expect(
        createContentAttribute(
          {
            width: 1024,
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          1024,
          Number.POSITIVE_INFINITY,
        ),
      ).toBe("initial-scale=2,interactive-widget=resizes-content,width=1024");
    });
  });

  describe("case where third argument is finite number", () => {
    it("should truncate numbers in returned value to decimal places specified as third argument when converting to string after computing", () => {
      expect(
        createContentAttribute(
          {
            width: "device-width",
            initialScale: 1.123456789,
            minimumWidth: 414,
            maximumWidth: Number.POSITIVE_INFINITY,
            minimumScale: 0.123456789,
          },
          375,
          6,
        ),
      ).toBe("initial-scale=1.017623,minimum-scale=0.123456,width=414");
    });
  });

  describe("case where third argument is Infinity", () => {
    it("should not truncate numbers in return value", () => {
      expect(
        createContentAttribute(
          {
            width: "device-width",
            initialScale: 1.123456789,
            minimumWidth: 414,
            maximumWidth: Number.POSITIVE_INFINITY,
            minimumScale: 0.123456789,
          },
          375,
          Number.POSITIVE_INFINITY,
        ),
      ).toBe(
        "initial-scale=1.0176239030797103,minimum-scale=0.123456789,width=414",
      );
    });
  });
});
