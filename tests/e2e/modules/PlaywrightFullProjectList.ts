import type { FullProject, ViewportSize } from '@playwright/test'

type FullProjectList = FullProject[]

export const getViewportSize = (
  fullProjectList: FullProjectList,
  projectName: string
) => fullProjectList.find(({ name }) => name === projectName)

export const getMaximumWidthViewportSize = (fullProjectList: FullProjectList) =>
  fullProjectList.reduce<ViewportSize>(
    (result, fullProject) => {
      const viewportSize = fullProject.use.viewport ?? { width: 0, height: 0 }
      return viewportSize.width > result.width ? viewportSize : result
    },
    { width: 0, height: 0 }
  )
