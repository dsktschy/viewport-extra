import { ensureViewportElement } from './Document'

describe('about src/lib/Document.ts', () => {
  test('`ensureViewportElement` appends viewport meta element if it is not in document', () => {
    ensureViewportElement(document)
    const viewportElement = document.head.querySelector<HTMLMetaElement>(
      'meta[name="viewport"]'
    )
    expect(viewportElement).not.toBeNull()
  })
})
