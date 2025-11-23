import { getMetaElementList } from "../internal/Document.js";
import { createPartialMediaSpecificParameters } from "../internal/HTMLMetaElement.js";
import { setMediaSpecificParametersList } from "./setMediaSpecificParametersList.js";

export const activateMediaSpecificAttributes = (): void => {
  if (typeof window === "undefined") return;
  setMediaSpecificParametersList(
    getMetaElementList(document).map(createPartialMediaSpecificParameters),
  );
};
