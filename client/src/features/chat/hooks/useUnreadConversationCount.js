import { useQuery } from "@tanstack/react-query";

import {
  getUnreadConversationCount,
} from "../api/conversationApi";

export function useUnreadConversationCount() {
  return useQuery({
    queryKey: ["unread-conversation-count"],
    queryFn: getUnreadConversationCount,
    refetchOnWindowFocus: true,
  });
}
