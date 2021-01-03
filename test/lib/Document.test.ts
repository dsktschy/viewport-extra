import { getHTMLMetaElement } from '../../src/lib/Document'

describe('about src/lib/Document.ts', () => {
  test("whether `getHTMLMetaElement` returns correct HTMLMetaElement with document has viewport meta element and following params. `'viewport'`, `true`", () => {
    document.head.innerHTML = ''
    const nameAttributeValue = 'viewport'
    const appendedHTMLMetaElement = document.createElement('meta')
    appendedHTMLMetaElement.setAttribute('name', nameAttributeValue)
    document.head.appendChild(appendedHTMLMetaElement)
    const gottenHTMLMetaElement = getHTMLMetaElement(
      document,
      nameAttributeValue,
      true
    )
    expect(gottenHTMLMetaElement).toBe(appendedHTMLMetaElement)
  })

  test("whether `getHTMLMetaElement` returns correct HTMLMetaElement with document has no viewport meta element and following params. `'viewport'`, `true`", () => {
    document.head.innerHTML = ''
    const nameAttributeValue = 'viewport'
    const gottenHTMLMetaElement = getHTMLMetaElement(
      document,
      nameAttributeValue,
      true
    )
    const selectedHTMLMetaElement = document.head.querySelector(
      `meta[name="${nameAttributeValue}"]`
    )
    expect(selectedHTMLMetaElement).toBe(gottenHTMLMetaElement)
  })

  test("whether `getHTMLMetaElement` returns correct HTMLMetaElement with document has viewport meta element and following params. `'viewport'`, `false`", () => {
    document.head.innerHTML = ''
    const nameAttributeValue = 'viewport'
    const appendedHTMLMetaElement = document.createElement('meta')
    appendedHTMLMetaElement.setAttribute('name', nameAttributeValue)
    document.head.appendChild(appendedHTMLMetaElement)
    const gottenHTMLMetaElement = getHTMLMetaElement(
      document,
      nameAttributeValue,
      false
    )
    expect(gottenHTMLMetaElement).toBe(appendedHTMLMetaElement)
  })

  test("whether `getHTMLMetaElement` returns correct HTMLMetaElement with document has no viewport meta element and following params. `'viewport'`, `false`", () => {
    document.head.innerHTML = ''
    const nameAttributeValue = 'viewport'
    getHTMLMetaElement(document, nameAttributeValue, false)
    const selectedHTMLMetaElement = document.head.querySelector(
      `meta[name="${nameAttributeValue}"]`
    )
    expect(selectedHTMLMetaElement).toBe(null)
  })
})
