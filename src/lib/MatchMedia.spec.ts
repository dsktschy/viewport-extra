import { describe, expect, test } from "vitest";
import { createMatchMediaPredicate } from "./MatchMedia.js";

describe("createMatchMediaPredicate", () => {
  describe("case where argument of created function is media query that matches current viewport", () => {
    test("created function should return true", () => {
      expect(
        createMatchMediaPredicate(
          () =>
            ({
              matches: true,
            }) as MediaQueryList,
        )("(min-width: 768px)"),
      ).toBe(true);
    });
  });

  describe("case where argument of created function is media query that does not match current viewport", () => {
    test("created function should return false", () => {
      expect(
        createMatchMediaPredicate(
          () =>
            ({
              matches: false,
            }) as MediaQueryList,
        )("(min-width: 768px)"),
      ).toBe(false);
    });
  });

  describe("case where argument of created function is undefined", () => {
    test("created function should return true", () => {
      expect(
        createMatchMediaPredicate(
          () =>
            ({
              matches: false,
            }) as MediaQueryList,
        )(),
      ).toBe(true);
    });
  });
});
