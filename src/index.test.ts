describe('about src/index.ts', () => {
  test('importing as ES module in document that has no viewport meta element', async () => {
    const documentClientWidth = 320
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: documentClientWidth,
      writable: true
    })
    document.head.innerHTML = ''
    // Run module again
    jest.resetModules()
    await import('./index')
    const selectedViewportElement = document.head.querySelector(
      'meta[name="viewport"]'
    )
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe('initial-scale=1,width=device-width')
  })

  test('importing as ES module in document that has <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=375,max-width=414">, and 320px width', async () => {
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
    await import('./index')
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

  test('importing as ES module in document that has <meta name="viewport-extra" content="width=device-width,initial-scale=1,min-width=375,max-width=414">, and 320px width', async () => {
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
    await import('./index')
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

  test('importing as ES module in document that has <meta name="viewport" content="width=device-width,initial-scale=1">, <meta name="viewport-extra" content="min-width=375,max-width=414">, and 320px width', async () => {
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
    await import('./index')
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
})
