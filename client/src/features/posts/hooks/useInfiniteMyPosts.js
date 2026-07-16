import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyPosts } from "../api/postsApi";

export function useInfiniteMyPosts(type) {
  return useInfiniteQuery({
    queryKey: ["my-posts", type],

    queryFn: ({ pageParam = 1 }) =>
      getMyPosts(pageParam, type),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });
}