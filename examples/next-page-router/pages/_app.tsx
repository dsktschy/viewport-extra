import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import type { FunctionComponent } from "react";
import ViewportExtra from "../components/ViewportExtra";

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Next.js (Page Router) Example</title>
      <meta
        name="description"
        content="This example shows how to use Viewport Extra in Next.js (Page Router) application."
      />
    </Head>
    <Component {...pageProps} />
    <ViewportExtra minimumWidth={430} />
  </>
);

export default App;
