"use client";

import { usePathname } from "next/navigation";
import { Fragment, type FunctionComponent, useEffect, useRef } from "react";

const ViewportExtra: FunctionComponent<{
  minWidth?: number;
  maxWidth?: number;
}> = ({ minWidth, maxWidth }) => {
  const pathname = usePathname();

  const previousPathname = useRef("");

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname;
      import("viewport-extra").then(({ setContent, updateReference }) => {
        updateReference();
        const content: Parameters<typeof setContent>[0] = {};
        if (typeof minWidth === "number") content.minWidth = minWidth;
        if (typeof maxWidth === "number") content.maxWidth = maxWidth;
        setContent(content);
      });
    }
  }, [pathname, minWidth, maxWidth]);

  return <Fragment />;
};

export default ViewportExtra;
