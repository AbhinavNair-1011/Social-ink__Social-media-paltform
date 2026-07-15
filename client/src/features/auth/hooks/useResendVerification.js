import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { resendVerification } from "../api/authApi";

function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
  });
}

export { useResendVerification };
