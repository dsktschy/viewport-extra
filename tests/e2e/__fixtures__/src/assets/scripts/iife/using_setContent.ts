import type TViewportExtra from '@@/types/index.d.ts'

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra
}

const ViewportExtra = (window as CustomWindow).ViewportExtra
if (typeof ViewportExtra === 'function') {
  const content: {
    minWidth?: number
    maxWidth?: number
    initialScale?: number
  } = {}
  const minWidth = document
    .querySelector('[data-min-width]')
    ?.getAttribute('data-min-width')
  const maxWidth = document
    .querySelector('[data-max-width]')
    ?.getAttribute('data-max-width')
  const initialScale = document
    .querySelector('[data-initial-scale]')
    ?.getAttribute('data-initial-scale')
  if (minWidth) content.minWidth = parseFloat(minWidth)
  if (maxWidth) content.maxWidth = parseFloat(maxWidth)
  if (initialScale) content.initialScale = parseFloat(initialScale)
  ViewportExtra.setContent(content)
}
