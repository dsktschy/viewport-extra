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

export const getViewportExtraMetaElementList = (
  doc: Document,
): HTMLMetaElement[] => {
  const arrayFrom = <T>(arrayLike: ArrayLike<T>): T[] =>
    (Array.prototype as T[]).slice.call(arrayLike);
  return arrayFrom(
    doc.querySelectorAll<HTMLMetaElement>('meta[name="viewport-extra"]'),
  );
};

export const getDocumentClientWidth = (doc: Document): number =>
  doc.documentElement.clientWidth;
