import { useQuery } from "@tanstack/react-query";

import { getUnreadCount } from "../api/notificationApi";

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notification-count"],

    queryFn: getUnreadCount,
  });
}