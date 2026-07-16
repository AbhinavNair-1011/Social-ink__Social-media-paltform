import { Suspense } from "react";

import Loader from "../components/Loader";

function LazyPage({ children }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

export default LazyPage;
