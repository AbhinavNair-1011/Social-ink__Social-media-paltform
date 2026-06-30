import Loader from "../../../shared/components/Loader";

import { useFeed } from "../hooks/useFeed";

import PostCard from "./PostCard";
import EmptyState from "../../../shared/components/EmptyState";
import PostSkeleton from "./PostLoader";
import PostLoader from "./PostLoader";

function PostList({page}) {
  const { data, isLoading } = useFeed(page);

  const posts = data?.posts || [];

  if (isLoading) {
    return (
      <>
        <PostLoader />
        <PostLoader />
        <PostLoader />
      </>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="Create the first post and start the conversation."
      />
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} page={page} />
      ))}
    </div>
  );
}

export default PostList;
