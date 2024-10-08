import ViewportExtra, { getContent } from '@@/dist/cjs/index.js'
import { convertToJsonString } from '@@/tests/e2e/modules/SeriarizableRecord.js'

const usingDefaultExport = document
  .querySelector('[data-using-default-export]')
  ?.hasAttribute('data-using-default-export')
document
  .querySelector('[data-get-content-result]')
  ?.setAttribute(
    'data-get-content-result',
    convertToJsonString(
      (usingDefaultExport ? ViewportExtra.getContent : getContent)()
    )
  )
