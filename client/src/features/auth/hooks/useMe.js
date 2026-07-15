import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../users/api/userApi";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMyProfile,
  });
}