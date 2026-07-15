import { useMutation } from "@tanstack/react-query";

import { uploadProfileImage } from "../api/userApi";

function useUploadProfileImage() {
  return useMutation({
    mutationFn: uploadProfileImage,
  });
}

export { useUploadProfileImage };
