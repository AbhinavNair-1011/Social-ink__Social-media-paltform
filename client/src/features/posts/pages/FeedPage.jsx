import { useState } from "react";

import CreatePostForm from "../components/CreatePostForm";
import PostList from "../components/PostList";
import Pagination from "../components/Pagination";

import { useFeed } from "../hooks/useFeed";

function FeedPage() {
  const [page, setPage] = useState(1);

  const { data } = useFeed(page);

  return (
    <section className="mx-auto max-w-2xl">
      <CreatePostForm />

      <PostList page={page} />

      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}

export default FeedPage;