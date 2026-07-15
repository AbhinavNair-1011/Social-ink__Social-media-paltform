import { useMutation } from "@tanstack/react-query";

import { followUser } from "../api/userApi";

function useFollow() {
  return useMutation({
    mutationFn: followUser,
  });
}

export { useFollow };
