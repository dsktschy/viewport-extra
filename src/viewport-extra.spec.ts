import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  document.documentElement.innerHTML = "<head></head><body></body>";
});

describe("side effects", () => {
  describe("viewport meta element to be updated", () => {
    describe("case where viewport meta elements exist", () => {
      it("updates existing first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        await import("./viewport-extra.js");
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
      it("appends viewport meta element and updates it", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" />
        `;
        await import("./viewport-extra.js");
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
        it("updates width to min-width and initial-scale to value that min-width fits into viewport", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7729468599033816,width=414");
        });
      });

      describe("case where max-width value is less than viewport width", () => {
        it("updates width to max-width and initial-scale to value that max-width fits into viewport", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 1024,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="max-width=768" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1.3333333333333333,width=768");
        });
      });

      describe("case where min-width value is less than viewport width and max-width value is greater than viewport width", () => {
        it("does not update width and initial-scale", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 640,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414,max-width=768" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
        });
      });

      describe("case where initial-scale value is set", () => {
        it("multiplies initial-scale to computed initial-scale", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-content="min-width=414" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.3864734299516908,width=414");
        });
      });

      describe("case where attribute is not set", () => {
        it("computes with default Content object", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
        });
      });

      describe("case where any values are not set", () => {
        it("computes with values in default Content object", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="" data-extra-content="" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=1,width=device-width");
        });
      });
    });

    describe("data-(extra-)decimal-places attribute", () => {
      describe("case where value is finite", () => {
        it("removes digits less than specified value from calculated content attribute", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" data-decimal-places="6" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.772946,width=414");
        });
      });

      describe("case where value is infinite", () => {
        it("does not update decimal places of calculated content attribute", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" data-decimal-places="Infinity" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7729468599033816,width=414");
        });
      });

      describe("case where attribute is not set", () => {
        it("does not update decimal places of calculated content attribute", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7729468599033816,width=414");
        });
      });
    });
  });

  describe("determination of value to apply from multiple viewport(-extra) meta elements", () => {
    describe("(data-extra-)content attributes", () => {
      describe("case where both viewport and viewport-extra meta elements exist", () => {
        it("merges attributes of first viewport meta element and all viewport-extra meta elements recursively. viewport-extra meta elements are handled as if they are set later than viewport meta element", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=2,min-width=320" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" />
            <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-content="min-width=768" />
            <meta name="viewport" content="width=device-width,initial-scale=0.25" data-extra-content="min-width=1024" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7729468599033816,width=414");
        });
      });

      describe("case where only viewport meta element exists", () => {
        it("uses attribute of first viewport meta element", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=768" />
            <meta name="viewport" content="width=device-width,initial-scale=2" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7729468599033816,width=414");
        });
      });

      describe("case where only viewport-extra meta element exists", () => {
        it("merges attributes of all viewport-extra meta elements recursively", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=768" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=2" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.8333333333333334,width=768");
        });
      });
    });

    describe("data-(extra-)decimal-places attributes", () => {
      describe("case where both viewport and viewport-extra meta elements exist", () => {
        it("uses attribute that is set latest of first viewport meta element and all viewport-extra meta elements. viewport-extra meta elements are handled as if they are set later than viewport meta element", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" data-decimal-places="7" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" data-decimal-places="6" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" data-extra-decimal-places="5" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" data-extra-decimal-places="4" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.772946,width=414");
        });
      });

      describe("case where only viewport meta element exists", () => {
        it("uses attribute of first viewport meta element", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" data-extra-decimal-places="6" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" data-extra-decimal-places="1" />
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=414" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.772946,width=414");
        });
      });

      describe("case where only viewport-extra meta element exists", () => {
        it("uses attribute that is set latest of all viewport-extra meta elements", async () => {
          Object.defineProperty(document.documentElement, "clientWidth", {
            value: 320,
            configurable: true,
          });
          document.head.innerHTML = `
            <meta charset="utf-8" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" data-decimal-places="6" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" data-decimal-places="1" />
            <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=414" />
          `;
          await import("./viewport-extra.js");
          expect(
            document
              .querySelector('meta[name="viewport"]')
              ?.getAttribute("content"),
          ).toBe("initial-scale=0.7,width=414");
        });
      });
    });
  });
});

describe("setParameters", () => {
  describe("viewport meta element to be updated", () => {
    describe("case where viewport meta elements exist", () => {
      it("updates existing first viewport meta element", async () => {
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
        const { setParameters } = await import("./viewport-extra.js");
        setParameters([{ content: { minWidth: 414 } }]);
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
      it("appends viewport meta element and updates it", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
        `;
        const { setParameters } = await import("./viewport-extra.js");
        setParameters([{ content: { minWidth: 414 } }]);
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });
  });

  describe("behavior according to arguments", () => {
    describe("properties of items in first argument", () => {
      describe("content property", () => {
        describe("case where minWidth property is greater than viewport width", () => {
          it("updates width to minWidth and initial-scale to value that minWidth fits into viewport", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{ content: { minWidth: 414 } }]);
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=0.7729468599033816,width=414");
          });
        });

        describe("case where maxWidth property is less than viewport width", () => {
          it("updates width to maxWidth and initial-scale to value that maxWidth fits into viewport", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 1024,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{ content: { maxWidth: 768 } }]);
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=1.3333333333333333,width=768");
          });
        });

        describe("case where minWidth property is less than viewport width and maxWidth property is greater than viewport width", () => {
          it("does not update width and initial-scale", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 640,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{ content: { minWidth: 414, maxWidth: 768 } }]);
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=1,width=device-width");
          });
        });

        describe("case where initialScale property is set", () => {
          it("multiplies initialScale to computed initial-scale", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{ content: { initialScale: 0.5, minWidth: 414 } }]);
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=0.3864734299516908,width=414");
          });
        });

        describe("case where no properties are set", () => {
          it("computes with default Content object", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([]);
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=1,width=device-width");
          });
        });

        describe("case where any properties are not set", () => {
          it("computes with values in default Content object", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{}]);
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=1,width=device-width");
          });
        });
      });
    });

    describe("properties in second argument", () => {
      describe("decimalPlaces property", () => {
        describe("case where value is finite", () => {
          it("removes digits less than specified value from calculated content attribute", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{ content: { minWidth: 414 } }], {
              decimalPlaces: 6,
            });
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=0.772946,width=414");
          });
        });

        describe("case where value is infinite", () => {
          it("does not update decimal places of calculated content attribute", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{ content: { minWidth: 414 } }], {
              decimalPlaces: Number.POSITIVE_INFINITY,
            });
            expect(
              document
                .querySelector('meta[name="viewport"]')
                ?.getAttribute("content"),
            ).toBe("initial-scale=0.7729468599033816,width=414");
          });
        });

        describe("case where property is not set", () => {
          it("does not update decimal places of calculated content attribute", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([{ content: { minWidth: 414 } }]);
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

  describe("determination of value to apply from multiple values in arguments", () => {
    describe("properties of items in first argument", () => {
      describe("content properties", () => {
        describe("case where media properties in second argument are not set", () => {
          it("merges properties of all items recursively", async () => {
            Object.defineProperty(document.documentElement, "clientWidth", {
              value: 320,
              configurable: true,
            });
            document.head.innerHTML = `
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
            `;
            const { setParameters } = await import("./viewport-extra.js");
            setParameters([
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
});

describe("setContent", () => {
  describe("viewport meta element to be updated", () => {
    describe("case where viewport meta elements exist", () => {
      it("updates existing first viewport meta element", async () => {
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
        const { setContent } = await import("./viewport-extra.js");
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
      it("appends viewport meta element and updates it", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
        `;
        const { setContent } = await import("./viewport-extra.js");
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
      it("updates width to minWidth and initial-scale to value that minWidth fits into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        const { setContent } = await import("./viewport-extra.js");
        setContent({ minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });

    describe("case where maxWidth property is less than viewport width", () => {
      it("updates width to maxWidth and initial-scale to value that maxWidth fits into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        const { setContent } = await import("./viewport-extra.js");
        setContent({ maxWidth: 768 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=1.3333333333333333,width=768");
      });
    });

    describe("case where minWidth property is less than viewport width and maxWidth property is greater than viewport width", () => {
      it("does not update width and initial-scale", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 640,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        const { setContent } = await import("./viewport-extra.js");
        setContent({ minWidth: 414, maxWidth: 768 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=1,width=device-width");
      });
    });

    describe("case where initialScale property is set", () => {
      it("multiplies initialScale to computed initial-scale", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        const { setContent } = await import("./viewport-extra.js");
        setContent({ initialScale: 0.5, minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.3864734299516908,width=414");
      });
    });

    describe("case where any properties are not set", () => {
      it("computes with values in default Content object", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        const { setContent } = await import("./viewport-extra.js");
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
      it("does not update decimal places of calculated content attribute", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        const { setContent } = await import("./viewport-extra.js");
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
