import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/authApi";

export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
  });
}