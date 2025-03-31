import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  document.documentElement.innerHTML = '<head></head><body></body>'
})

describe('side effects', () => {
  describe('ensuring existence of viewport meta element', () => {
    describe('case where viewport meta element exists', () => {
      it('uses existing viewport meta element', async () => {
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        await import('./index.js')
        expect(document.querySelectorAll('meta[name="viewport"]')).toHaveLength(
          1
        )
      })
    })

    describe('case where viewport meta element does not exist', () => {
      it('appends viewport meta element', async () => {
        document.head.innerHTML = `
          <meta charset="utf-8" />
        `
        await import('./index.js')
        expect(document.querySelectorAll('meta[name="viewport"]')).toHaveLength(
          1
        )
      })
    })
  })

  describe('merging content attributes of viewport and viewport-extra meta elements', () => {
    describe('case where content attributes of both meta elements have no duplicate key-value pairs', () => {
      it('uses key-value pairs of both meta elements', async () => {
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=640" data-extra-content="min-width=414" />
          <meta name="viewport-extra" content="initial-scale=2,max-width=768" />
        `
        const { getContent } = await import('./index.js')
        expect(getContent()).toStrictEqual({
          width: 640,
          initialScale: 2,
          minWidth: 414,
          maxWidth: 768
        })
      })
    })

    describe('case where content attributes of both meta elements have duplicate key-value pairs', () => {
      it('uses key-value pairs of viewport-extra meta element', async () => {
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=360,max-width=640" />
          <meta name="viewport-extra" content="width=640,initial-scale=2,min-width=414,max-width=768" />
        `
        const { getContent } = await import('./index.js')
        expect(getContent()).toStrictEqual({
          width: 640,
          initialScale: 2,
          minWidth: 414,
          maxWidth: 768
        })
      })
    })

    describe('case where content attributes of both meta elements have missing key-value pairs', () => {
      it('uses default key-value pairs', async () => {
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="" />
          <meta name="viewport-extra" content="" />
        `
        const { getContent } = await import('./index.js')
        expect(getContent()).toStrictEqual({
          width: 'device-width',
          initialScale: 1,
          minWidth: 0,
          maxWidth: Infinity
        })
      })
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 320,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="min-width=414" />
        `
        await import('./index.js')
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=0.7729468599033816,width=414')
      })
    })

    describe('case where viewport width is greater than maxWidth property of object whose index in mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 1024,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="max-width=768" />
        `
        await import('./index.js')
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=1.3333333333333333,width=768')
      })
    })
  })
})

describe('setParameters', () => {
  describe('merging current mediaSpecificParametersList array and first argument', () => {
    it('deeply merges object with index 1 of current mediaSpecificParametersList and all objects in argument array, with rule that values in argument array overwrites values in current mediaSpecificParametersList and values in object whose index is higher overwrites values in object whose index is lower', async () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 320,
        configurable: true
      })
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=320,max-width=640" />
      `
      const { setParameters } = await import('./index.js')
      setParameters([
        { content: { initialScale: 2, minWidth: 360 } },
        { content: { minWidth: 414 } }
      ])
      expect(
        document.querySelector('meta[name="viewport"]')?.getAttribute('content')
      ).toBe('initial-scale=1.5458937198067633,width=414')
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 320,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { setParameters } = await import('./index.js')
        setParameters([{ content: { minWidth: 414 } }])
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=0.7729468599033816,width=414')
      })
    })

    describe('case where viewport width is greater than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 1024,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { setParameters } = await import('./index.js')
        setParameters([{ content: { maxWidth: 768 } }])
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=1.3333333333333333,width=768')
      })
    })
  })
})

describe('setContent', () => {
  describe('merging current mediaSpecificParametersList array and argument', () => {
    it('merges content property in object with index 1 of current mediaSpecificParametersList and argument object, with rule that values in argument object overwrites values in current mediaSpecificParametersList', async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=360,max-width=640" />
      `
      const { setContent, getContent } = await import('./index.js')
      setContent({ width: 640, initialScale: 2, minWidth: 414, maxWidth: 768 })
      expect(getContent()).toStrictEqual({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768
      })
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 320,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { setContent } = await import('./index.js')
        setContent({ minWidth: 414 })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=0.7729468599033816,width=414')
      })
    })

    describe('case where viewport width is greater than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 1024,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { setContent } = await import('./index.js')
        setContent({ maxWidth: 768 })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=1.3333333333333333,width=768')
      })
    })
  })
})

describe('getContent', () => {
  it('returns Content object used to update content attribute of viewport meta element', async () => {
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=640,initial-scale=2" />
      <meta name="viewport-extra" content="min-width=414,max-width=768" />
    `
    const { getContent } = await import('./index.js')
    expect(getContent()).toStrictEqual({
      width: 640,
      initialScale: 2,
      minWidth: 414,
      maxWidth: 768
    })
  })
})

describe('updateReference', () => {
  it('updates reference to viewport meta element', async () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 320,
      configurable: true
    })
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    `
    const { updateReference, setContent } = await import('./index.js')
    const firstViewportMetaElement = document.querySelector(
      'meta[name="viewport"]'
    )
    if (!firstViewportMetaElement) expect.fail()
    const secondViewportMetaElement = firstViewportMetaElement.cloneNode()
    if (!(secondViewportMetaElement instanceof Element)) expect.fail()
    document.head.removeChild(firstViewportMetaElement)
    document.head.appendChild(secondViewportMetaElement)
    updateReference()
    setContent({ minWidth: 414 })
    expect(secondViewportMetaElement.getAttribute('content')).toBe(
      'initial-scale=0.7729468599033816,width=414'
    )
  })

  describe('target of updating', () => {
    it('does not update content object', async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=640,initial-scale=2" />
        <meta name="viewport-extra" content="min-width=414,max-width=768" />
      `
      const { updateReference, getContent } = await import('./index.js')
      const firstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]'
      )
      if (!firstViewportMetaElement) expect.fail()
      const secondViewportMetaElement = firstViewportMetaElement.cloneNode()
      if (!(secondViewportMetaElement instanceof Element)) expect.fail()
      secondViewportMetaElement.setAttribute(
        'content',
        'width=device-width,initial-scale=1'
      )
      document.head.removeChild(firstViewportMetaElement)
      document.head.appendChild(secondViewportMetaElement)
      updateReference()
      expect(getContent()).toStrictEqual({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768
      })
    })
  })
})

describe('constructor of ViewportExtra class', () => {
  describe('merging current mediaSpecificParametersList array and argument number', () => {
    it('overwrites content.minWidth property in object with index 1 of current mediaSpecificParametersList with argument number', async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=360" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      new ViewportExtra(414)
      expect(getContent()).toStrictEqual({
        width: 'device-width',
        initialScale: 1,
        minWidth: 414,
        maxWidth: Infinity
      })
    })
  })

  describe('merging current mediaSpecificParametersList array and argument object', () => {
    it('merges content property in object with index 1 of current mediaSpecificParametersList and argument object, with rule that values in argument object overwrites values in current mediaSpecificParametersList', async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=360,max-width=640" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      new ViewportExtra({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768
      })
      expect(getContent()).toStrictEqual({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768
      })
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 320,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        new ViewportExtra({ minWidth: 414 })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=0.7729468599033816,width=414')
      })
    })

    describe('case where viewport width is greater than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 1024,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        new ViewportExtra({ maxWidth: 768 })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=1.3333333333333333,width=768')
      })
    })
  })
})

describe('setParameters method of ViewportExtra class', () => {
  describe('merging current mediaSpecificParametersList array and first argument', () => {
    it('deeply merges object with index 1 of current mediaSpecificParametersList and all objects in argument array, with rule that values in argument array overwrites values in current mediaSpecificParametersList and values in object whose index is higher overwrites values in object whose index is lower', async () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 320,
        configurable: true
      })
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=320,max-width=640" />
      `
      const { default: ViewportExtra } = await import('./index.js')
      ViewportExtra.setParameters([
        { content: { initialScale: 2, minWidth: 360 } },
        { content: { minWidth: 414 } }
      ])
      expect(
        document.querySelector('meta[name="viewport"]')?.getAttribute('content')
      ).toBe('initial-scale=1.5458937198067633,width=414')
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 320,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        ViewportExtra.setParameters([{ content: { minWidth: 414 } }])
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=0.7729468599033816,width=414')
      })
    })

    describe('case where viewport width is greater than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 1024,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        ViewportExtra.setParameters([{ content: { maxWidth: 768 } }])
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=1.3333333333333333,width=768')
      })
    })
  })
})

describe('setContent method of ViewportExtra class', () => {
  describe('merging current mediaSpecificParametersList array and argument', () => {
    it('merges content property in object with index 1 of current mediaSpecificParametersList and argument object, with rule that values in argument object overwrites values in current mediaSpecificParametersList', async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=360,max-width=640" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      ViewportExtra.setContent({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768
      })
      expect(getContent()).toStrictEqual({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768
      })
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 320,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        ViewportExtra.setContent({ minWidth: 414 })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=0.7729468599033816,width=414')
      })
    })

    describe('case where viewport width is greater than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 1024,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        ViewportExtra.setContent({ maxWidth: 768 })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe('initial-scale=1.3333333333333333,width=768')
      })
    })
  })
})

describe('getContent method of ViewportExtra class', () => {
  it('returns Content object used to update content attribute of viewport meta element', async () => {
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=640,initial-scale=2" />
      <meta name="viewport-extra" content="min-width=414,max-width=768" />
    `
    const { default: ViewportExtra } = await import('./index.js')
    expect(ViewportExtra.getContent()).toStrictEqual({
      width: 640,
      initialScale: 2,
      minWidth: 414,
      maxWidth: 768
    })
  })
})

describe('updateReference method of ViewportExtra class', () => {
  it('updates reference to viewport meta element', async () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 320,
      configurable: true
    })
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    `
    const { default: ViewportExtra, setContent } = await import('./index.js')
    const firstViewportMetaElement = document.querySelector(
      'meta[name="viewport"]'
    )
    if (!firstViewportMetaElement) expect.fail()
    const secondViewportMetaElement = firstViewportMetaElement.cloneNode()
    if (!(secondViewportMetaElement instanceof Element)) expect.fail()
    document.head.removeChild(firstViewportMetaElement)
    document.head.appendChild(secondViewportMetaElement)
    ViewportExtra.updateReference()
    setContent({ minWidth: 414 })
    expect(secondViewportMetaElement.getAttribute('content')).toBe(
      'initial-scale=0.7729468599033816,width=414'
    )
  })

  describe('target of updating', () => {
    it('does not update content object', async () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=640,initial-scale=2" />
        <meta name="viewport-extra" content="min-width=414,max-width=768" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      const firstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]'
      )
      if (!firstViewportMetaElement) expect.fail()
      const secondViewportMetaElement = firstViewportMetaElement.cloneNode()
      if (!(secondViewportMetaElement instanceof Element)) expect.fail()
      secondViewportMetaElement.setAttribute(
        'content',
        'width=device-width,initial-scale=1'
      )
      document.head.removeChild(firstViewportMetaElement)
      document.head.appendChild(secondViewportMetaElement)
      ViewportExtra.updateReference()
      expect(getContent()).toStrictEqual({
        width: 640,
        initialScale: 2,
        minWidth: 414,
        maxWidth: 768
      })
    })
  })
})
