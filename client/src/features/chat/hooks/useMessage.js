import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../api/messageApi";

export function useMessages(conversationId) {
  return useQuery({
    queryKey: ["messages", conversationId],

    queryFn: () =>
      getMessages(conversationId, {
        onsuccess: (data) => {
          queryClient.resetQueries({
            queryKey: ["conversations"],
          });
          queryClient.resetQueries({
            queryKey: ["unread-conversation-count"],
          });
        },
      }),

    enabled: !!conversationId,
  });
}
