import { useInfiniteQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/notificationApi";

export function useInfiniteNotifications() {
  return useInfiniteQuery({
    queryKey: ["notifications"],

    queryFn: ({ pageParam = 1 }) => getNotifications(pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (
        lastPage.currentPage <
        lastPage.totalPages
      ) {
        return lastPage.currentPage + 1;
      }

      return undefined;
    },
  });
}