import { useQuery } from "@tanstack/react-query";

import {
  getMyConversations,} from "../api/conversationApi";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getMyConversations,
  });
}
