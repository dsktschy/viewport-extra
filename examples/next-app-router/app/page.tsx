import type { FunctionComponent } from 'react'
import Link from 'next/link'

const Index: FunctionComponent = () => (
  <>
    <h1>Index Page</h1>
    <p>-------------- 412px wide text --------------</p>
    <Link href="/another">Go to another page</Link>
  </>
)

export default Index
