import type TViewportExtra from "@@/types/index.d.ts";

interface CustomWindow extends Window {
  ViewportExtra?: typeof TViewportExtra;
}

const ViewportExtra = (window as CustomWindow).ViewportExtra;
if (ViewportExtra) {
  const firstViewportMetaElement = document.querySelector(
    'meta[name="viewport"]',
  );
  if (firstViewportMetaElement) {
    const secondViewportMetaElement = firstViewportMetaElement.cloneNode();
    document.head.removeChild(firstViewportMetaElement);
    document.head.appendChild(secondViewportMetaElement);
    ViewportExtra.updateReference();
    const contentAfterUpdateReferenceAttribute = document
      .querySelector("[data-content-after-update-reference]")
      ?.getAttribute("data-content-after-update-reference");
    if (typeof contentAfterUpdateReferenceAttribute === "string")
      ViewportExtra.setContent(
        JSON.parse(contentAfterUpdateReferenceAttribute) as Parameters<
          typeof ViewportExtra.setContent
        >[0],
      );
  }
}
