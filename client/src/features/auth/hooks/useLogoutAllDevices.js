import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { logoutAllDevices } from "../api/authApi";

function useLogoutAllDevices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAllDevices,

    onSuccess: () => {
      queryClient.clear();

      toast.success("Logged out from all devices");
    },
  });
}

export { useLogoutAllDevices };
