import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/authApi";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMyProfile,
  });
}