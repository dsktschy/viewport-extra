import type * as TViewportExtra from "@@/dist/viewport-extra.d.mts";
import { convertToJsonString } from "@@/tests/e2e/modules/NumberStringRecord.js";

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra;
}

const ViewportExtra = (window as CustomWindow).ViewportExtra;
if (ViewportExtra) {
  document
    .querySelector("[data-get-content-result]")
    ?.setAttribute(
      "data-get-content-result",
      convertToJsonString(ViewportExtra.getContent()),
    );
}
document
  .querySelector("[data-asset-script]")
  ?.setAttribute("data-status", "complete");
