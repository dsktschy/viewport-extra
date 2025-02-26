import type TViewportExtra from '@@/types/index.d.ts'

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra
}

const ViewportExtra = (window as CustomWindow).ViewportExtra
if (typeof ViewportExtra === 'function') {
  const mediaSpecificParametersListAttribute = document
    .querySelector('[data-media-specific-parameters-list]')
    ?.getAttribute('data-media-specific-parameters-list')
  if (typeof mediaSpecificParametersListAttribute === 'string') {
    const argumentList: Parameters<typeof ViewportExtra.setParameters> = [
      JSON.parse(mediaSpecificParametersListAttribute) as Parameters<
        typeof ViewportExtra.setParameters
      >[0]
    ]
    ViewportExtra.setParameters(...argumentList)
  }
}
