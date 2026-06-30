import { useMutation } from "@tanstack/react-query";
import { updateComment } from "../api/commentsApi";

export function useUpdateComment() {
  return useMutation({
    mutationFn: updateComment,
  });
}