import Link from "next/link";
import type { FunctionComponent } from "react";

const Index: FunctionComponent = () => (
  <div className="page">
    <h1>Index Page</h1>
    <p>-------------- 412px wide text --------------</p>
    <Link href="/another">Go to another page</Link>
  </div>
);

export default Index;
