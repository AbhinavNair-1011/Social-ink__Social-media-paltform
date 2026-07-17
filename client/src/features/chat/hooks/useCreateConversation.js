import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createConversation } from "../api/conversationApi";

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,

    onSuccess: (conversation) => {
     queryClient.resetQueries(["conversations"])
    },
  });
}