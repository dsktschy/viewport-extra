import { getMetaElementList } from "../lib/Document.js";
import { createPartialMediaSpecificParameters } from "../lib/HTMLMetaElement.js";
import { setMediaSpecificParametersList } from "./setMediaSpecificParametersList.js";

export const activateMediaSpecificAttributes = (): void => {
  if (typeof window === "undefined") return;
  setMediaSpecificParametersList(
    getMetaElementList(document).map(createPartialMediaSpecificParameters),
  );
};
