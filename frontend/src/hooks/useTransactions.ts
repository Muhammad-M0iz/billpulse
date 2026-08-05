import { useQuery } from "@tanstack/react-query";
import {
  getMyTransactionsOptions,
  getAllTransactionsOptions,
} from "../client/@tanstack/react-query.gen";

export function useMyTransactions(cursor?: number, limit = 50) {
  const query = useQuery({
    ...getMyTransactionsOptions({
      query: { cursor, limit },
    }),
  });

  return {
    transactions: query.data?.data?.items || [],
    hasMore: query.data?.data?.has_more || false,
    nextCursor: query.data?.data?.next_cursor,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllTransactions(userId?: number, subscriptionId?: number, cursor?: number, limit = 50) {
  const query = useQuery({
    ...getAllTransactionsOptions({
      query: {
        user_id: userId,
        subscription_id: subscriptionId,
        cursor,
        limit,
      },
    }),
  });

  return {
    transactions: query.data?.data?.items || [],
    hasMore: query.data?.data?.has_more || false,
    nextCursor: query.data?.data?.next_cursor,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
