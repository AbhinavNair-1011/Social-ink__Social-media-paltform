import { useQuery } from "@tanstack/react-query";
import { getComments } from "../api/commentsApi";

export function useComments(postId) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });
}