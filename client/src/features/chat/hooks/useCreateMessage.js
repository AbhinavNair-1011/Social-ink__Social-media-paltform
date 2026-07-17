import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "../api/messageApi";

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMessage,

    onSuccess: (message) => {
      queryClient.setQueryData(
        ["messages", message.conversation],
        (oldMessages = []) => {
          return [...oldMessages, message];
        },
      );
      queryClient.resetQueries({
        queryKey: ["conversations"],
      });

      queryClient.resetQueries({
        queryKey: ["unread-conversation-count"],
      });
    },
  });
}
