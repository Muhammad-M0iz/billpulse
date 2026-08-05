import React, { useState } from "react";
import { Navbar } from "../../components/common/Navbar";
import { PlanCard } from "../../components/buyer/PlanCard";
import { SubscribeModal } from "../../components/buyer/SubscribeModal";
import { usePlans } from "../../hooks/usePlans";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { PlanResponse } from "../../client";

export const BrowsePlansPage: React.FC = () => {
  const { plans, isLoading } = usePlans();
  const { subscriptions } = useSubscriptions();
  const [selectedPlan, setSelectedPlan] = useState<PlanResponse | null>(null);

  const subscribedPlanIds = subscriptions
    .filter((s) => s.is_active)
    .map((s) => s.plan_id);

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-12 flex-1">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-none border border-[#1e293b] bg-[#181b25] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-white" style={{ fontSize: "28px" }}>
              layers
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight">
            Subscription Plans &amp; Pricing
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
            Choose from our tiered plans. Subscribe to multiple plans, customize your recurring billing day, and enjoy included feature quotas.
          </p>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <LoadingSpinner label="Fetching live pricing matrix..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSubscribed={subscribedPlanIds.includes(plan.id)}
                onSubscribe={(planId) => {
                  const targetPlan = plans.find((p) => p.id === planId);
                  if (targetPlan) setSelectedPlan(targetPlan);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <SubscribeModal
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1e293b]/50 bg-[#0b0f19]/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full px-6 py-12 max-w-7xl mx-auto">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <span className="text-xs font-mono-data text-slate-400 uppercase tracking-widest block">
              BillPulse
            </span>
            <p className="text-xs text-slate-500 leading-relaxed font-mono-data">
              &copy; {new Date().getFullYear()} BillPulse Core.<br />
              Built for global scale.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono-data text-white uppercase tracking-wider block mb-2">Product</span>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono-data">
              <li><span className="hover:text-white transition-colors cursor-pointer">Features</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">API Docs</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Pricing</span></li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono-data text-white uppercase tracking-wider block mb-2">Company</span>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono-data">
              <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono-data text-white uppercase tracking-wider block mb-2">Legal</span>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono-data">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Compliance</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
