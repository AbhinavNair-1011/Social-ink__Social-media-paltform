import { useQuery } from "@tanstack/react-query";

import { getMyProfile } from "../api/userApi";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],

    queryFn: getMyProfile,
  });
}