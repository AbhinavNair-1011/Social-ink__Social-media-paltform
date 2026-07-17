import { useQuery } from "@tanstack/react-query";

import { getPost } from "../api/postsApi";

export function usePost(postId) {
  return useQuery({
    queryKey: ["post", postId],

    queryFn: () => getPost(postId),
  });
}
