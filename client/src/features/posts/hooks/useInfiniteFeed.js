import { useInfiniteQuery } from "@tanstack/react-query";

import { getFeed } from "../api/postsApi";

export function useInfiniteFeed() {
  return useInfiniteQuery({
    queryKey: ["feed"],

    queryFn: ({ pageParam = 1 }) => getFeed(pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }

      return undefined;
    },
  });
}