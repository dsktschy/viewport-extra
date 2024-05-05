import '../styles/globals.css'
import { useEffect, type FunctionComponent } from 'react'
import type { AppProps } from "next/app";
import Head from 'next/head'
import { setContent, updateReference } from 'viewport-extra'

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    updateReference()
    setContent({ minWidth: 414 })
  }, [])

  return (
    <>
      <Head>
        <title>Next.js (Page Router) Example</title>
        <meta
          name="description"
          content="This example shows how to use Viewport Extra in Next.js (Page Router) application."
        />

        {/* An ineffective element to disable overriding on page transition */}
        {/* Therefore don't set content attribute */}
        <meta name="viewport" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default App
