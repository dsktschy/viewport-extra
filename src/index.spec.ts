import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  document.documentElement.innerHTML = "<head></head><body></body>";
});

describe("side effects", () => {
  describe("ensuring existence of viewport meta element", () => {
    describe("case where viewport meta element exists", () => {
      it("uses existing viewport meta element", async () => {
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `;
        await import("./index.js");
        expect(document.querySelectorAll('meta[name="viewport"]')).toHaveLength(
          1,
        );
      });
    });

    describe("case where viewport meta element does not exist", () => {
      it("appends viewport meta element", async () => {
        document.head.innerHTML = `
          <meta charset="utf-8" />
        `;
        await import("./index.js");
        expect(document.querySelectorAll('meta[name="viewport"]')).toHaveLength(
          1,
        );
      });
    });
  });

  describe("updating content attribute of viewport meta element", () => {
    describe("case where viewport width is less than minWidth value in merged result of viewport and viewport-extra meta elements", () => {
      it("updates width to minimum width and initial-scale to value that fits minimum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="min-width=414" />
        `;
        await import("./index.js");
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=0.7729468599033816,width=414");
      });
    });

    describe("case where viewport width is greater than maxWidth value in merged result of viewport and viewport-extra meta elements", () => {
      it("updates width to maximum width and initial-scale to value that fits maximum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="max-width=768" />
        `;
        await import("./index.js");
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe("initial-scale=1.3333333333333333,width=768");
      });
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates content attribute of first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
          <meta name="viewport-extra" content="min-width=414" />
        `;
        await import("./index.js");
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0]?.getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1]?.getAttribute("content")).toBe("");
      });
    });
  });
});

describe("setParameters", () => {
  describe("updating content attribute of viewport meta element", () => {
    describe("case where viewport width is less than minWidth value in merged result of current internalPartialMediaSpecificParametersList variable and first argument", () => {
      it("updates width to minimum width and initial-scale to value that fits minimum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { setParameters } = await import("./index.js");
        setParameters([
          { content: { minWidth: 375 } },
          { content: { minWidth: 414 } },
        ]);
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=0.7729468599033816,interactive-widget=resizes-visual,width=414",
        );
      });
    });

    describe("case where viewport width is greater than maxWidth value in merged result of current internalPartialMediaSpecificParametersList variable and first argument", () => {
      it("updates width to maximum width and initial-scale to value that fits maximum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { setParameters } = await import("./index.js");
        setParameters([
          { content: { maxWidth: 640 } },
          { content: { maxWidth: 768 } },
        ]);
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=1.3333333333333333,interactive-widget=resizes-visual,width=768",
        );
      });
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates content attribute of first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
        `;
        const { setParameters } = await import("./index.js");
        setParameters([{ content: { minWidth: 414 } }]);
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0]?.getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1]?.getAttribute("content")).toBe("");
      });
    });
  });
});

describe("setContent", () => {
  describe("updating content attribute of viewport meta element", () => {
    describe("case where viewport width is less than minWidth value in merged result of current internalPartialMediaSpecificParametersList variable and argument", () => {
      it("updates width to minimum width and initial-scale to value that fits minimum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { setContent } = await import("./index.js");
        setContent({ minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=0.7729468599033816,interactive-widget=resizes-visual,width=414",
        );
      });
    });

    describe("case where viewport width is greater than maxWidth value in merged result of current internalPartialMediaSpecificParametersList variable and argument", () => {
      it("updates width to maximum width and initial-scale to value that fits maximum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { setContent } = await import("./index.js");
        setContent({ maxWidth: 768 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=1.3333333333333333,interactive-widget=resizes-visual,width=768",
        );
      });
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates content attribute of first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
        `;
        const { setContent } = await import("./index.js");
        setContent({ minWidth: 414 });
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0]?.getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1]?.getAttribute("content")).toBe("");
      });
    });
  });
});

describe("getContent", () => {
  it("returns Content object used to update content attribute of viewport meta element if no media queries are specified", async () => {
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=640,initial-scale=2" />
      <meta name="viewport-extra" content="min-width=414,max-width=768" />
    `;
    const { getContent } = await import("./index.js");
    expect(getContent()).toStrictEqual({
      width: 640,
      initialScale: 2,
      minWidth: 414,
      maxWidth: 768,
    });
  });
});

describe("updateReference", () => {
  describe("updating reference to viewport meta element", () => {
    it("updates reference to viewport meta element", async () => {
      Object.defineProperty(document.documentElement, "clientWidth", {
        value: 320,
        configurable: true,
      });
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      `;
      const { updateReference, setContent } = await import("./index.js");
      const firstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]',
      );
      if (!firstViewportMetaElement) expect.fail();
      const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
      if (!(secondViewportMetaElement instanceof Element)) expect.fail();
      document.head.removeChild(firstViewportMetaElement);
      document.head.appendChild(secondViewportMetaElement);
      updateReference();
      setContent({ minWidth: 414 });
      expect(secondViewportMetaElement.getAttribute("content")).toBe(
        "initial-scale=0.7729468599033816,width=414",
      );
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates reference to first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
        `;
        const { updateReference, setContent } = await import("./index.js");
        const firstViewportMetaElement = document.querySelector(
          'meta[name="viewport"]',
        );
        if (!firstViewportMetaElement) expect.fail();
        const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
        if (!(secondViewportMetaElement instanceof Element)) expect.fail();
        document.head.replaceChild(
          secondViewportMetaElement,
          firstViewportMetaElement,
        );
        updateReference();
        setContent({ minWidth: 414 });
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0].getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1].getAttribute("content")).toBe("");
      });
    });
  });

  describe("target of updating", () => {
    it("does not update content object", async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=640,initial-scale=2" />
        <meta name="viewport-extra" content="min-width=414,max-width=768" />
      `;
      const { updateReference, getContent } = await import("./index.js");
      const firstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]',
      );
      if (!firstViewportMetaElement) expect.fail();
      const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
      if (!(secondViewportMetaElement instanceof Element)) expect.fail();
      secondViewportMetaElement.setAttribute(
        "content",
        "width=device-width,initial-scale=1",
      );
      document.head.removeChild(firstViewportMetaElement);
      document.head.appendChild(secondViewportMetaElement);
      updateReference();
      expect(getContent()).toStrictEqual({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768,
      });
    });
  });
});

describe("constructor of ViewportExtra class", () => {
  describe("updating content attribute of viewport meta element", () => {
    describe("case where viewport width is less than minWidth value in merged result of current internalPartialMediaSpecificParametersList variable and argument", () => {
      it("updates width to minimum width and initial-scale to value that fits minimum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        new ViewportExtra({ minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=0.7729468599033816,interactive-widget=resizes-visual,width=414",
        );
      });
    });

    describe("case where viewport width is greater than maxWidth value in merged result of current internalPartialMediaSpecificParametersList variable and argument", () => {
      it("updates width to maximum width and initial-scale to value that fits maximum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        new ViewportExtra({ maxWidth: 768 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=1.3333333333333333,interactive-widget=resizes-visual,width=768",
        );
      });
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates content attribute of first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        new ViewportExtra({ minWidth: 414 });
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0]?.getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1]?.getAttribute("content")).toBe("");
      });
    });
  });
});

describe("setParameters method of ViewportExtra class", () => {
  describe("updating content attribute of viewport meta element", () => {
    describe("case where viewport width is less than minWidth value in merged result of current internalPartialMediaSpecificParametersList variable and first argument", () => {
      it("updates width to minimum width and initial-scale to value that fits minimum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        ViewportExtra.setParameters([
          { content: { minWidth: 375 } },
          { content: { minWidth: 414 } },
        ]);
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=0.7729468599033816,interactive-widget=resizes-visual,width=414",
        );
      });
    });

    describe("case where viewport width is greater than maxWidth value in merged result of current internalPartialMediaSpecificParametersList variable and first argument", () => {
      it("updates width to maximum width and initial-scale to value that fits maximum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        ViewportExtra.setParameters([
          { content: { maxWidth: 640 } },
          { content: { maxWidth: 768 } },
        ]);
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=1.3333333333333333,interactive-widget=resizes-visual,width=768",
        );
      });
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates content attribute of first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        ViewportExtra.setParameters([{ content: { minWidth: 414 } }]);
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0]?.getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1]?.getAttribute("content")).toBe("");
      });
    });
  });
});

describe("setContent method of ViewportExtra class", () => {
  describe("updating content attribute of viewport meta element", () => {
    describe("case where viewport width is less than minWidth value in merged result of current internalPartialMediaSpecificParametersList variable and argument", () => {
      it("updates width to minimum width and initial-scale to value that fits minimum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        ViewportExtra.setContent({ minWidth: 414 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=0.7729468599033816,interactive-widget=resizes-visual,width=414",
        );
      });
    });

    describe("case where viewport width is greater than maxWidth value in merged result of current internalPartialMediaSpecificParametersList variable and argument", () => {
      it("updates width to maximum width and initial-scale to value that fits maximum width into viewport", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 1024,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="interactive-widget=resizes-visual" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        ViewportExtra.setContent({ maxWidth: 768 });
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute("content"),
        ).toBe(
          "initial-scale=1.3333333333333333,interactive-widget=resizes-visual,width=768",
        );
      });
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates content attribute of first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
        `;
        const { default: ViewportExtra } = await import("./index.js");
        ViewportExtra.setContent({ minWidth: 414 });
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0]?.getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1]?.getAttribute("content")).toBe("");
      });
    });
  });
});

describe("getContent method of ViewportExtra class", () => {
  it("returns Content object used to update content attribute of viewport meta element if no media queries are specified", async () => {
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=640,initial-scale=2" />
      <meta name="viewport-extra" content="min-width=414,max-width=768" />
    `;
    const { default: ViewportExtra } = await import("./index.js");
    expect(ViewportExtra.getContent()).toStrictEqual({
      width: 640,
      initialScale: 2,
      minWidth: 414,
      maxWidth: 768,
    });
  });
});

describe("updateReference method of ViewportExtra class", () => {
  describe("updating reference to viewport meta element", () => {
    it("updates reference to viewport meta element", async () => {
      Object.defineProperty(document.documentElement, "clientWidth", {
        value: 320,
        configurable: true,
      });
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      `;
      const { default: ViewportExtra, setContent } = await import("./index.js");
      const firstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]',
      );
      if (!firstViewportMetaElement) expect.fail();
      const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
      if (!(secondViewportMetaElement instanceof Element)) expect.fail();
      document.head.removeChild(firstViewportMetaElement);
      document.head.appendChild(secondViewportMetaElement);
      ViewportExtra.updateReference();
      setContent({ minWidth: 414 });
      expect(secondViewportMetaElement.getAttribute("content")).toBe(
        "initial-scale=0.7729468599033816,width=414",
      );
    });

    describe("case where multiple viewport meta elements exist", () => {
      it("updates reference to first viewport meta element", async () => {
        Object.defineProperty(document.documentElement, "clientWidth", {
          value: 320,
          configurable: true,
        });
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport" content="" />
        `;
        const { default: ViewportExtra, setContent } = await import(
          "./index.js"
        );
        const firstViewportMetaElement = document.querySelector(
          'meta[name="viewport"]',
        );
        if (!firstViewportMetaElement) expect.fail();
        const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
        if (!(secondViewportMetaElement instanceof Element)) expect.fail();
        document.head.replaceChild(
          secondViewportMetaElement,
          firstViewportMetaElement,
        );
        ViewportExtra.updateReference();
        setContent({ minWidth: 414 });
        const viewportElementList = document.querySelectorAll(
          'meta[name="viewport"]',
        );
        expect(viewportElementList[0].getAttribute("content")).toBe(
          "initial-scale=0.7729468599033816,width=414",
        );
        expect(viewportElementList[1].getAttribute("content")).toBe("");
      });
    });
  });

  describe("target of updating", () => {
    it("does not update content object", async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=640,initial-scale=2" />
        <meta name="viewport-extra" content="min-width=414,max-width=768" />
      `;
      const { default: ViewportExtra, getContent } = await import("./index.js");
      const firstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]',
      );
      if (!firstViewportMetaElement) expect.fail();
      const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
      if (!(secondViewportMetaElement instanceof Element)) expect.fail();
      secondViewportMetaElement.setAttribute(
        "content",
        "width=device-width,initial-scale=1",
      );
      document.head.removeChild(firstViewportMetaElement);
      document.head.appendChild(secondViewportMetaElement);
      ViewportExtra.updateReference();
      expect(getContent()).toStrictEqual({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768,
      });
    });
  });
});
