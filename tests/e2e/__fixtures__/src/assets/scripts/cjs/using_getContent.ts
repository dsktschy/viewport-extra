import { getContent } from "@@/dist/cjs/index.js";
import { convertToJsonString } from "@@/tests/e2e/modules/NumberStringRecord.js";

document
  .querySelector("[data-get-content-result]")
  ?.setAttribute("data-get-content-result", convertToJsonString(getContent()));
