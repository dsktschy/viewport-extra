import { ensureViewportElement } from '../../src/lib/Document'

describe('about src/lib/Document.ts', () => {
  test('`ensureViewportElement` appends viewport meta element if it is not in document', () => {
    const defaultContentMap = {
      width: 'device-width',
      'initial-scale': '1'
    }
    document.head.innerHTML = ''
    ensureViewportElement(document, defaultContentMap)
    const viewportElement = document.head.querySelector<HTMLMetaElement>(
      'meta[name="viewport"]'
    )
    const viewportContentString = viewportElement?.getAttribute('content')
    expect(viewportContentString).toBe('initial-scale=1,width=device-width')
  })
})

describe('about src/lib/Document.ts', () => {
  test('`ensureViewportElement` gets and returns viewport meta element that already exists', () => {
    const defaultContentMap = {
      width: 'device-width',
      'initial-scale': '1'
    }
    document.head.innerHTML = ''
    const expectedViewportContentString =
      'initial-scale=2,invalid=true,width=device-width'
    const createdViewportElement = document.createElement('meta')
    createdViewportElement.setAttribute('name', 'viewport')
    createdViewportElement.setAttribute(
      'content',
      expectedViewportContentString
    )
    document.head.appendChild(createdViewportElement)
    ensureViewportElement(document, defaultContentMap)
    const selectedViewportElement = document.head.querySelector<
      HTMLMetaElement
    >('meta[name="viewport"]')
    const viewportContentString = selectedViewportElement?.getAttribute(
      'content'
    )
    expect(viewportContentString).toBe(expectedViewportContentString)
  })
})
