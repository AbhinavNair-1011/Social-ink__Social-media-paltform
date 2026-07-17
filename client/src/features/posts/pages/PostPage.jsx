import { useParams } from "react-router-dom";

import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import { usePost } from "../hooks/usePost";

import PostCard from "../components/PostCard";

function PostPage() {
  const { postId } = useParams();

  const { data: post, isLoading, isError } = usePost(postId);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !post) {
    return (
      <EmptyState
        title="Post not found"
        description="This post doesn't exist or may have been deleted."
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <PostCard
        post={post}
        querykey={["post", postId]}
      />
    </section>
  );
}

export default PostPage;