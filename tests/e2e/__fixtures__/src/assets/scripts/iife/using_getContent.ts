import { convertToJsonString } from '@@/tests/e2e/modules/NumberStringRecord.js'
import type TViewportExtra from '@@/types/index.d.ts'

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra
}

const ViewportExtra = (window as CustomWindow).ViewportExtra
if (typeof ViewportExtra === 'function') {
  document
    .querySelector('[data-get-content-result]')
    ?.setAttribute(
      'data-get-content-result',
      convertToJsonString(ViewportExtra.getContent())
    )
}
