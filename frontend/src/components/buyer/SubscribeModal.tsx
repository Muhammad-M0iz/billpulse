import React from "react";
import { Modal } from "../common/Modal";
import type { PlanResponse } from "../../client";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { AnimatedPayButton } from "./AnimatedPayButton";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanResponse | null;
}

export const SubscribeModal: React.FC<Props> = ({ isOpen, onClose, plan }) => {
  const { subscribeAsync, isSubscribing } = useSubscriptions();

  if (!plan) return null;

  const handleConfirm = async () => {
    await subscribeAsync(plan.id);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Plan Subscription">
      <div className="space-y-6">
        <div className="p-4 bg-[#181b25] border border-[#1e293b] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono-data text-slate-400 uppercase">Selected Plan</span>
            <span className="text-sm font-semibold text-white">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#1e293b]">
            <span className="text-xs font-mono-data text-slate-400 uppercase">Monthly Fee</span>
            <span className="text-lg font-light text-white font-mono-data">${plan.monthly_fee} / month</span>
          </div>
        </div>

        <div className="p-4 bg-[#181b25]/60 border border-[#1e293b] text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-base">verified_user</span>
            Subscription Billing Information:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono-data text-[11px]">
            <li>Your account is charged the monthly plan fee upon subscription creation.</li>
            <li>Your recurring billing day is automatically assigned (days 1-28).</li>
            <li>Modify plans or billing schedules anytime from your dashboard.</li>
          </ul>
        </div>

        <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#1e293b]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubscribing}
            className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white border border-[#1e293b] hover:border-white transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          
          <div className="flex-1 max-w-[280px]">
            <AnimatedPayButton
              monthlyFee={plan.monthly_fee}
              onConfirm={handleConfirm}
              disabled={isSubscribing}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
