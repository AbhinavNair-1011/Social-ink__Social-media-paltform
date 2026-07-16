import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../api/postsApi";

export function useLikePost(page) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,

})
}

export default useLikePost;
