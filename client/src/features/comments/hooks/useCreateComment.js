import { useMutation } from "@tanstack/react-query";
import { createComment } from "../api/commentsApi";

export function useCreateComment() {
  return useMutation({
    mutationFn: createComment,
  });
}