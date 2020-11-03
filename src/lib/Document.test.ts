import { ensureViewportElement } from './Document'

describe('about src/lib/Document.ts', () => {
  test('whether to append viewport meta element if it is not in document', () => {
    const resultList: boolean[] = []
    const selector = 'meta[name="viewport"]'
    let viewportElement: HTMLMetaElement | null = null
    viewportElement = document.head.querySelector<HTMLMetaElement>(selector)
    resultList[0] = viewportElement === null
    ensureViewportElement(document)
    viewportElement = document.head.querySelector<HTMLMetaElement>(selector)
    resultList[1] = viewportElement !== null
    expect(resultList.every(result => result)).toBe(true)
  })
})
