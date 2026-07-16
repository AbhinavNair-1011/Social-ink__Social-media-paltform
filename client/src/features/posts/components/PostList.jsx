import Loader from "../../../shared/components/Loader";

import { useInfiniteFeed } from "../hooks/useInfiniteFeed";
import { useEffect, useRef } from "react";
import PostCard from "./PostCard";
import EmptyState from "../../../shared/components/EmptyState";
import PostSkeleton from "./PostLoader";
import PostLoader from "./PostLoader";

function PostList() {
  
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =  useInfiniteFeed();
  const loadMoreRef = useRef(null);
  const pages = data?.pages || [];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (isLoading) {
    return (
      <>
        <PostLoader />
        <PostLoader />
        <PostLoader />
      </>
    );
  }

  if (pages.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="Create the first post and start the conversation."
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {pages.map((page) =>
          page.posts.map((post) => <PostCard key={post._id} post={post} />),
        )}
      </div>
      <div ref={loadMoreRef} />
      {isFetchingNextPage && <Loader />}
    </>
  );
}

export default PostList;
