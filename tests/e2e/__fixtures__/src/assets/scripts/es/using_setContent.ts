import ViewportExtra, { setContent } from '@@/dist/es/index.js'

const contentAttribute = document
  .querySelector('[data-content]')
  ?.getAttribute('data-content')
if (typeof contentAttribute === 'string') {
  const usingDefaultExport = document
    .querySelector('[data-using-default-export]')
    ?.hasAttribute('data-using-default-export')
  ;(usingDefaultExport ? ViewportExtra.setContent : setContent)(
    JSON.parse(contentAttribute) as Parameters<typeof setContent>[0]
  )
}
