import type * as TViewportExtra from "@@/dist/viewport-extra.d.mts";

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra;
}

const ViewportExtra = (window as CustomWindow).ViewportExtra;
if (ViewportExtra) {
  const contentAttribute = document
    .querySelector("[data-content]")
    ?.getAttribute("data-content");
  if (typeof contentAttribute === "string")
    ViewportExtra.setContent(
      JSON.parse(contentAttribute) as Parameters<
        typeof ViewportExtra.setContent
      >[0],
    );
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
