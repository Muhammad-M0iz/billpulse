import React from "react";
import type { SubscriptionResponse } from "../../client";

interface SubscriptionsTableProps {
  subscriptions: SubscriptionResponse[];
  onViewUsage: (sub: SubscriptionResponse) => void;
  onUpdate: (sub: SubscriptionResponse) => void;
  onCancel: (id: number) => void;
  isCanceling?: boolean;
}

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  subscriptions,
  onViewUsage,
  onUpdate,
  onCancel,
  isCanceling = false,
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="border border-[#1e293b] p-8 text-center bg-[#181b25] text-slate-400">
        <span className="material-symbols-outlined text-slate-500 mb-2 block" style={{ fontSize: "32px" }}>
          credit_card
        </span>
        <p className="text-xs font-mono-data">You have no active subscriptions.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#1e293b]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#181b25] border-y border-[#1e293b]">
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Sub ID</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Plan</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Billing Day</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Last Billed</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Status</th>
            <th className="text-right py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="border-b border-[#1e293b] hover:bg-[#181b25]/60 transition-colors">
              <td className="py-4 px-4 font-mono-data text-xs text-white">#{sub.id}</td>
              <td className="py-4 px-4 font-medium text-white text-sm">
                {sub.plan.name} <span className="text-xs text-slate-400 font-mono-data">(${sub.plan.monthly_fee}/mo)</span>
              </td>
              <td className="py-4 px-4 text-xs text-slate-300 font-mono-data">Day {sub.billing_day}</td>
              <td className="py-4 px-4 text-xs text-slate-400 font-mono-data">
                {sub.last_billing_date ? new Date(sub.last_billing_date).toLocaleDateString() : "Never"}
              </td>
              <td className="py-4 px-4">
                {sub.is_active ? (
                  <span className="inline-flex items-center border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400 uppercase font-mono-data bg-emerald-500/10">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none mr-1.5"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center border border-rose-500/30 px-2 py-0.5 text-[10px] text-rose-400 uppercase font-mono-data bg-rose-500/10">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-none mr-1.5"></span>
                    Cancelled
                  </span>
                )}
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex justify-end items-center gap-3">
                  <button
                    onClick={() => onViewUsage(sub)}
                    title="Usage Telemetry"
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">monitoring</span>
                  </button>
                  <button
                    onClick={() => onUpdate(sub)}
                    title="Settings"
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">settings</span>
                  </button>
                  {sub.is_active && (
                    <button
                      onClick={() => onCancel(sub.id)}
                      disabled={isCanceling}
                      title="Cancel Subscription"
                      className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
