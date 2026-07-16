import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "../api/postsApi";

export function useInfiniteUserPosts(userId,type) {
  return useInfiniteQuery({
    queryKey: ["user-posts",userId, type],

    queryFn: ({ pageParam = 1 }) => getUserPosts( pageParam,userId, type),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });
}
