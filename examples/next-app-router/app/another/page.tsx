import Link from "next/link";
import type { FunctionComponent } from "react";

const Another: FunctionComponent = () => (
  <>
    <h1>Another Page</h1>
    <p>-------------- 412px wide text --------------</p>
    <Link href="/">Go to index page</Link>
  </>
);

export default Another;
