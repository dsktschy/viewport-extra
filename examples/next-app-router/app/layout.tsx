import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import type { FunctionComponent, ReactNode } from "react";
import ViewportExtra from "../components/ViewportExtra";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Usage Examples in Next.js (App Router) Application",
  description:
    "This example shows how to use Viewport Extra in a Next.js (App Router) application.",
};

const RootLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <body className={openSans.className}>
      <div className="page">{children}</div>
      <ViewportExtra minimumWidth={412} />
    </body>
  </html>
);

export default RootLayout;
