import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscriptionUsageOptions,
  getUserUsageOptions,
  createUsageMutation,
} from "../client/@tanstack/react-query.gen";
import type { UsageCreate } from "../client";
import { toast } from "sonner";

export function useSubscriptionUsage(subscriptionId: number | null) {
  const query = useQuery({
    ...getSubscriptionUsageOptions({
      path: { subscription_id: subscriptionId || 0 },
    }),
    enabled: Boolean(subscriptionId),
  });

  return {
    usageRecords: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useUserUsage(userId: number | null) {
  const query = useQuery({
    ...getUserUsageOptions({
      path: { user_id: userId || 0 },
    }),
    enabled: Boolean(userId),
  });

  return {
    userUsageRecords: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useRecordUsage() {
  const queryClient = useQueryClient();

  const recordMut = useMutation({
    ...createUsageMutation(),
    onSuccess: () => {
      toast.success("Feature usage recorded successfully!");
      queryClient.invalidateQueries({
        predicate: (query) => {
          const id = (query.queryKey[0] as any)?._id;
          return id === "getSubscriptionUsage" || id === "getUserUsage";
        },
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to record feature usage");
    },
  });

  return {
    recordUsage: (data: UsageCreate) => recordMut.mutate({ body: data }),
    isRecording: recordMut.isPending,
  };
}
