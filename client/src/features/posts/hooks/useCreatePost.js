import { useMutation } from "@tanstack/react-query";
import { createPost } from "../api/postsApi";

export function useCreatePost() {
  return useMutation({
    mutationFn: createPost,
  });
}