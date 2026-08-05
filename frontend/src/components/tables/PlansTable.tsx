import React from "react";
import type { PlanResponse } from "../../client";

interface PlansTableProps {
  plans: PlanResponse[];
  onSelectPlan?: (plan: PlanResponse) => void;
}

export const PlansTable: React.FC<PlansTableProps> = ({ plans, onSelectPlan }) => {
  if (plans.length === 0) {
    return (
      <div className="border border-[#1e293b] p-8 text-center bg-[#181b25] text-slate-400">
        <span className="material-symbols-outlined text-slate-500 mb-2 block" style={{ fontSize: "32px" }}>
          layers
        </span>
        <p className="text-xs font-mono-data">No plans available in catalog.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#1e293b]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#181b25] border-y border-[#1e293b]">
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Plan Name</th>
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Monthly Fee</th>
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase text-right">Included Features</th>
            {onSelectPlan && <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} className="border-b border-[#1e293b] hover:bg-[#181b25]/60 transition-colors">
              <td className="py-4 px-4 font-semibold text-white text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base">layers</span>
                {plan.name}
              </td>
              <td className="py-4 px-4 font-mono-data text-sm font-bold text-white">
                ${plan.monthly_fee} <span className="text-xs text-slate-500 font-normal">/ mo</span>
              </td>
              <td className="py-4 px-4 text-right">
                {plan.features && plan.features.length > 0 ? (
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {plan.features.map((feat) => (
                      <span
                        key={feat.id}
                        className="px-2 py-0.5 border border-[#1e293b] text-[10px] font-mono-data text-slate-300 bg-[#181b25]"
                      >
                        {feat.name} ({feat.max_unit_limit} units)
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic font-mono-data">No features attached</span>
                )}
              </td>
              {onSelectPlan && (
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="px-4 py-2 bg-white text-[#0b0f19] text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Subscribe
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
