import type { FullProject } from "@playwright/test";

type FullProjectList = FullProject[];

export const getViewportSize = (
  fullProjectList: FullProjectList,
  projectName: string,
) => fullProjectList.find(({ name }) => name === projectName);
