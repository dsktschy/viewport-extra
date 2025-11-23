import { usePathname } from "next/navigation";
import { Fragment, type FunctionComponent, useEffect, useRef } from "react";

const ViewportExtra: FunctionComponent<{
  minimumWidth?: number;
  maximumWidth?: number;
}> = ({ minimumWidth, maximumWidth }) => {
  const pathname = usePathname();

  const previousPathname = useRef("");

  useEffect(() => {
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

  return <Fragment />;
};

export default ViewportExtra;
