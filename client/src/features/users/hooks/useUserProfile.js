import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "../api/userApi";

function useUserProfile(userId) {
  return useQuery({
    queryKey: ["user-profile", userId],

    queryFn: () => getUserProfile(userId),

    enabled: Boolean(userId),
  });
}

export { useUserProfile };