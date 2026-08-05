import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../common/Modal";
import { useRecordUsage } from "../../hooks/useUsage";
import { useFeatures } from "../../hooks/useFeatures";
import { usageFormSchema, type UsageFormSchemaType } from "../../schemas/usageSchemas";
import type { FeatureResponse, UserResponse } from "../../client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId?: number | null;
  feature?: FeatureResponse | null;
  user?: UserResponse | null;
  planName?: string;
}

export const RecordUsageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  subscriptionId,
  feature,
  user,
  planName,
}) => {
  const { recordUsage, isRecording } = useRecordUsage();
  const { features } = useFeatures();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UsageFormSchemaType>({
    resolver: zodResolver(usageFormSchema),
    defaultValues: {
      subscription_id: subscriptionId || 1,
      feature_id: feature?.id || 1,
      units_used: 10,
    },
  });

  useEffect(() => {
    if (subscriptionId) setValue("subscription_id", subscriptionId);
    if (feature?.id) setValue("feature_id", feature.id);
  }, [subscriptionId, feature, setValue]);

  const onSubmit = (data: UsageFormSchemaType) => {
    recordUsage({
      subscription_id: Number(data.subscription_id),
      feature_id: Number(data.feature_id),
      units_used: Number(data.units_used),
    });
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Feature Usage Entry">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Context Preview Banner */}
        {user && (
          <div className="p-4 bg-[#181b25] border border-[#1e293b] space-y-1 text-xs font-mono-data">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="material-symbols-outlined text-slate-400 text-base">person</span>
              Target User: {user.name} ({user.email})
            </div>
            {planName && (
              <div className="text-slate-400">
                Plan: <span className="text-white font-bold">{planName}</span> (Sub #{subscriptionId})
              </div>
            )}
          </div>
        )}

        {/* Subscription ID input */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Subscription ID
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 text-base">tag</span>
            <input
              type="number"
              placeholder="e.g. 1"
              {...register("subscription_id", { valueAsNumber: true })}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
            />
          </div>
          {errors.subscription_id && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.subscription_id.message}</p>
          )}
        </div>

        {/* Feature Dropdown or Context */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Select Feature
          </label>
          {feature ? (
            <div className="p-3 bg-[#181b25] border border-[#1e293b] flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-white block">{feature.name}</span>
                <span className="text-slate-400 font-mono-data">
                  Code: {feature.code} • Limit: {feature.max_unit_limit} units (${feature.unit_price}/overuse unit)
                </span>
              </div>
              <input type="hidden" {...register("feature_id", { valueAsNumber: true, value: feature.id })} />
            </div>
          ) : (
            <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
              <span className="material-symbols-outlined text-slate-400 text-base">bolt</span>
              <select
                {...register("feature_id", { valueAsNumber: true })}
                className="w-full bg-[#0b0f19] border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data cursor-pointer"
              >
                <option value="" className="bg-[#0b0f19]">Select a feature...</option>
                {features.filter((f) => f.is_active).map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#0b0f19]">
                    {f.name} ({f.code}) — Limit: {f.max_unit_limit} units (${f.unit_price}/overuse unit)
                  </option>
                ))}
              </select>
            </div>
          )}
          {errors.feature_id && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.feature_id.message}</p>
          )}
        </div>

        {/* Units Consumed */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Units Consumed
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 text-base">add_chart</span>
            <input
              type="number"
              placeholder="e.g. 50"
              {...register("units_used", { valueAsNumber: true })}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
            />
          </div>
          {errors.units_used && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.units_used.message}</p>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex justify-end gap-3 pt-6 border-t border-[#1e293b]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white border border-[#1e293b] hover:border-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isRecording}
            className="px-6 py-2.5 bg-white text-[#0b0f19] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isRecording ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">monitoring</span>
            )}
            Record Usage
          </button>
        </div>
      </form>
    </Modal>
  );
};
