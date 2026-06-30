import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../api/commentsApi";

export function useDeleteComment() {
  return useMutation({
    mutationFn: deleteComment,
  });
}