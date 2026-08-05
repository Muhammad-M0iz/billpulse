import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../common/Modal";
import { usePlans } from "../../hooks/usePlans";
import { useFeatures } from "../../hooks/useFeatures";
import { planFormSchema, type PlanFormSchemaType } from "../../schemas/planSchemas";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlanModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createPlan, isCreating } = usePlans();
  const { features } = useFeatures();
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormSchemaType>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      monthly_fee: 29.99,
    },
  });

  const toggleFeature = (id: number) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: PlanFormSchemaType) => {
    createPlan({
      name: data.name,
      monthly_fee: Number(data.monthly_fee),
      feature_ids: selectedFeatureIds,
    });
    reset();
    setSelectedFeatureIds([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Subscription Plan">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Plan Name
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 text-base">layers</span>
            <input
              type="text"
              placeholder="e.g. Pro Developer Plan"
              {...register("name")}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
            />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.name.message}</p>}
        </div>

        {/* Monthly Fee */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Monthly Fee ($)
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 text-base">attach_money</span>
            <input
              type="number"
              step="0.01"
              placeholder="49.99"
              {...register("monthly_fee", { valueAsNumber: true })}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
            />
          </div>
          {errors.monthly_fee && <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.monthly_fee.message}</p>}
        </div>

        {/* Features Selector */}
        <div>
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-3">
            Attach Included Features
          </label>
          {features.length === 0 ? (
            <p className="text-xs text-amber-400 font-mono-data">No features created yet. Create features first.</p>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {features.map((feat) => {
                const isSelected = selectedFeatureIds.includes(feat.id);
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`p-3 border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#181b25] border-white text-white"
                        : "bg-[#181b25]/50 border-[#1e293b] text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-white block">{feat.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono-data">
                        Limit: {feat.max_unit_limit} units • Overuse: ${feat.unit_price}/unit
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 flex items-center justify-center border ${
                        isSelected
                          ? "bg-white border-white text-[#0b0f19]"
                          : "border-[#1e293b] bg-[#0b0f19]"
                      }`}
                    >
                      {isSelected && <span className="material-symbols-outlined text-xs">check</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
            disabled={isCreating}
            className="px-6 py-2.5 bg-white text-[#0b0f19] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isCreating ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">add_circle</span>
            )}
            Create Plan
          </button>
        </div>
      </form>
    </Modal>
  );
};
