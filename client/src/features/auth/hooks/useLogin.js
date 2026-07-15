import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { loginUser } from "../api/authApi";

function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
  });
}

export { useLogin };
