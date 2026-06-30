import { useMutation } from "@tanstack/react-query";
import { deletePost } from "../api/postsApi";

export function useDeletePost() {
  return useMutation({
    mutationFn: deletePost,
  });
}