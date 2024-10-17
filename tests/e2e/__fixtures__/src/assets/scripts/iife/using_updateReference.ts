import type TViewportExtra from '@@/types/index.d.ts'

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra
}

const ViewportExtra = (window as CustomWindow).ViewportExtra
if (typeof ViewportExtra === 'function') {
  const fitstViewportMetaElement = document.querySelector(
    'meta[name="viewport"]'
  )
  if (fitstViewportMetaElement) {
    const secondViewportMetaElement = fitstViewportMetaElement.cloneNode()
    document.head.removeChild(fitstViewportMetaElement)
    document.head.appendChild(secondViewportMetaElement)
    ViewportExtra.updateReference()
    const content: { minWidth?: number; maxWidth?: number } = {}
    const minWidthAfterUpdateReference = document
      .querySelector('[data-min-width-after-update-reference]')
      ?.getAttribute('data-min-width-after-update-reference')
    if (minWidthAfterUpdateReference)
      content.minWidth = parseFloat(minWidthAfterUpdateReference)
    ViewportExtra.setContent(content)
  }
}
