import { describe, expect, it } from "vitest";
import {
  applyMediaSpecificParameters,
  applyMediaSpecificParametersTruncated,
  createPartialGlobalParameters,
  createPartialMediaSpecificParameters,
  getNullableContentAttribute,
  getNullableDecimalPlacesAttribute,
  getNullableMediaAttribute,
  setContentAttribute,
} from "./HTMLMetaElement.js";

describe("getNullableDecimalPlacesAttribute", () => {
  describe("case where argument has only data-decimal-places attribute", () => {
    it("should return value of data-decimal-places attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-decimal-places", "6");
      expect(getNullableDecimalPlacesAttribute(htmlMetaElement)).toBe("6");
    });
  });

  describe("case where argument has only data-extra-decimal-places attribute", () => {
    it("should return value of data-extra-decimal-places attribute converted to number type", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-extra-decimal-places", "6");
      expect(getNullableDecimalPlacesAttribute(htmlMetaElement)).toBe("6");
    });
  });

  describe("case where argument has both data-decimal-places and data-extra-decimal-places attributes", () => {
    it("should return value of data-extra-decimal-places attribute converted to number type", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-decimal-places", "6");
      htmlMetaElement.setAttribute("data-extra-decimal-places", "0");
      expect(getNullableDecimalPlacesAttribute(htmlMetaElement)).toBe("0");
    });
  });

  describe("case where argument does not have both data-decimal-places and data-extra-decimal-places attributes", () => {
    it("should return null", () => {
      expect(
        getNullableDecimalPlacesAttribute(document.createElement("meta")),
      ).toBe(null);
    });
  });
});

describe("createPartialGlobalParameters", () => {
  describe("case where argument has only data-decimal-places attribute", () => {
    it("should return object whose decimalPlaces property is value of data-decimal-places attribute converted to number type", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-decimal-places", "6");
      expect(createPartialGlobalParameters(htmlMetaElement)).toStrictEqual({
        decimalPlaces: 6,
      });
    });
  });

  describe("case where argument has only data-extra-decimal-places attribute", () => {
    it("should return object whose decimalPlaces property is value of data-extra-decimal-places attribute converted to number type", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-extra-decimal-places", "6");
      expect(createPartialGlobalParameters(htmlMetaElement)).toStrictEqual({
        decimalPlaces: 6,
      });
    });
  });

  describe("case where argument has both data-decimal-places and data-extra-decimal-places attributes", () => {
    it("should return object whose decimalPlaces property is value of data-extra-decimal-places attribute converted to number type", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-decimal-places", "6");
      htmlMetaElement.setAttribute("data-extra-decimal-places", "0");
      expect(createPartialGlobalParameters(htmlMetaElement)).toStrictEqual({
        decimalPlaces: 0,
      });
    });
  });

  describe("case where argument has no attributes", () => {
    it("should return object that has no properties", () => {
      const htmlMetaElement = document.createElement("meta");
      expect(createPartialGlobalParameters(htmlMetaElement)).toStrictEqual({});
    });
  });
});

describe("getNullableContentAttribute", () => {
  describe("case where argument has only content attribute", () => {
    it("should return value of content attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "content",
        "width=device-width,initial-scale=1,interactive-widget=resizes-content",
      );
      expect(getNullableContentAttribute(htmlMetaElement)).toBe(
        "width=device-width,initial-scale=1,interactive-widget=resizes-content",
      );
    });
  });

  describe("case where argument has only data-extra-content attribute", () => {
    it("should return value of data-extra-content attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "data-extra-content",
        "minimum-width=414,maximum-width=768",
      );
      expect(getNullableContentAttribute(htmlMetaElement)).toBe(
        "minimum-width=414,maximum-width=768",
      );
    });
  });

  describe("case where argument has both content and data-extra-content attributes", () => {
    it("should return string that values of content and data-extra-content attributes are joined with comma", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "content",
        "width=device-width,initial-scale=1,interactive-widget=resizes-content",
      );
      htmlMetaElement.setAttribute(
        "data-extra-content",
        "minimum-width=414,maximum-width=768",
      );
      expect(getNullableContentAttribute(htmlMetaElement)).toBe(
        "width=device-width,initial-scale=1,interactive-widget=resizes-content,minimum-width=414,maximum-width=768",
      );
    });
  });

  describe("case where argument does not have both content and data-extra-content attributes", () => {
    it("should return null", () => {
      expect(getNullableContentAttribute(document.createElement("meta"))).toBe(
        null,
      );
    });
  });
});

describe("getNullableMediaAttribute", () => {
  describe("case where argument has only data-media attribute", () => {
    it("should return value of data-media attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-media", "(min-width: 768px)");
      expect(getNullableMediaAttribute(htmlMetaElement)).toBe(
        "(min-width: 768px)",
      );
    });
  });

  describe("case where argument has only data-extra-media attribute", () => {
    it("should return value of data-extra-media attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-extra-media", "(min-width: 768px)");
      expect(getNullableMediaAttribute(htmlMetaElement)).toBe(
        "(min-width: 768px)",
      );
    });
  });

  describe("case where argument has both data-media and data-extra-media attributes", () => {
    it("should return value of data-extra-media attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-media", "(min-width: 768px)");
      htmlMetaElement.setAttribute("data-extra-media", "(min-width: 1024px)");
      expect(getNullableMediaAttribute(htmlMetaElement)).toBe(
        "(min-width: 1024px)",
      );
    });
  });

  describe("case where argument does not have both data-media and data-extra-media attributes", () => {
    it("should return null", () => {
      expect(getNullableMediaAttribute(document.createElement("meta"))).toBe(
        null,
      );
    });
  });
});

describe("createPartialMediaSpecificParameters", () => {
  describe("case where argument has only content attribute", () => {
    it("should return object that has content property matching all key-value pairs in content attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "content",
        "width=device-width,minimum-width=414,interactive-widget=resizes-content",
      );
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({
        content: {
          width: "device-width",
          minimumWidth: 414,
          interactiveWidget: "resizes-content",
        },
      });
    });
  });

  describe("case where argument has only data-extra-content attribute", () => {
    it("should return object that has content property matching all key-value pairs in data-extra-content attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "data-extra-content",
        "width=device-width,minimum-width=414,interactive-widget=resizes-content",
      );
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({
        content: {
          width: "device-width",
          minimumWidth: 414,
          interactiveWidget: "resizes-content",
        },
      });
    });
  });

  describe("case where argument has both content and data-extra-content attributes", () => {
    it("should return object that has content property matching all key-value pairs in content and data-extra-content attributes", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "content",
        "width=device-width,initial-scale=1,interactive-widget=resizes-content",
      );
      htmlMetaElement.setAttribute(
        "data-extra-content",
        "minimum-width=414,maximum-width=768",
      );
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({
        content: {
          width: "device-width",
          initialScale: 1,
          interactiveWidget: "resizes-content",
          minimumWidth: 414,
          maximumWidth: 768,
        },
      });
    });

    describe("case where same keys exist in content and data-extra-content attributes", () => {
      it("should return object that values of data-extra-content attribute are used", () => {
        const htmlMetaElement = document.createElement("meta");
        htmlMetaElement.setAttribute(
          "content",
          "width=device-width,minimum-width=414,interactive-widget=resizes-content",
        );
        htmlMetaElement.setAttribute(
          "data-extra-content",
          "width=1024,minimum-width=375,interactive-widget=overlays-content",
        );
        expect(
          createPartialMediaSpecificParameters(htmlMetaElement),
        ).toStrictEqual({
          content: {
            width: 1024,
            minimumWidth: 375,
            interactiveWidget: "overlays-content",
          },
        });
      });
    });
  });

  describe("case where argument has only data-media attribute", () => {
    it("should return object that has media property equal to data-media attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-media", "(min-width: 768px)");
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({
        media: "(min-width: 768px)",
      });
    });
  });

  describe("case where argument has only data-extra-media attribute", () => {
    it("should return object that has media property equal to data-extra-media attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-extra-media", "(min-width: 768px)");
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({
        media: "(min-width: 768px)",
      });
    });
  });

  describe("case where argument has both data-media and data-extra-media attributes", () => {
    it("should return object that has media property equal to data-extra-media attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute("data-media", "(min-width: 768px)");
      htmlMetaElement.setAttribute("data-extra-media", "(min-width: 1024px)");
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({
        media: "(min-width: 1024px)",
      });
    });
  });

  describe("case where argument has both (data-extra-)content and data-(extra-)media attributes", () => {
    it("should return object that has content property matching all key-value pairs in (data-extra-)content attribute and media property equal to data-(extra-)media attribute", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "content",
        "width=device-width,minimum-width=1024,interactive-widget=resizes-content",
      );
      htmlMetaElement.setAttribute("data-media", "(min-width: 768px)");
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({
        content: {
          width: "device-width",
          minimumWidth: 1024,
          interactiveWidget: "resizes-content",
        },
        media: "(min-width: 768px)",
      });
    });
  });

  describe("case where argument has no attributes", () => {
    it("should return object that has no properties", () => {
      const htmlMetaElement = document.createElement("meta");
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement),
      ).toStrictEqual({});
    });
  });
});

describe("setContentAttribute", () => {
  it("should update content attribute of first argument with second argument", () => {
    const htmlMetaElement = document.createElement("meta");
    setContentAttribute(
      htmlMetaElement,
      "width=device-width,initial-scale=1,interactive-widget=resizes-content",
    );
    expect(htmlMetaElement.getAttribute("content")).toBe(
      "width=device-width,initial-scale=1,interactive-widget=resizes-content",
    );
  });
});

describe("applyMediaSpecificParameters", () => {
  describe("case where return value of second argument is greater than minimumWidth and less than maximumWidth in third argument", () => {
    it("should create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in third argument, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParameters(
        htmlMetaElement,
        () => 640,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=device-width",
      );
    });
  });

  describe("case where return value of second argument is less than minimumWidth in third argument", () => {
    it("should compute width and initialScale from first argument and return value of second argument to fit minimum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParameters(
        htmlMetaElement,
        () => 375,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=1.8115942028985508,interactive-widget=resizes-content,width=414",
      );
    });
  });

  describe("case where return value of second argument is greater than maximumWidth in third argument", () => {
    it("should compute width and initialScale from first argument and return value of second argument to fit maximum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParameters(
        htmlMetaElement,
        () => 1024,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2.6666666666666665,interactive-widget=resizes-content,width=768",
      );
    });
  });

  describe("case where minimumWidth is greater than maximumWidth in third argument", () => {
    it("should create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in third argument, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParameters(
        htmlMetaElement,
        () => 375,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 768,
            maximumWidth: 414,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=device-width",
      );
    });
  });

  describe("case where width in third argument is number", () => {
    it("should create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in third argument, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParameters(
        htmlMetaElement,
        () => 1024,
        () => ({
          content: {
            width: 1024,
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=1024",
      );
    });
  });

  describe("case where width is not device-width or initial-scale is not 1, of content attribute in viewport meta element", () => {
    it("should get width with second argument after updating width to device-width and initial-scale to 1, of content attribute in viewport meta element", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "content",
        "width=device-width,initial-scale=0.5",
      );
      applyMediaSpecificParameters(
        htmlMetaElement,
        // Reproduces behavior of document.documentElement.clientWidth
        () => {
          const initialScale = Number.parseFloat(
            htmlMetaElement
              .getAttribute("content")
              ?.split(",")
              .find((property) => property.split("=")[0] === "initial-scale")
              ?.split("=")[1] ?? "0",
          );
          return initialScale <= 1 ? 320 / initialScale : 320;
        },
        () => ({
          content: {
            width: "device-width",
            initialScale: 1,
            minimumWidth: 414,
            maximumWidth: Infinity,
          },
          media: "",
        }),
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=0.7729468599033816,width=414",
      );
    });
  });
});

describe("applyMediaSpecificParametersTruncated", () => {
  describe("case where return value of second argument is greater than minimumWidth and less than maximumWidth in third argument", () => {
    it("should create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in third argument, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        () => 640,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
        { decimalPlaces: Infinity },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=device-width",
      );
    });
  });

  describe("case where return value of second argument is less than minimumWidth in third argument", () => {
    it("should compute width and initialScale from first argument and return value of second argument to fit minimum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        () => 375,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
        { decimalPlaces: Infinity },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=1.8115942028985508,interactive-widget=resizes-content,width=414",
      );
    });
  });

  describe("case where return value of second argument is greater than maximumWidth in third argument", () => {
    it("should compute width and initialScale from first argument and return value of second argument to fit maximum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        () => 1024,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
        { decimalPlaces: Infinity },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2.6666666666666665,interactive-widget=resizes-content,width=768",
      );
    });
  });

  describe("case where minimumWidth is greater than maximumWidth in third argument", () => {
    it("should create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in third argument, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        () => 375,
        () => ({
          content: {
            width: "device-width",
            initialScale: 2,
            minimumWidth: 768,
            maximumWidth: 414,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
        { decimalPlaces: Infinity },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=device-width",
      );
    });
  });

  describe("case where width in third argument is number", () => {
    it("should create string where keys and values are connected with equals and properties are connected with commas for properties other than minimumWidth and maximumWidth in third argument, and set it to first argument", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        () => 1024,
        () => ({
          content: {
            width: 1024,
            initialScale: 2,
            minimumWidth: 414,
            maximumWidth: 768,
            interactiveWidget: "resizes-content",
          },
          media: "",
        }),
        { decimalPlaces: Infinity },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=2,interactive-widget=resizes-content,width=1024",
      );
    });
  });

  describe("case where decimalPlaces property in fourth argument is finite number", () => {
    it("should truncate numbers in returned value to decimal places specified as third argument when converting to string after computing", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        () => 375,
        () => ({
          content: {
            width: "device-width",
            initialScale: 1.123456789,
            minimumWidth: 414,
            maximumWidth: Infinity,
            minimumScale: 0.123456789,
          },
          media: "",
        }),
        { decimalPlaces: 6 },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=1.017623,minimum-scale=0.123456,width=414",
      );
    });
  });

  describe("case where decimalPlaces property in fourth argument is Infinity", () => {
    it("should not truncate numbers in return value", () => {
      const htmlMetaElement = document.createElement("meta");
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        () => 375,
        () => ({
          content: {
            width: "device-width",
            initialScale: 1.123456789,
            minimumWidth: 414,
            maximumWidth: Infinity,
            minimumScale: 0.123456789,
          },
          media: "",
        }),
        { decimalPlaces: Infinity },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=1.0176239030797103,minimum-scale=0.123456789,width=414",
      );
    });
  });

  describe("case where width is not device-width or initial-scale is not 1, of content attribute in viewport meta element", () => {
    it("should get width with second argument after updating width to device-width and initial-scale to 1, of content attribute in viewport meta element", () => {
      const htmlMetaElement = document.createElement("meta");
      htmlMetaElement.setAttribute(
        "content",
        "width=device-width,initial-scale=0.5",
      );
      applyMediaSpecificParametersTruncated(
        htmlMetaElement,
        // Reproduces behavior of document.documentElement.clientWidth
        () => {
          const initialScale = Number.parseFloat(
            htmlMetaElement
              .getAttribute("content")
              ?.split(",")
              .find((property) => property.split("=")[0] === "initial-scale")
              ?.split("=")[1] ?? "0",
          );
          return initialScale <= 1 ? 320 / initialScale : 320;
        },
        () => ({
          content: {
            width: "device-width",
            initialScale: 1,
            minimumWidth: 414,
            maximumWidth: Infinity,
          },
          media: "",
        }),
        { decimalPlaces: Infinity },
      );
      expect(htmlMetaElement.getAttribute("content")).toBe(
        "initial-scale=0.7729468599033816,width=414",
      );
    });
  });
});
