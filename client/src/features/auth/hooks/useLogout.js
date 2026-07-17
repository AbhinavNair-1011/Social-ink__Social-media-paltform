import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser } from "../api/authApi";
import socket from "../../../app/socket";

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      queryClient.clear();
      socket.disconnect();

      toast.success("Logged out successfully.");

      navigate("/login", {
        replace: true,
      });
    },
  });
}

export default useLogout ;
