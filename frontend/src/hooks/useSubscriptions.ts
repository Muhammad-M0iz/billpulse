import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMySubscriptionsOptions,
  getSubscriptionsByUserOptions,
  createSubscriptionMutation,
  updateSubscriptionMutation,
  cancelSubscriptionMutation,
  getMySubscriptionsQueryKey,
  getMyTransactionsQueryKey,
} from "../client/@tanstack/react-query.gen";
import type { SubscriptionUpdate } from "../client";
import { toast } from "sonner";

export function useSubscriptions() {
  const queryClient = useQueryClient();

  const subscriptionsQuery = useQuery({
    ...getMySubscriptionsOptions(),
  });

  const createSubMut = useMutation({
    ...createSubscriptionMutation(),
    onSuccess: () => {
      toast.success("Successfully subscribed to plan! Monthly fee charged.");
      queryClient.invalidateQueries({ queryKey: getMySubscriptionsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getMyTransactionsQueryKey() });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Subscription failed");
    },
  });

  const updateSubMut = useMutation({
    ...updateSubscriptionMutation(),
    onSuccess: () => {
      toast.success("Subscription updated successfully!");
      queryClient.invalidateQueries({ queryKey: getMySubscriptionsQueryKey() });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update subscription");
    },
  });

  const cancelSubMut = useMutation({
    ...cancelSubscriptionMutation(),
    onSuccess: () => {
      toast.success("Subscription canceled/deactivated.");
      queryClient.invalidateQueries({ queryKey: getMySubscriptionsQueryKey() });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to cancel subscription");
    },
  });

  return {
    subscriptions: subscriptionsQuery.data?.data || [],
    isLoading: subscriptionsQuery.isLoading,
    isError: subscriptionsQuery.isError,
    error: subscriptionsQuery.error,
    refetch: subscriptionsQuery.refetch,
    subscribe: (planId: number) => createSubMut.mutate({ body: { plan_id: planId } }),
    subscribeAsync: (planId: number) => createSubMut.mutateAsync({ body: { plan_id: planId } }),
    isSubscribing: createSubMut.isPending,
    updateSubscription: (id: number, body: SubscriptionUpdate) =>
      updateSubMut.mutate({ path: { subscription_id: id }, body }),
    isUpdating: updateSubMut.isPending,
    cancelSubscription: (id: number) =>
      cancelSubMut.mutate({ path: { subscription_id: id } }),
    isCanceling: cancelSubMut.isPending,
  };
}

export function useSubscriptionsByUser(userId: number | null) {
  const query = useQuery({
    ...getSubscriptionsByUserOptions({
      path: { user_id: userId || 0 },
    }),
    enabled: Boolean(userId),
  });

  return {
    subscriptions: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
