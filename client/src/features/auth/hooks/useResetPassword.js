import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { resetPassword } from "../api/authApi";

function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,

    onSuccess: () => {
      toast.success("Password reset successfully");
    },
  });
}

export { useResetPassword };
