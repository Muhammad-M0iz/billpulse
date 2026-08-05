import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlansOptions, createPlanMutation, getPlansQueryKey } from "../client/@tanstack/react-query.gen";
import type { PlanCreate } from "../client";
import { toast } from "sonner";

export function usePlans() {
  const queryClient = useQueryClient();

  const plansQuery = useQuery({
    ...getPlansOptions(),
  });

  const createPlanMut = useMutation({
    ...createPlanMutation(),
    onSuccess: () => {
      toast.success("Plan created successfully!");
      queryClient.invalidateQueries({ queryKey: getPlansQueryKey() });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create plan");
    },
  });

  return {
    plans: plansQuery.data?.data || [],
    isLoading: plansQuery.isLoading,
    isError: plansQuery.isError,
    error: plansQuery.error,
    refetch: plansQuery.refetch,
    createPlan: (data: PlanCreate) => createPlanMut.mutate({ body: data }),
    isCreating: createPlanMut.isPending,
  };
}
