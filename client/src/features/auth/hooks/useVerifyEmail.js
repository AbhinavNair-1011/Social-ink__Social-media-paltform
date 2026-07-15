import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { verifyEmail } from "../api/authApi";

function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,

    onSuccess: () => {
      toast.success("Email verified successfully.");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.error?.message || "Verification failed.",
      );
    },
  });
}

export { useVerifyEmail };
