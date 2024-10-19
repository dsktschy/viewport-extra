import ViewportExtra, { updateReference, setContent } from '@@/dist/es/index.js'

const fitstViewportMetaElement = document.querySelector('meta[name="viewport"]')
if (fitstViewportMetaElement) {
  const secondViewportMetaElement = fitstViewportMetaElement.cloneNode()
  document.head.removeChild(fitstViewportMetaElement)
  document.head.appendChild(secondViewportMetaElement)
  const usingDefaultExport = document
    .querySelector('[data-using-default-export]')
    ?.hasAttribute('data-using-default-export')
  ;(usingDefaultExport ? ViewportExtra.updateReference : updateReference)()
  const content: { minWidth?: number; maxWidth?: number } = {}
  const minWidthAfterUpdateReference = document
    .querySelector('[data-min-width-after-update-reference]')
    ?.getAttribute('data-min-width-after-update-reference')
  if (minWidthAfterUpdateReference)
    content.minWidth = parseFloat(minWidthAfterUpdateReference)
  setContent(content)
}
