import Link from "next/link";
import type { FunctionComponent } from "react";

const Index: FunctionComponent = () => (
  <>
    <h1>Index Page</h1>
    <p>--------------- 430px wide text ---------------</p>
    <Link href="/another">Go to another page</Link>
  </>
);

export default Index;
