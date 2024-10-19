import ViewportExtra, { setContent } from '@@/dist/cjs/index.js'

const content: { minWidth?: number; maxWidth?: number; initialScale?: number } =
  {}
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
const usingDefaultExport = document
  .querySelector('[data-using-default-export]')
  ?.hasAttribute('data-using-default-export')
;(usingDefaultExport ? ViewportExtra.setContent : setContent)(content)
