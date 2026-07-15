import { useMutation } from "@tanstack/react-query";

import { unfollowUser } from "../api/userApi";

function useUnfollow() {
  return useMutation({
    mutationFn: unfollowUser,
  });
}

export { useUnfollow };