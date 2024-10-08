import ViewportExtra, { setContent } from '@@/dist/es/index.js'

const content: { minWidth?: number; maxWidth?: number } = {}
const minWidth = document
  .querySelector('[data-min-width]')
  ?.getAttribute('data-min-width')
const maxWidth = document
  .querySelector('[data-max-width]')
  ?.getAttribute('data-max-width')
if (minWidth) content.minWidth = parseInt(minWidth, 10)
if (maxWidth) content.maxWidth = parseInt(maxWidth, 10)
const usingDefaultExport = document
  .querySelector('[data-using-default-export]')
  ?.hasAttribute('data-using-default-export')
;(usingDefaultExport ? ViewportExtra.setContent : setContent)(content)
