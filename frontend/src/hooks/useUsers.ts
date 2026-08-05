import { useQuery } from "@tanstack/react-query";
import { getAllUsersOptions } from "../client/@tanstack/react-query.gen";

export function useUsers(role?: string) {
  const query = useQuery({
    ...getAllUsersOptions({
      query: { role },
    }),
  });

  return {
    users: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
