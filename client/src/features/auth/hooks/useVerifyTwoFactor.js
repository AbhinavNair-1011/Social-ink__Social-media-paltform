import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { verifyTwoFactor } from "../api/authApi";

function useVerifyTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyTwoFactor,

    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);

      toast.success("Login successful.");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.error?.message || "Verification failed.",
      );
    },
  });
}

export { useVerifyTwoFactor };
