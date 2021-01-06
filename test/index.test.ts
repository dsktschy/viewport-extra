describe('about src/index.ts', () => {
  test('activation by importing module in document that has no viewport meta element', async () => {
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const contentAttributeValue = document.head
      .querySelector('meta[name="viewport"]')
      ?.getAttribute('content')
    expect(contentAttributeValue).toBe('initial-scale=1,width=device-width')
  })

  test('activation by importing module in document that has `<meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=375,max-width=414">`, and 320px width', async () => {
    const width = 'device-width'
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScale}`
    )
    viewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(viewportElement)
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const contentAttributeValue = viewportElement.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${
        (documentClientWidth / minWidth) * initialScale
      },width=${minWidth}`
    )
  })

  test('activation by importing module in document that has `<meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=375,max-width=414">`, and 320px width', async () => {
    const width = 'device-width'
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportExtraElement = document.createElement('meta')
    viewportExtraElement.setAttribute('name', 'viewport-extra')
    viewportExtraElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScale},min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(viewportExtraElement)
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const contentAttributeValue = document.head
      .querySelector('meta[name="viewport"]')
      ?.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${
        (documentClientWidth / minWidth) * initialScale
      },width=${minWidth}`
    )
  })

  test('activation by importing module in document that has `<meta name="viewport" content="width=device-width,initial-scale=1">`, `<meta name="viewport-extra" content="min-width=375,max-width=414">`, and 320px width', async () => {
    const width = 'device-width'
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportElement = document.createElement('meta')
    const viewportExtraElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportExtraElement.setAttribute('name', 'viewport-extra')
    viewportElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScale}`
    )
    viewportExtraElement.setAttribute(
      'content',
      `min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(viewportElement)
    document.head.appendChild(viewportExtraElement)
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const contentAttributeValue = viewportElement.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${
        (documentClientWidth / minWidth) * initialScale
      },width=${minWidth}`
    )
  })

  test("whether `setContent` sets correct content attribute with following conditions. params: `{ width: 'device-width', initialScale: 1, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `320`", async () => {
    const width = 'device-width'
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    const { setContent } = await import('../src/index')
    setContent({ width, initialScale, minWidth, maxWidth })
    const contentAttributeValue = document.head
      .querySelector('meta[name="viewport"]')
      ?.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${
        (documentClientWidth / minWidth) * initialScale
      },width=${minWidth}`
    )
  })

  test('whether `setContent` correctly updates content attribute with following conditions. params: `{ initialScale: 2, minWidth: 320 }`, documentClientWidth: `320`', async () => {
    const width = 'device-width'
    const initialScaleBefore = 1
    const initialScaleAfter = 2
    const minWidthBefore = 375
    const minWidthAfter = 320
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScaleBefore}`
    )
    viewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidthBefore},max-width=${maxWidth}`
    )
    document.head.appendChild(viewportElement)
    // Run module again
    jest.resetModules()
    const { setContent } = await import('../src/index')
    setContent({ initialScale: initialScaleAfter, minWidth: minWidthAfter })
    const contentAttributeValue = viewportElement.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${initialScaleAfter},width=device-width`
    )
  })

  test("whether constructor of `ViewportExtra` class sets correct content attribute with following conditions. params: `{ width: 'device-width', initialScale: 1, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `420`", async () => {
    const width = 'device-width'
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 420
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    const { default: ViewportExtra } = await import('../src/index')
    new ViewportExtra({ width, initialScale, minWidth, maxWidth })
    const contentAttributeValue = document.head
      .querySelector('meta[name="viewport"]')
      ?.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${
        (documentClientWidth / maxWidth) * initialScale
      },width=${maxWidth}`
    )
  })

  test('whether constructor of `ViewportExtra` class sets correct content attribute with following conditions. params: `375`, documentClientWidth: `320`', async () => {
    const initialScale = 1
    const minWidth = 375
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    const { default: ViewportExtra } = await import('../src/index')
    new ViewportExtra(minWidth)
    const contentAttributeValue = document.head
      .querySelector('meta[name="viewport"]')
      ?.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${
        (documentClientWidth / minWidth) * initialScale
      },width=${minWidth}`
    )
  })

  test('whether constructor of `ViewportExtra` class correctly updates content attribute with following conditions. params: `{ initialScale: 2, maxWidth: 420 }`, documentClientWidth: `420`', async () => {
    const width = 'device-width'
    const initialScaleBefore = 1
    const initialScaleAfter = 2
    const minWidth = 375
    const maxWidthBefore = 414
    const maxWidthAfter = 420
    // Set clientWidth to document
    const documentClientWidth = 420
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScaleBefore}`
    )
    viewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidth},max-width=${maxWidthBefore}`
    )
    document.head.appendChild(viewportElement)
    // Run module again
    jest.resetModules()
    const { default: ViewportExtra } = await import('../src/index')
    new ViewportExtra({
      initialScale: initialScaleAfter,
      maxWidth: maxWidthAfter
    })
    const contentAttributeValue = viewportElement.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${initialScaleAfter},width=device-width`
    )
  })

  test('whether constructor of `ViewportExtra` class correctly updates content attribute with following conditions. params: `320`, documentClientWidth: `320`', async () => {
    const width = 'device-width'
    const initialScale = 1
    const minWidthBefore = 375
    const minWidthAfter = 320
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScale}`
    )
    viewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidthBefore},max-width=${maxWidth}`
    )
    document.head.appendChild(viewportElement)
    // Run module again
    jest.resetModules()
    const { default: ViewportExtra } = await import('../src/index')
    new ViewportExtra(minWidthAfter)
    const contentAttributeValue = viewportElement.getAttribute('content')
    expect(contentAttributeValue).toBe(
      `initial-scale=${initialScale},width=device-width`
    )
  })

  test("whether `getContent` gets correct content with following params. `{ width: 'device-width', initialScale: 1, minWidth: 375, maxWidth: 414 }`", async () => {
    const width = 'device-width'
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScale}`
    )
    viewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(viewportElement)
    // Run module again
    jest.resetModules()
    const { getContent } = await import('../src/index')
    expect(getContent()).toStrictEqual({
      width,
      initialScale,
      minWidth,
      maxWidth
    })
  })

  test('whether `getContent` gets correct content after `setContent` with following params. `{ initialScale: 2, minWidth: 320 }`', async () => {
    const width = 'device-width'
    const initialScaleBefore = 1
    const initialScaleAfter = 2
    const minWidthBefore = 375
    const minWidthAfter = 320
    const maxWidth = 414
    // Set clientWidth to document
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    // Reset and prepare document
    document.head.innerHTML = ''
    const viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute(
      'content',
      `width=${width},initial-scale=${initialScaleBefore}`
    )
    viewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidthBefore},max-width=${maxWidth}`
    )
    document.head.appendChild(viewportElement)
    // Run module again
    jest.resetModules()
    const { setContent, getContent } = await import('../src/index')
    setContent({ initialScale: initialScaleAfter, minWidth: minWidthAfter })
    expect(getContent()).toStrictEqual({
      width,
      initialScale: initialScaleAfter,
      minWidth: minWidthAfter,
      maxWidth
    })
  })
})
