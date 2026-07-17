import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAsRead } from "../api/notificationApi";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead
})
}
