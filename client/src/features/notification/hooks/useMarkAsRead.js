import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAsRead } from "../api/notificationApi";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,

    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(["notifications"], (oldNotifications = []) =>
        oldNotifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      queryClient.setQueryData(["notification-count"], (oldCount = 0) =>
        Math.max(oldCount - 1, 0),
      );
    },
  });
}
