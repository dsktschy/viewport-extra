import { describe, expect, it } from "vitest";
import {
  createOptionalPartialContent,
  mergeNullableContentAttributes,
} from "./ContentAttribute.js";

describe("mergeNullableContentAttributes", () => {
  describe("case where only first argument is not null", () => {
    it("should return first argument", () => {
      expect(
        mergeNullableContentAttributes(
          "minimum-width=414,maximum-width=768",
          null,
        ),
      ).toBe("minimum-width=414,maximum-width=768");
    });
  });

  describe("case where only second argument is not null", () => {
    it("should return second argument", () => {
      expect(
        mergeNullableContentAttributes(
          null,
          "minimum-width=414,maximum-width=768",
        ),
      ).toBe("minimum-width=414,maximum-width=768");
    });
  });

  describe("case where first and second arguments are not null", () => {
    it("should return string that first and second arguments are joined with comma", () => {
      expect(
        mergeNullableContentAttributes(
          "width=device-width,initial-scale=1,interactive-widget=resizes-content",
          "minimum-width=414,maximum-width=768",
        ),
      ).toBe(
        "width=device-width,initial-scale=1,interactive-widget=resizes-content,minimum-width=414,maximum-width=768",
      );
    });
  });

  describe("case where first and second arguments are null", () => {
    it("should return null", () => {
      expect(mergeNullableContentAttributes(null, null)).toBe(null);
    });
  });
});

describe("createOptionalPartialContent", () => {
  describe("case where argument is string contains comma", () => {
    it("should create properties for each string split by commas, and return them as object", () => {
      expect(
        createOptionalPartialContent("width=device-width,foo=FOO,bar=BAR"),
      ).toStrictEqual({
        width: "device-width",
        foo: "FOO",
        bar: "BAR",
      });
    });

    describe("case where properties that have same keys are created", () => {
      it("should return object that values of later properties are used", () => {
        expect(
          createOptionalPartialContent("width=device-width,foo=FOO,foo=BAZ"),
        ).toStrictEqual({
          width: "device-width",
          foo: "BAZ",
        });
      });
    });
  });

  describe("case where argument is string contains equal", () => {
    it("should create properties with part before equal as key and part after equal as value, and return them as object", () => {
      expect(createOptionalPartialContent("width=device-width")).toStrictEqual({
        width: "device-width",
      });
    });

    describe("case where string before equal is kebab case", () => {
      it("should return object that key of created property is camel case", () => {
        expect(
          createOptionalPartialContent("interactive-widget=resizes-content"),
        ).toStrictEqual({
          interactiveWidget: "resizes-content",
        });
      });
    });

    describe("case where string after equal is number", () => {
      it("should return object that value of created property is number type", () => {
        expect(createOptionalPartialContent("width=414")).toStrictEqual({
          width: 414,
        });
      });
    });

    describe("case where string contains whitespace", () => {
      it("should return object that key and value of created property do not have leading or trailing whitespaces", () => {
        expect(
          createOptionalPartialContent("   width   =   device-width   "),
        ).toStrictEqual({ width: "device-width" });
      });
    });

    describe("case where string before equal is empty", () => {
      it("should return object that does not have property corresponding to string before equal is empty", () => {
        expect(createOptionalPartialContent("=device-width")).toStrictEqual({});
      });
    });

    describe("case where string after equal is empty", () => {
      it("should return object that does not have property corresponding to string after equal is empty", () => {
        expect(createOptionalPartialContent("width=")).toStrictEqual({});
      });
    });
  });

  describe("case where argument is null", () => {
    it("should return undefined", () => {
      expect(createOptionalPartialContent(null)).toBe(undefined);
    });
  });
});
