import type { FunctionComponent } from 'react'
import Link from 'next/link'

const Another: FunctionComponent = () => (
  <>
    <h1>Another Page</h1>
    <p>-------------- 414px wide text --------------</p>
    <Link href="/">Go to index page</Link>
  </>
)

export default Another
