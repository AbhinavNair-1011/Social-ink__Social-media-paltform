import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllAsRead } from "../api/notificationApi";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,

  });
}
