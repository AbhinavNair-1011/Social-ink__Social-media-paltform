import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser } from "../api/authApi";

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      queryClient.clear();

      toast.success("Logged out successfully.");

      navigate("/login", {
        replace: true,
      });
    },
  });
}

export { useLogout };
