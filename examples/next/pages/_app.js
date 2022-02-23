import '../styles/globals.css'
import { useEffect } from 'react'
import Head from 'next/head'
import { setContent, updateReference } from 'viewport-extra'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    updateReference()
    setContent({ minWidth: 414 })
  }, [])

  return (
    <>
      <Head>
        {/* An ineffective element to disable overriding on page transition */}
        {/* Therefore don't set content attribute */}
        <meta name="viewport" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
