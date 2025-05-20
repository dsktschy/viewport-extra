import { usePathname } from "next/navigation";
import { type FunctionComponent, useEffect, useRef } from "react";

const ViewportExtra: FunctionComponent<{
  minWidth?: number;
  maxWidth?: number;
}> = ({ minWidth, maxWidth }) => {
  const pathname = usePathname();

  const previousPathname = useRef("");

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname;
      import("viewport-extra").then(({ apply }) => {
        const content: Parameters<typeof apply>[0][number]["content"] = {};
        if (typeof minWidth === "number") content.minWidth = minWidth;
        if (typeof maxWidth === "number") content.maxWidth = maxWidth;
        apply([{ content }]);
      });
    }
  }, [pathname, minWidth, maxWidth]);

  return <></>;
};

export default ViewportExtra;
