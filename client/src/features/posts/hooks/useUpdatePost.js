import { useMutation } from "@tanstack/react-query";
import { updatePost } from "../api/postsApi";

export function useUpdatePost() {
  return useMutation({
    mutationFn: ({ postId, postData }) =>
      updatePost(postId, postData),
  });
}