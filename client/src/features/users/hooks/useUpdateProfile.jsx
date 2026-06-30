import { useMutation } from "@tanstack/react-query";

import { updateProfile } from "../api/userApi";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}