import { useQuery } from "@tanstack/react-query";
import { getFeed } from "../api/postsApi";

export function useFeed(page) {
  return useQuery({
    queryKey: ["feed", page],

    queryFn: () => getFeed(page),

    placeholderData: (previousData) => previousData,
  });
}