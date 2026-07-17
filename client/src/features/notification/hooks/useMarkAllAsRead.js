import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllAsRead } from "../api/notificationApi";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,

    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (oldNotifications = []) =>
        oldNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      queryClient.setQueryData(["notification-count"], 0);
  
    },
  });
}
