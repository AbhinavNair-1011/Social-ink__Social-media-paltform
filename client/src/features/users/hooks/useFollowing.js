import { useQuery } from "@tanstack/react-query";

import { getFollowing } from "../api/userApi";

function useFollowing(userId) {
  return useQuery({
    queryKey: ["following", userId],

    queryFn: () => getFollowing(userId),

    enabled: Boolean(userId),
  });
}

export { useFollowing };