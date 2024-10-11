import type {
  Expect as PlaywrightExpect,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestInfo
} from '@playwright/test'

type ViewportExtraContent = {
  width: number | 'device-width'
  initialScale: number
  minWidth: number
  maxWidth: number
  [key: string]: string | number
}

type ThresholdProject = { name: string; offset?: number }

type TestParameters = {
  initialViewportContent: Pick<ViewportExtraContent, 'width' | 'initialScale'>
  thresholdProjects: {
    minWidth?: ThresholdProject
    maxWidth?: ThresholdProject
  }
  html: {
    meta: (viewportExtraContent: ViewportExtraContent) => string
    libraryScript?: string
    parametersScript?: (viewportExtraContent: ViewportExtraContent) => string
    assetScript?: string
  }
  actualValueProvider: (page: TestArgs['page']) => Promise<unknown>
  expectedValueProvider: (
    viewport: NonNullable<TestArgs['viewport']>,
    viewportExtraContent: ViewportExtraContent
  ) => unknown
}

type TestArgs = PlaywrightTestArgs &
  PlaywrightTestOptions &
  PlaywrightWorkerArgs &
  PlaywrightWorkerOptions

export const createTestBody =
  (
    expect: PlaywrightExpect,
    {
      initialViewportContent,
      thresholdProjects,
      html,
      actualValueProvider,
      expectedValueProvider
    }: TestParameters
  ) =>
  async ({ page, viewport }: TestArgs, { config: { projects } }: TestInfo) => {
    if (!viewport) throw new Error('Viewport width is not set')
    const preOffsetMinWidth = projects.find(
      ({ name }) => name === thresholdProjects.minWidth?.name
    )?.use.viewport?.width
    const preOffsetMaxWidth = projects.find(
      ({ name }) => name === thresholdProjects.maxWidth?.name
    )?.use.viewport?.width
    const minWidth = preOffsetMinWidth
      ? preOffsetMinWidth + (thresholdProjects.minWidth?.offset ?? 0)
      : 0
    const maxWidth = preOffsetMaxWidth
      ? preOffsetMaxWidth + (thresholdProjects.maxWidth?.offset ?? 0)
      : Infinity
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Document</title>
          ${html.meta({ ...initialViewportContent, minWidth, maxWidth })}
          ${html.libraryScript ?? ''}
        </head>
        <body>
          ${html.parametersScript ? html.parametersScript({ ...initialViewportContent, minWidth, maxWidth }) : ''}
          ${html.assetScript ?? ''}
          <script data-get-content-result></script>
        </body>
      </html>
    `)
    expect(await actualValueProvider(page)).toStrictEqual(
      expectedValueProvider(viewport, {
        ...initialViewportContent,
        minWidth,
        maxWidth
      })
    )
  }
