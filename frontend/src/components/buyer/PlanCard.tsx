import React from "react";
import type { PlanResponse, FeatureResponse } from "../../client";

interface PlanCardProps {
  plan: PlanResponse;
  onSubscribe?: (planId: number) => void;
  isSubscribed?: boolean;
  isLoading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSubscribe,
  isSubscribed = false,
  isLoading = false,
}) => {
  return (
    <div className="hairline-border p-6 flex flex-col justify-between bg-[#181b25] relative transition-all duration-300">
      {isSubscribed && (
        <div className="absolute -top-3 right-4 bg-emerald-400 text-[#0b0f19] px-2.5 py-0.5 text-[10px] font-bold tracking-tighter uppercase font-mono-data">
          ACTIVE PLAN
        </div>
      )}

      <div>
        <div className="mb-6">
          <span className="font-mono-data text-[10px] text-white/40 uppercase">
            PLAN_ID: #{plan.id}
          </span>
          <h3 className="text-xl font-medium text-white mt-1">{plan.name}</h3>
          <div className="flex items-baseline mt-4">
            <span className="font-display text-4xl font-light text-white">${plan.monthly_fee}</span>
            <span className="text-xs text-slate-400 font-mono-data ml-1.5">/mo</span>
          </div>
        </div>

        {/* Included Features & Quotas */}
        <div className="space-y-3 flex-grow border-t border-[#1e293b]/40 pt-4 mb-6">
          <span className="text-[10px] font-mono-data uppercase tracking-widest text-slate-400 block mb-2">
            Included Features
          </span>
          {plan.features && plan.features.length > 0 ? (
            <ul className="space-y-2.5">
              {plan.features.map((feature: FeatureResponse) => (
                <li key={feature.id} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-emerald-400">check</span>
                    {feature.name}
                  </span>
                  <span className="text-white font-mono-data">{feature.max_unit_limit} units</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No features attached to this plan.</p>
          )}
        </div>
      </div>

      {/* Subscription Action Button */}
      {onSubscribe ? (
        <button
          onClick={() => onSubscribe(plan.id)}
          disabled={isSubscribed || isLoading}
          className={`w-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            isSubscribed
              ? "bg-[#0b0f19] text-slate-500 border border-[#1e293b] cursor-not-allowed"
              : "bg-white hover:bg-slate-200 text-[#0b0f19]"
          }`}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      ) : (
        <a
          href="#plans"
          className="w-full py-2.5 border border-[#1e293b] text-center text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-[#0b0f19]"
        >
          Select Plan
        </a>
      )}
    </div>
  );
};
