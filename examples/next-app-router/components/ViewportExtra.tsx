"use client";

import { usePathname } from "next/navigation";
import { type FunctionComponent, useLayoutEffect, useRef } from "react";

const ViewportExtra: FunctionComponent<{
  minimumWidth?: number;
  maximumWidth?: number;
}> = ({ minimumWidth, maximumWidth }) => {
  const pathname = usePathname();

  const previousPathname = useRef("");

  useLayoutEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname;
      import("viewport-extra").then(({ apply }) => {
        const content: Parameters<typeof apply>[0][number]["content"] = {};
        if (typeof minimumWidth === "number")
          content.minimumWidth = minimumWidth;
        if (typeof maximumWidth === "number")
          content.maximumWidth = maximumWidth;
        apply([{ content }]);
      });
    }
  }, [pathname, minimumWidth, maximumWidth]);

  return <></>;
};

export default ViewportExtra;
