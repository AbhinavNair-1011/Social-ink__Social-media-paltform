import { useState } from "react";

import CreatePostForm from "../components/CreatePostForm";
import PostList from "../components/PostList";
import Pagination from "../components/Pagination";


function FeedPage() {

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5   lg:px-0">
      <CreatePostForm />

      <PostList />

    </section>
  );
}

export default FeedPage;
