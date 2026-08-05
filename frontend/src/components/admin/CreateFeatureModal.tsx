import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../common/Modal";
import { useFeatures } from "../../hooks/useFeatures";
import { featureFormSchema, type FeatureFormSchemaType } from "../../schemas/featureSchemas";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFeatureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createFeature, isCreating } = useFeatures();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeatureFormSchemaType>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      is_active: true,
      max_unit_limit: 100,
    },
  });

  const onSubmit = (data: FeatureFormSchemaType) => {
    createFeature({
      name: data.name,
      code: data.code,
      unit_price: Number(data.unit_price),
      max_unit_limit: Number(data.max_unit_limit),
      is_active: data.is_active,
    });
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Feature">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Feature Name
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 text-base">bolt</span>
            <input
              type="text"
              placeholder="e.g. Storage Capacity"
              {...register("name")}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
            />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.name.message}</p>}
        </div>

        {/* Code */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Feature Code
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 text-base">code</span>
            <input
              type="text"
              placeholder="e.g. storage_gb"
              {...register("code")}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
            />
          </div>
          {errors.code && <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.code.message}</p>}
        </div>

        {/* Unit Price & Max Unit Limit */}
        <div className="grid grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
              Unit Price ($)
            </label>
            <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
              <span className="material-symbols-outlined text-slate-400 text-base">attach_money</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.50"
                {...register("unit_price", { valueAsNumber: true })}
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
              />
            </div>
            {errors.unit_price && <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.unit_price.message}</p>}
          </div>

          <div className="group">
            <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
              Max Limit (Units)
            </label>
            <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
              <span className="material-symbols-outlined text-slate-400 text-base">numbers</span>
              <input
                type="number"
                placeholder="100"
                {...register("max_unit_limit", { valueAsNumber: true })}
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
              />
            </div>
            {errors.max_unit_limit && <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.max_unit_limit.message}</p>}
          </div>
        </div>

        {/* Is Active Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
            className="w-4 h-4 border border-[#1e293b] bg-[#0b0f19] text-white focus:ring-0 cursor-pointer"
          />
          <label htmlFor="is_active" className="text-xs font-mono-data text-slate-300 cursor-pointer">
            Active Feature (Available for plan association)
          </label>
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
              <span className="material-symbols-outlined text-sm">save</span>
            )}
            Save Feature
          </button>
        </div>
      </form>
    </Modal>
  );
};
