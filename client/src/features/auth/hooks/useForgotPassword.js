import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { forgotPassword } from "../api/authApi";

function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success("Verification code sent to your email.");
    },
  });
}

export { useForgotPassword };
