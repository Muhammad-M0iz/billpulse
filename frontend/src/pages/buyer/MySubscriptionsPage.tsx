import React, { useState } from "react";
import { Navbar } from "../../components/common/Navbar";
import { SubscriptionsTable } from "../../components/tables/SubscriptionsTable";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { UsageHistoryModal } from "../../components/buyer/UsageHistoryModal";
import { UpdateSubscriptionModal } from "../../components/buyer/UpdateSubscriptionModal";
import type { SubscriptionResponse } from "../../client";
import { Link } from "react-router-dom";

export const MySubscriptionsPage: React.FC = () => {
  const { subscriptions, isLoading, cancelSubscription, isCanceling } = useSubscriptions();

  const [selectedSubForUsage, setSelectedSubForUsage] = useState<SubscriptionResponse | null>(null);
  const [selectedSubForUpdate, setSelectedSubForUpdate] = useState<SubscriptionResponse | null>(null);

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-8 flex-1">
        {/* Page Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#1e293b] pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "36px" }}>
                credit_card
              </span>
              My Subscriptions
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-2 font-light">
              Active plans, recurring billing dates, feature usage breakdowns, and subscription settings.
            </p>
          </div>

          <Link
            to="/buyer/plans"
            className="bg-white text-[#0b0f19] px-6 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Subscribe to New Plan
          </Link>
        </div>

        {/* Subscriptions Table */}
        {isLoading ? (
          <LoadingSpinner label="Fetching your active subscriptions..." />
        ) : (
          <SubscriptionsTable
            subscriptions={subscriptions}
            onViewUsage={(sub) => setSelectedSubForUsage(sub)}
            onUpdate={(sub) => setSelectedSubForUpdate(sub)}
            onCancel={(id) => cancelSubscription(id)}
            isCanceling={isCanceling}
          />
        )}
      </main>

      <UsageHistoryModal
        isOpen={Boolean(selectedSubForUsage)}
        onClose={() => setSelectedSubForUsage(null)}
        subscriptionId={selectedSubForUsage?.id || null}
        planName={selectedSubForUsage?.plan?.name}
      />
      <UpdateSubscriptionModal
        isOpen={Boolean(selectedSubForUpdate)}
        onClose={() => setSelectedSubForUpdate(null)}
        subscription={selectedSubForUpdate}
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
              <li><Link className="hover:text-white transition-colors" to="/buyer/plans">Features</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/buyer/plans">API Docs</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/buyer/plans">Pricing</Link></li>
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
