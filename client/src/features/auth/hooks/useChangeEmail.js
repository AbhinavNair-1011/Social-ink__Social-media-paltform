import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { changeEmail } from "../api/authApi";

function useChangeEmail() {
  return useMutation({
    mutationFn: changeEmail,

    onSuccess: () => {
      toast.success("Verification code sent to your new email.");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.error?.message || "Unable to change email.",
      );
    },
  });
}

export { useChangeEmail };
