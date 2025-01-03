import type TViewportExtra from '@@/types/index.d.ts'

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra
}

const ViewportExtra = (window as CustomWindow).ViewportExtra
if (typeof ViewportExtra === 'function') {
  const contentAttribute = document
    .querySelector('[data-content]')
    ?.getAttribute('data-content')
  if (typeof contentAttribute === 'string')
    ViewportExtra.setContent(
      JSON.parse(contentAttribute) as Parameters<
        typeof ViewportExtra.setContent
      >[0]
    )
}
