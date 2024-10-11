import type TViewportExtra from '@@/types/index.d.ts'

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra
}

const ViewportExtra = (window as CustomWindow).ViewportExtra
if (typeof ViewportExtra === 'function') {
  const content: { minWidth?: number; maxWidth?: number } = {}
  const minWidth = document
    .querySelector('[data-min-width]')
    ?.getAttribute('data-min-width')
  const maxWidth = document
    .querySelector('[data-max-width]')
    ?.getAttribute('data-max-width')
  if (minWidth) content.minWidth = parseInt(minWidth, 10)
  if (maxWidth) content.maxWidth = parseInt(maxWidth, 10)
  const usingNumberArgument = document
    .querySelector('[data-using-number-argument]')
    ?.hasAttribute('data-using-number-argument')
  if (usingNumberArgument) {
    if (typeof content.minWidth === 'number')
      new ViewportExtra(content.minWidth)
  } else {
    new ViewportExtra(content)
  }
}
