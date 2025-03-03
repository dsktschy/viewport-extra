import { describe, expect, it } from "vitest";
import {
  assignOptionalDecimalPlaces,
  assignOptionalUnscaledComputing,
  createGlobalParameters,
  getDecimalPlaces,
  getUnscaledComputing,
  mergePartialGlobalParameters,
} from "./GlobalParameters.js";

describe("createGlobalParameters", () => {
  describe("case where argument has properties", () => {
    it("should return object that deeply inherits properties of argument", () => {
      expect(
        createGlobalParameters({
          unscaledComputing: true,
          decimalPlaces: 6,
        }),
      ).toStrictEqual({
        unscaledComputing: true,
        decimalPlaces: 6,
      });
    });
  });

  describe("case where argument has missing properties of GlobalParameters type", () => {
    it("should return object with missing properties set to default value deeply", () => {
      expect(createGlobalParameters({})).toStrictEqual({
        unscaledComputing: false,
        decimalPlaces: Number.POSITIVE_INFINITY,
      });
    });
  });

  describe("case where argument is undefined", () => {
    it("should return object with all properties that have default value", () => {
      expect(createGlobalParameters()).toStrictEqual({
        unscaledComputing: false,
        decimalPlaces: Number.POSITIVE_INFINITY,
      });
    });
  });
});

describe("mergePartialGlobalParameters", () => {
  describe("case where properties exist in only first argument", () => {
    it("should return object that has properties in first argument", () => {
      expect(
        mergePartialGlobalParameters(
          {
            unscaledComputing: true,
            decimalPlaces: 6,
          },
          {},
        ),
      ).toStrictEqual({
        unscaledComputing: true,
        decimalPlaces: 6,
      });
    });
  });

  describe("case where properties exist in only second argument", () => {
    it("should return object that has properties in second argument", () => {
      expect(
        mergePartialGlobalParameters(
          {},
          {
            unscaledComputing: true,
            decimalPlaces: 6,
          },
        ),
      ).toStrictEqual({
        unscaledComputing: true,
        decimalPlaces: 6,
      });
    });
  });

  describe("case where properties exist in both first and second arguments deeply", () => {
    it("should return object that properties in first and second arguments are merged deeply", () => {
      expect(
        mergePartialGlobalParameters(
          { unscaledComputing: true },
          { decimalPlaces: 6 },
        ),
      ).toStrictEqual({
        unscaledComputing: true,
        decimalPlaces: 6,
      });
    });

    describe("case where first and second arguments have same properties deeply", () => {
      it("should return object that values of second argument are used", () => {
        expect(
          mergePartialGlobalParameters(
            {
              unscaledComputing: true,
              decimalPlaces: 6,
            },
            {
              unscaledComputing: false,
              decimalPlaces: 0,
            },
          ),
        ).toStrictEqual({
          unscaledComputing: false,
          decimalPlaces: 0,
        });
      });
    });
  });

  describe("case where properties do not exist in both first and second arguments", () => {
    it("should return empty object", () => {
      expect(mergePartialGlobalParameters({}, {})).toStrictEqual({});
    });
  });
});

describe("assignOptionalUnscaledComputing", () => {
  describe("case where first and second arguments are not undefined", () => {
    it("should return object that second argument is set to unscaledComputing property of first argument", () => {
      expect(
        assignOptionalUnscaledComputing({ decimalPlaces: 6 }, true),
      ).toStrictEqual({
        unscaledComputing: true,
        decimalPlaces: 6,
      });
    });
  });

  describe("case where first argument is undefined", () => {
    it("should return object that second argument is set to unscaledComputing property", () => {
      expect(assignOptionalUnscaledComputing(undefined, true)).toStrictEqual({
        unscaledComputing: true,
      });
    });
  });

  describe("case where second argument is undefined", () => {
    it("should do nothing", () => {
      expect(
        assignOptionalUnscaledComputing({ decimalPlaces: 6 }, undefined),
      ).toStrictEqual({ decimalPlaces: 6 });
    });
  });
});

describe("assignOptionalDecimalPlaces", () => {
  describe("case where first and second arguments are not undefined", () => {
    it("should return object that second argument is set to decimalPlaces property of first argument", () => {
      expect(
        assignOptionalDecimalPlaces({ unscaledComputing: true }, 6),
      ).toStrictEqual({
        unscaledComputing: true,
        decimalPlaces: 6,
      });
    });
  });

  describe("case where first argument is undefined", () => {
    it("should return object that second argument is set to decimalPlaces property", () => {
      expect(assignOptionalDecimalPlaces(undefined, 6)).toStrictEqual({
        decimalPlaces: 6,
      });
    });
  });

  describe("case where second argument is undefined", () => {
    it("should do nothing", () => {
      expect(
        assignOptionalDecimalPlaces({ unscaledComputing: true }, undefined),
      ).toStrictEqual({ unscaledComputing: true });
    });
  });
});

describe("getUnscaledComputing", () => {
  it("should return unscaledComputing property", () => {
    expect(
      getUnscaledComputing({
        unscaledComputing: true,
        decimalPlaces: 6,
      }),
    ).toBe(true);
  });
});

describe("getDecimalPlaces", () => {
  it("should return decimalPlaces property", () => {
    expect(
      getDecimalPlaces({
        unscaledComputing: true,
        decimalPlaces: 6,
      }),
    ).toBe(6);
  });
});
