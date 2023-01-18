import Link from 'next/link'

export default function Index() {
  return (
    <div className="page">
      <h1>Index Page</h1>
      <p>-------------- 414px wide text --------------</p>
      <Link href="/another">Go to another page</Link>
    </div>
  )
}
