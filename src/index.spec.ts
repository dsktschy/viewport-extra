import { describe, beforeEach, vi, it, expect } from 'vitest'

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
        const width = 640
        const initialScale = 2
        const minWidth = 414
        const maxWidth = 768
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=${width}" data-extra-content="min-width=${minWidth}" />
          <meta name="viewport-extra" content="initial-scale=${initialScale},max-width=${maxWidth}" />
        `
        const { getContent } = await import('./index.js')
        expect(getContent()).toStrictEqual({
          width,
          initialScale,
          minWidth,
          maxWidth
        })
      })
    })

    describe('case where content attributes of both meta elements have duplicate key-value pairs', () => {
      it('uses key-value pairs of viewport-extra meta element', async () => {
        const width = 640
        const initialScale = 2
        const minWidth = 414
        const maxWidth = 768
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=360,max-width=640" />
          <meta name="viewport-extra" content="width=${width},initial-scale=${initialScale},min-width=${minWidth},max-width=${maxWidth}" />
        `
        const { getContent } = await import('./index.js')
        expect(getContent()).toStrictEqual({
          width,
          initialScale,
          minWidth,
          maxWidth
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
        const viewportWidth = 320
        const minWidth = 414
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="min-width=${minWidth}" />
        `
        await import('./index.js')
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / minWidth},width=${minWidth}`)
      })
    })

    describe('case where viewport width is less than maxWidth property of object whose index in mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        const viewportWidth = 1024
        const maxWidth = 768
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="viewport-extra" content="max-width=${maxWidth}" />
        `
        await import('./index.js')
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / maxWidth},width=${maxWidth}`)
      })
    })
  })
})

describe('setContent', () => {
  describe('merging current mediaSpecificParametersList array and argument', () => {
    it('merges content property in object with index 1 of current mediaSpecificParametersList and argument object, with rule that values in argument object overwrites values in current mediaSpecificParametersList', async () => {
      const width = 640
      const initialScale = 2
      const minWidth = 414
      const maxWidth = 768
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=360,max-width=640" />
      `
      const { setContent, getContent } = await import('./index.js')
      setContent({ width, initialScale, minWidth, maxWidth })
      expect(getContent()).toStrictEqual({
        width,
        initialScale,
        minWidth,
        maxWidth
      })
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        const viewportWidth = 320
        const minWidth = 414
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { setContent } = await import('./index.js')
        setContent({ minWidth })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / minWidth},width=${minWidth}`)
      })
    })

    describe('case where viewport width is less than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        const viewportWidth = 1024
        const maxWidth = 768
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { setContent } = await import('./index.js')
        setContent({ maxWidth })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / maxWidth},width=${maxWidth}`)
      })
    })
  })
})

describe('getContent', () => {
  it('returns current content object', async () => {
    const width = 640
    const initialScale = 2
    const minWidth = 414
    const maxWidth = 768
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
      <meta name="viewport-extra" content="min-width=${minWidth},max-width=${maxWidth}" />
    `
    const { getContent } = await import('./index.js')
    expect(getContent()).toStrictEqual({
      width,
      initialScale,
      minWidth,
      maxWidth
    })
  })
})

describe('updateReference', () => {
  it('updates reference to viewport meta element', async () => {
    const viewportWidth = 320
    const minWidth = 414
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: viewportWidth,
      configurable: true
    })
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    `
    const { updateReference, setContent } = await import('./index.js')
    const fitstViewportMetaElement = document.querySelector(
      'meta[name="viewport"]'
    )
    if (!fitstViewportMetaElement) expect.fail()
    const secondViewportMetaElement = fitstViewportMetaElement.cloneNode()
    if (!(secondViewportMetaElement instanceof Element)) expect.fail()
    document.head.removeChild(fitstViewportMetaElement)
    document.head.appendChild(secondViewportMetaElement)
    updateReference()
    setContent({ minWidth })
    expect(secondViewportMetaElement.getAttribute('content')).toBe(
      `initial-scale=${viewportWidth / minWidth},width=${minWidth}`
    )
  })

  describe('target of updating', () => {
    it('does not update content object', async () => {
      const width = 640
      const initialScale = 2
      const minWidth = 414
      const maxWidth = 768
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
        <meta name="viewport-extra" content="min-width=${minWidth},max-width=${maxWidth}" />
      `
      const { updateReference, getContent } = await import('./index.js')
      const fitstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]'
      )
      if (!fitstViewportMetaElement) expect.fail()
      const secondViewportMetaElement = fitstViewportMetaElement.cloneNode()
      if (!(secondViewportMetaElement instanceof Element)) expect.fail()
      secondViewportMetaElement.setAttribute(
        'content',
        'width=device-width,initial-scale=1'
      )
      document.head.removeChild(fitstViewportMetaElement)
      document.head.appendChild(secondViewportMetaElement)
      updateReference()
      expect(getContent()).toStrictEqual({
        width,
        initialScale,
        minWidth,
        maxWidth
      })
    })
  })
})

describe('constructor of ViewportExtra class', () => {
  describe('merging current mediaSpecificParametersList array and argument number', () => {
    it('overwrites content.minWidth property in object with index 1 of current mediaSpecificParametersList with argument number', async () => {
      const width = 'device-width'
      const initialScale = 1
      const minWidth = 414
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
        <meta name="viewport-extra" content="min-width=360" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      new ViewportExtra(minWidth)
      expect(getContent()).toStrictEqual({
        width,
        initialScale,
        minWidth,
        maxWidth: Infinity
      })
    })
  })

  describe('merging current mediaSpecificParametersList array and argument object', () => {
    it('merges content property in object with index 1 of current mediaSpecificParametersList and argument object, with rule that values in argument object overwrites values in current mediaSpecificParametersList', async () => {
      const width = 640
      const initialScale = 2
      const minWidth = 414
      const maxWidth = 768
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=360,max-width=640" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      new ViewportExtra({ width, initialScale, minWidth, maxWidth })
      expect(getContent()).toStrictEqual({
        width,
        initialScale,
        minWidth,
        maxWidth
      })
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        const viewportWidth = 320
        const minWidth = 414
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        new ViewportExtra({ minWidth })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / minWidth},width=${minWidth}`)
      })
    })

    describe('case where viewport width is less than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        const viewportWidth = 1024
        const maxWidth = 768
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        new ViewportExtra({ maxWidth })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / maxWidth},width=${maxWidth}`)
      })
    })
  })
})

describe('setContent method of ViewportExtra class', () => {
  describe('merging current mediaSpecificParametersList array and argument', () => {
    it('merges content property in object with index 1 of current mediaSpecificParametersList and argument object, with rule that values in argument object overwrites values in current mediaSpecificParametersList', async () => {
      const width = 640
      const initialScale = 2
      const minWidth = 414
      const maxWidth = 768
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=360,max-width=640" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      ViewportExtra.setContent({ width, initialScale, minWidth, maxWidth })
      expect(getContent()).toStrictEqual({
        width,
        initialScale,
        minWidth,
        maxWidth
      })
    })
  })

  describe('updating content attribute of viewport meta element', () => {
    describe('case where viewport width is less than minWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to minimum width and initial-scale to value that fits minimum width into viewport', async () => {
        const viewportWidth = 320
        const minWidth = 414
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        ViewportExtra.setContent({ minWidth })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / minWidth},width=${minWidth}`)
      })
    })

    describe('case where viewport width is less than maxWidth property of object whose index in merged mediaSpecificParametersList array is 1', () => {
      it('updates width to maximum width and initial-scale to value that fits maximum width into viewport', async () => {
        const viewportWidth = 1024
        const maxWidth = 768
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: viewportWidth,
          configurable: true
        })
        document.head.innerHTML = `
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        `
        const { default: ViewportExtra } = await import('./index.js')
        ViewportExtra.setContent({ maxWidth })
        expect(
          document
            .querySelector('meta[name="viewport"]')
            ?.getAttribute('content')
        ).toBe(`initial-scale=${viewportWidth / maxWidth},width=${maxWidth}`)
      })
    })
  })
})

describe('getContent method of ViewportExtra class', () => {
  it('returns current content object', async () => {
    const width = 640
    const initialScale = 2
    const minWidth = 414
    const maxWidth = 768
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
      <meta name="viewport-extra" content="min-width=${minWidth},max-width=${maxWidth}" />
    `
    const { default: ViewportExtra } = await import('./index.js')
    expect(ViewportExtra.getContent()).toStrictEqual({
      width,
      initialScale,
      minWidth,
      maxWidth
    })
  })
})

describe('updateReference method of ViewportExtra class', () => {
  it('updates reference to viewport meta element', async () => {
    const viewportWidth = 320
    const minWidth = 414
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: viewportWidth,
      configurable: true
    })
    document.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    `
    const { default: ViewportExtra, setContent } = await import('./index.js')
    const fitstViewportMetaElement = document.querySelector(
      'meta[name="viewport"]'
    )
    if (!fitstViewportMetaElement) expect.fail()
    const secondViewportMetaElement = fitstViewportMetaElement.cloneNode()
    if (!(secondViewportMetaElement instanceof Element)) expect.fail()
    document.head.removeChild(fitstViewportMetaElement)
    document.head.appendChild(secondViewportMetaElement)
    ViewportExtra.updateReference()
    setContent({ minWidth })
    expect(secondViewportMetaElement.getAttribute('content')).toBe(
      `initial-scale=${viewportWidth / minWidth},width=${minWidth}`
    )
  })

  describe('target of updating', () => {
    it('does not update content object', async () => {
      const width = 640
      const initialScale = 2
      const minWidth = 414
      const maxWidth = 768
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=${width},initial-scale=${initialScale}" />
        <meta name="viewport-extra" content="min-width=${minWidth},max-width=${maxWidth}" />
      `
      const { default: ViewportExtra, getContent } = await import('./index.js')
      const fitstViewportMetaElement = document.querySelector(
        'meta[name="viewport"]'
      )
      if (!fitstViewportMetaElement) expect.fail()
      const secondViewportMetaElement = fitstViewportMetaElement.cloneNode()
      if (!(secondViewportMetaElement instanceof Element)) expect.fail()
      secondViewportMetaElement.setAttribute(
        'content',
        'width=device-width,initial-scale=1'
      )
      document.head.removeChild(fitstViewportMetaElement)
      document.head.appendChild(secondViewportMetaElement)
      ViewportExtra.updateReference()
      expect(getContent()).toStrictEqual({
        width,
        initialScale,
        minWidth,
        maxWidth
      })
    })
  })
})
