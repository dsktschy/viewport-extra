import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import type { FunctionComponent } from "react";
import ViewportExtra from "../components/ViewportExtra";

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Usage Examples in Next.js (Pages Router) Application</title>
      <meta
        name="description"
        content="This example shows how to use Viewport Extra in a Next.js (Pages Router) application."
      />
    </Head>
    <Component {...pageProps} />
    <ViewportExtra minimumWidth={412} />
  </>
);

export default App;
