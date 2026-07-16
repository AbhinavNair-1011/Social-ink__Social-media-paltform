import { useEffect, useRef, useState } from "react";

import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import { useInfiniteUserPosts } from "../../posts/hooks/useInfiniteUserPosts";

import ProfilePostCard from "./ProfilePostCard";
import toast from "react-hot-toast";

function UserPosts({ userId }) {
  const [view, setView] = useState("images");

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteUserPosts(userId, view);
  const posts = data?.pages.flatMap((page) => page.posts) || [];

  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        observer.unobserve(entry.target);
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [posts.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isLoading && view === "images" && posts.length === 0) {
      toast.error("No image posts");
      setView("text");
    }
  }, [isLoading, posts.length, view]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load posts"
        description="Please try again."
      />
    );
  }

  return (
    <section className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Posts</h2>

        <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setView("text")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              view === "text"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Text
          </button>

          <button
            onClick={() => setView("images")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              view === "images"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Photos
          </button>
        </div>
      </div>

      <div
        className={
          view === "images"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
         {posts?.length===0 && <EmptyState title={`0 posts`} description={`No posts in ${view} yet`}/>}
        {posts.map((post) => (
          <ProfilePostCard
            key={post._id}
            post={post}
            querykey={["user-posts", userId, view]}
          />
        ))}
      </div>

      {hasNextPage && <div ref={loadMoreRef} />}

      {isFetchingNextPage && <Loader />}
    </section>
  );
}

export default UserPosts;
