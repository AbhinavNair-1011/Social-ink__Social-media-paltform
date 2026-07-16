import { useMutation } from "@tanstack/react-query";

import { unlikePost } from "../api/postsApi";

export function useUnlikePost() {
  return useMutation({
    mutationFn: unlikePost,
  });
}