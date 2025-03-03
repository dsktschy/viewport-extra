import { getContent } from "@@/dist/viewport-extra.cjs";
import { convertToJsonString } from "@@/tests/e2e/modules/NumberStringRecord.js";

document
  .querySelector("[data-get-content-result]")
  ?.setAttribute("data-get-content-result", convertToJsonString(getContent()));
