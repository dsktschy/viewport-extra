describe('about src/index.ts', () => {
  test('activation by importing module in document that has no viewport meta element', async () => {
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe('initial-scale=1,width=device-width')
  })

  test('activation by importing module in document that has <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=375,max-width=414">, and 320px width', async () => {
    const minWidth = 375
    const maxWidth = 414
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    const createdViewportElement = document.createElement('meta')
    createdViewportElement.setAttribute('name', 'viewport')
    createdViewportElement.setAttribute(
      'content',
      'width=device-width,initial-scale=1'
    )
    createdViewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(createdViewportElement)
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe(
      `initial-scale=${documentClientWidth / minWidth},width=${minWidth}`
    )
  })

  test('activation by importing module in document that has <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=375,max-width=414">, and 320px width', async () => {
    const minWidth = 375
    const maxWidth = 414
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    const createdViewportExtraElement = document.createElement('meta')
    createdViewportExtraElement.setAttribute('name', 'viewport-extra')
    createdViewportExtraElement.setAttribute(
      'content',
      `width=device-width,initial-scale=1,min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(createdViewportExtraElement)
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe(
      `initial-scale=${documentClientWidth / minWidth},width=${minWidth}`
    )
  })

  test('activation by importing module in document that has <meta name="viewport" content="width=device-width,initial-scale=1">, <meta name="viewport-extra" content="min-width=375,max-width=414">, and 320px width', async () => {
    const minWidth = 375
    const maxWidth = 414
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    const createdViewportElement = document.createElement('meta')
    const createdViewportExtraElement = document.createElement('meta')
    createdViewportElement.setAttribute('name', 'viewport')
    createdViewportExtraElement.setAttribute('name', 'viewport-extra')
    createdViewportElement.setAttribute(
      'content',
      'width=device-width,initial-scale=1'
    )
    createdViewportExtraElement.setAttribute(
      'content',
      `min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(createdViewportElement)
    document.head.appendChild(createdViewportExtraElement)
    // Run module again
    jest.resetModules()
    await import('../src/index')
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe(
      `initial-scale=${documentClientWidth / minWidth},width=${minWidth}`
    )
  })

  test('`setOptions` sets correct content attribute with valid options', async () => {
    const minWidth = 375
    const maxWidth = 414
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    const { setOptions } = await import('../src/index')
    setOptions({ minWidth, maxWidth })
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe(
      `initial-scale=${documentClientWidth / minWidth},width=${minWidth}`
    )
  })

  test('`setOptions` throws error with invalid options', async () => {
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    const { setOptions } = await import('../src/index')
    const { NoOptionsError } = await import('../src/lib/Error')
    const bindedSetOptions = setOptions.bind(null, {})
    expect(bindedSetOptions).toThrowError(NoOptionsError)
  })

  test('`restore` updates viewport meta element to original state', async () => {
    const minWidth = 375
    const maxWidth = 414
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    const createdViewportElement = document.createElement('meta')
    createdViewportElement.setAttribute('name', 'viewport')
    createdViewportElement.setAttribute(
      'content',
      'width=device-width,initial-scale=1,invalid=true'
    )
    createdViewportElement.setAttribute(
      'data-extra-content',
      `min-width=${minWidth},max-width=${maxWidth}`
    )
    document.head.appendChild(createdViewportElement)
    // Run module again
    jest.resetModules()
    const { restore } = await import('../src/index')
    restore()
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe(
      'initial-scale=1,invalid=true,width=device-width'
    )
  })

  test('constructor of `ViewportExtra` class sets correct content attribute with valid options', async () => {
    const minWidth = 375
    const maxWidth = 414
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    const { default: ViewportExtra } = await import('../src/index')
    new ViewportExtra({ minWidth, maxWidth })
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe(
      `initial-scale=${documentClientWidth / minWidth},width=${minWidth}`
    )
  })

  test('constructor of `ViewportExtra` class throws error with invalid options', async () => {
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    const { default: ViewportExtra } = await import('../src/index')
    const { NoOptionsError } = await import('../src/lib/Error')
    const createViewportExtraInstance = () => new ViewportExtra({})
    expect(createViewportExtraInstance).toThrowError(NoOptionsError)
  })
})
