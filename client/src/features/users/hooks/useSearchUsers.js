import { useQuery } from "@tanstack/react-query";

import { searchUsers } from "../api/userApi";

function useSearchUsers(search) {
  return useQuery({
    queryKey: ["search-users", search],

    queryFn: () => searchUsers(search),

    enabled: Boolean(search.trim()),
  });
}

export { useSearchUsers };
