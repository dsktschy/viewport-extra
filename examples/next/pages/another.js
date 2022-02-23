import Link from 'next/link'

export default function Another() {
  return (
    <div className="page">
      <h1>Another Page</h1>
      <p>-------------- 414px wide text --------------</p>
      <Link href="/">
        <a>Go to index page</a>
      </Link>
    </div>
  )
}
