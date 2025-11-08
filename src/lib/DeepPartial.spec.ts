import { describe, expectTypeOf, it } from "vitest";
import type { DeepPartial } from "./DeepPartial.js";

describe("DeepPartial", () => {
  describe("case where type argument is object with multiple levels", () => {
    it("should make all properties in all levels of type argument optional", () => {
      expectTypeOf<
        DeepPartial<{
          firstA: {
            second: {
              third: string;
            };
          };
          firstB: number;
          firstC: boolean;
        }>
      >().toEqualTypeOf<{
        firstA?: {
          second?: {
            third?: string;
          };
        };
        firstB?: number;
        firstC?: boolean;
      }>();
    });
  });

  describe("case where type argument is object with single level", () => {
    it("should make all properties of type argument optional", () => {
      expectTypeOf<
        DeepPartial<{
          firstA: string;
          firstB: number;
          firstC: boolean;
        }>
      >().toEqualTypeOf<{
        firstA?: string;
        firstB?: number;
        firstC?: boolean;
      }>();
    });
  });

  describe("case where type argument is not object", () => {
    it("should do nothing", () => {
      expectTypeOf<DeepPartial<string>>().toEqualTypeOf<string>();
      expectTypeOf<DeepPartial<number>>().toEqualTypeOf<number>();
      expectTypeOf<DeepPartial<boolean>>().toEqualTypeOf<boolean>();
      expectTypeOf<DeepPartial<unknown[]>>().toEqualTypeOf<unknown[]>();
      expectTypeOf<DeepPartial<unknown>>().toEqualTypeOf<unknown>();
      expectTypeOf<DeepPartial<undefined>>().toEqualTypeOf<undefined>();
      expectTypeOf<DeepPartial<null>>().toEqualTypeOf<null>();
    });
  });
});
