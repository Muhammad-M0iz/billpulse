import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/common/Navbar";
import { SubscriptionsTable } from "../../components/tables/SubscriptionsTable";
import { TransactionsTable } from "../../components/tables/TransactionsTable";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { useMyTransactions } from "../../hooks/useTransactions";
import { useAuth } from "../../hooks/useAuth";
import { UsageHistoryModal } from "../../components/buyer/UsageHistoryModal";
import { UpdateSubscriptionModal } from "../../components/buyer/UpdateSubscriptionModal";
import type { SubscriptionResponse } from "../../client";

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscriptions, cancelSubscription, isCanceling } = useSubscriptions();
  const { transactions } = useMyTransactions();

  const [selectedSubForUsage, setSelectedSubForUsage] = useState<SubscriptionResponse | null>(null);
  const [selectedSubForUpdate, setSelectedSubForUpdate] = useState<SubscriptionResponse | null>(null);

  const activeSubs = subscriptions.filter((s) => s.is_active);
  const primarySub = activeSubs[0];

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-12 flex-1">
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#1e293b] pb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl text-white font-light mb-2 tracking-tight">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              Manage active subscriptions, track feature overuse, and view invoice transactions.
            </p>
          </div>
          <Link
            to="/buyer/plans"
            className="bg-white text-[#0b0f19] px-6 py-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
          >
            Explore Plans
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </header>

        {/* Metrics Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Subscriptions */}
          <div className="border border-[#1e293b] p-6 bg-[#181b25]/60 transition-colors hover:border-white duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-slate-400">credit_card</span>
              <span className="text-xs font-mono-data text-slate-400 uppercase">Subscriptions</span>
            </div>
            <div className="space-y-1">
              <div className="text-[40px] text-white leading-none font-light">{activeSubs.length}</div>
              <div className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
                Active Subscriptions
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 opacity-60">Total active plan subscriptions</p>
          </div>

          {/* Card 2: Schedule */}
          <div className="border border-[#1e293b] p-6 bg-[#181b25]/60 transition-colors hover:border-white duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-slate-400">calendar_today</span>
              <span className="text-xs font-mono-data text-slate-400 uppercase">Schedule</span>
            </div>
            <div className="space-y-1">
              <div className="text-[40px] text-white leading-none font-light">
                {primarySub ? `Day ${primarySub.billing_day}` : "N/A"}
              </div>
              <div className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
                Next Billing Day
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 opacity-60">Recurring monthly charge date</p>
          </div>

          {/* Card 3: Activity */}
          <div className="border border-[#1e293b] p-6 bg-[#181b25]/60 transition-colors hover:border-white duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-slate-400">receipt_long</span>
              <span className="text-xs font-mono-data text-slate-400 uppercase">Activity</span>
            </div>
            <div className="space-y-1">
              <div className="text-[40px] text-white leading-none font-light">{transactions.length}</div>
              <div className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
                Total Invoices
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 opacity-60">Historical transactions &amp; receipts</p>
          </div>
        </div>

        {/* Active Plan Subscriptions */}
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">credit_card</span>
              <h2 className="text-xl font-light text-white">Active Plan Subscriptions</h2>
            </div>
            <Link
              to="/buyer/plans"
              className="text-xs font-mono-data text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              + SUBSCRIBE TO ANOTHER PLAN
            </Link>
          </div>
          <SubscriptionsTable
            subscriptions={subscriptions}
            onViewUsage={(sub) => setSelectedSubForUsage(sub)}
            onUpdate={(sub) => setSelectedSubForUpdate(sub)}
            onCancel={(id) => cancelSubscription(id)}
            isCanceling={isCanceling}
          />
        </section>

        {/* Recent Payment History */}
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">receipt_long</span>
              <h2 className="text-xl font-light text-white">Recent Payment History</h2>
            </div>
            <Link
              to="/buyer/transactions"
              className="text-xs font-mono-data text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              VIEW ALL TRANSACTIONS
            </Link>
          </div>
          <TransactionsTable transactions={transactions.slice(0, 5)} />
        </section>
      </main>

      {/* Modals */}
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
