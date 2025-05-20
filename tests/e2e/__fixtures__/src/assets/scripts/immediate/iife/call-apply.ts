import type * as TViewportExtra from "@@/dist/immediate/viewport-extra.d.mts";

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra;
}
type ApplyParameters = Parameters<typeof TViewportExtra.apply>;

const ViewportExtra = (window as CustomWindow).ViewportExtra;
if (ViewportExtra) {
  const mediaSpecificParametersListAttribute = document
    .querySelector("[data-media-specific-parameters-list]")
    ?.getAttribute("data-media-specific-parameters-list");
  if (typeof mediaSpecificParametersListAttribute === "string")
    ViewportExtra.apply(
      JSON.parse(mediaSpecificParametersListAttribute) as ApplyParameters[0],
    );
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
