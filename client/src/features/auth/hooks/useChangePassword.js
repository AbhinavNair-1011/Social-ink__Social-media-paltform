import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { changePassword } from "../api/authApi";

function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      toast.success("Password changed successfully");
    },
  });
}

export { useChangePassword };
