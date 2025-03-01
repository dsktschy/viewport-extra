import { setContent } from "@@/dist/esm/index.js";

const contentAttribute = document
  .querySelector("[data-content]")
  ?.getAttribute("data-content");
if (typeof contentAttribute === "string") {
  setContent(JSON.parse(contentAttribute) as Parameters<typeof setContent>[0]);
}
