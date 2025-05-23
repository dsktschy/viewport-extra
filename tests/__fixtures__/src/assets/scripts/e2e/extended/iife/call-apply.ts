import type * as TViewportExtra from "@@/dist/extended/viewport-extra.d.mts";

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra;
}
type ApplyParameters = Parameters<typeof TViewportExtra.apply>;

const ViewportExtra = (window as CustomWindow).ViewportExtra;
if (ViewportExtra) {
  const mediaSpecificParametersListAttribute = document
    .querySelector("[data-media-specific-parameters-list]")
    ?.getAttribute("data-media-specific-parameters-list");
  if (typeof mediaSpecificParametersListAttribute === "string") {
    const argumentList: ApplyParameters = [
      JSON.parse(mediaSpecificParametersListAttribute) as ApplyParameters[0],
    ];
    const globalParametersAttribute = document
      .querySelector("[data-global-parameters]")
      ?.getAttribute("data-global-parameters");
    if (typeof globalParametersAttribute === "string")
      argumentList.push(
        JSON.parse(globalParametersAttribute) as ApplyParameters[1],
      );
    ViewportExtra.apply(...argumentList);
  }
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
