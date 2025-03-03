import { setContent } from "@@/dist/viewport-extra.cjs";

const contentAttribute = document
  .querySelector("[data-content]")
  ?.getAttribute("data-content");
if (typeof contentAttribute === "string") {
  setContent(JSON.parse(contentAttribute) as Parameters<typeof setContent>[0]);
}
