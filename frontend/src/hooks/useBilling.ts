import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runBillingCycleMutation, getAllTransactionsQueryKey, getMyTransactionsQueryKey } from "../client/@tanstack/react-query.gen";
import { toast } from "sonner";

export function useBilling() {
  const queryClient = useQueryClient();

  const runBillingMut = useMutation({
    ...runBillingCycleMutation(),
    onSuccess: (data) => {
      const msg = data?.message || "Billing cycle executed successfully!";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: getAllTransactionsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getMyTransactionsQueryKey() });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to execute billing cycle");
    },
  });

  return {
    runBilling: () => runBillingMut.mutate({}),
    isRunning: runBillingMut.isPending,
  };
}
