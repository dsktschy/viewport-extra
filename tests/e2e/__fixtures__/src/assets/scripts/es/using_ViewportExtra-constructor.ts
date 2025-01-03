import ViewportExtra from '@@/dist/es/index.js'

const usingNumberArgument = document
  .querySelector('[data-using-number-argument]')
  ?.hasAttribute('data-using-number-argument')
if (usingNumberArgument) {
  const minWidthAttribute = document
    .querySelector('[data-min-width]')
    ?.getAttribute('data-min-width')
  if (typeof minWidthAttribute === 'string')
    new ViewportExtra(Number(minWidthAttribute))
} else {
  const contentAttribute = document
    .querySelector('[data-content]')
    ?.getAttribute('data-content')
  if (typeof contentAttribute === 'string')
    new ViewportExtra(
      JSON.parse(contentAttribute) as Parameters<
        typeof ViewportExtra.setContent
      >[0]
    )
}
