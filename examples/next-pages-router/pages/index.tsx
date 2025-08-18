import type { FunctionComponent } from 'react'
import Link from 'next/link'

const Index: FunctionComponent = () => (
  <div className="page">
    <h1>Index Page</h1>
    <p>-------------- 412px wide text --------------</p>
    <Link href="/another">Go to another page</Link>
  </div>
)

export default Index
