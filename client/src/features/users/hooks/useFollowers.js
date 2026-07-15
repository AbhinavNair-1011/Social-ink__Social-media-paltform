import { useQuery } from "@tanstack/react-query";

import { getFollowers } from "../api/userApi";

function useFollowers(userId) {
  return useQuery({
    queryKey: ["followers", userId],

    queryFn: () => getFollowers(userId),

    enabled: Boolean(userId),
  });
}

export { useFollowers };