import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { registerUser } from "../api/authApi";

function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export { useRegister };
