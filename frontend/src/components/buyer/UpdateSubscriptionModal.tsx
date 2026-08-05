import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../common/Modal";
import type { SubscriptionResponse } from "../../client";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { usePlans } from "../../hooks/usePlans";
import { subscriptionUpdateSchema, type SubscriptionUpdateSchemaType } from "../../schemas/planSchemas";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionResponse | null;
}

export const UpdateSubscriptionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  subscription,
}) => {
  const { updateSubscription, isUpdating } = useSubscriptions();
  const { plans } = usePlans();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionUpdateSchemaType>({
    resolver: zodResolver(subscriptionUpdateSchema),
    defaultValues: {
      plan_id: subscription?.plan_id || 1,
      billing_day: subscription?.billing_day || 1,
    },
  });

  if (!subscription) return null;

  const onSubmit = (data: SubscriptionUpdateSchemaType) => {
    updateSubscription(subscription.id, {
      plan_id: Number(data.plan_id),
      billing_day: data.billing_day ? Number(data.billing_day) : undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Subscription Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Select Plan */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Change Plan
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400">layers</span>
            <select
              {...register("plan_id", { valueAsNumber: true })}
              className="w-full bg-[#0b0f19] border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data cursor-pointer"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0b0f19] text-white">
                  {p.name} — ${p.monthly_fee}/month
                </option>
              ))}
            </select>
          </div>
          {errors.plan_id && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.plan_id.message}</p>
          )}
        </div>

        {/* Recurring Billing Day */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 uppercase mb-1">
            Recurring Billing Day (1 - 28)
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400">calendar_today</span>
            <input
              type="number"
              min="1"
              max="28"
              placeholder="15"
              {...register("billing_day", { valueAsNumber: true })}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
            />
          </div>
          {errors.billing_day && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.billing_day.message}</p>
          )}
          <p className="text-xs text-slate-500 mt-1.5 font-mono-data">
            Pick a day between 1 and 28 when your account will be billed every month.
          </p>
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
            disabled={isUpdating}
            className="px-6 py-2.5 bg-white text-[#0b0f19] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">save</span>
            )}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};
