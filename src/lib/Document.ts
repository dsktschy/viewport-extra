import { arrayFrom } from "./ArrayLike.js";

export const ensureViewportMetaElement = (doc: Document): HTMLMetaElement => {
  const viewportMetaElement = doc.querySelector<HTMLMetaElement>(
    'meta[name="viewport"]',
  );
  if (viewportMetaElement) return viewportMetaElement;
  const htmlMetaElement = doc.createElement("meta");
  htmlMetaElement.setAttribute("name", "viewport");
  doc.head.appendChild(htmlMetaElement);
  return htmlMetaElement;
};

export const getMetaElementList = (doc: Document): HTMLMetaElement[] =>
  arrayFrom(
    doc.querySelectorAll<HTMLMetaElement>(
      'meta[name="viewport"],meta[name="viewport-extra"]',
    ),
  );

export const getDocumentClientWidth = (doc: Document): number =>
  doc.documentElement.clientWidth;
