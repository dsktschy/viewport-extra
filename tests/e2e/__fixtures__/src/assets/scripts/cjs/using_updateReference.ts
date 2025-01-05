import ViewportExtra, {
  setContent,
  updateReference
} from '@@/dist/cjs/index.js'

const fitstViewportMetaElement = document.querySelector('meta[name="viewport"]')
if (fitstViewportMetaElement) {
  const secondViewportMetaElement = fitstViewportMetaElement.cloneNode()
  document.head.removeChild(fitstViewportMetaElement)
  document.head.appendChild(secondViewportMetaElement)
  const usingDefaultExport = document
    .querySelector('[data-using-default-export]')
    ?.hasAttribute('data-using-default-export')
  ;(usingDefaultExport ? ViewportExtra.updateReference : updateReference)()
  const contentAfterUpdateReferenceAttribute = document
    .querySelector('[data-content-after-update-reference]')
    ?.getAttribute('data-content-after-update-reference')
  if (typeof contentAfterUpdateReferenceAttribute === 'string')
    setContent(
      JSON.parse(contentAfterUpdateReferenceAttribute) as Parameters<
        typeof setContent
      >[0]
    )
}
