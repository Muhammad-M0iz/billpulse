import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeaturesOptions, createFeatureMutation, getFeaturesQueryKey } from "../client/@tanstack/react-query.gen";
import type { FeatureCreate } from "../client";
import { toast } from "sonner";

export function useFeatures() {
  const queryClient = useQueryClient();

  const featuresQuery = useQuery({
    ...getFeaturesOptions(),
  });

  const createFeatureMut = useMutation({
    ...createFeatureMutation(),
    onSuccess: () => {
      toast.success("Feature created successfully!");
      queryClient.invalidateQueries({ queryKey: getFeaturesQueryKey() });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create feature");
    },
  });

  return {
    features: featuresQuery.data?.data || [],
    isLoading: featuresQuery.isLoading,
    isError: featuresQuery.isError,
    error: featuresQuery.error,
    refetch: featuresQuery.refetch,
    createFeature: (data: FeatureCreate) => createFeatureMut.mutate({ body: data }),
    isCreating: createFeatureMut.isPending,
  };
}
