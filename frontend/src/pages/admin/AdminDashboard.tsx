import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/common/Navbar";
import { FeaturesTable } from "../../components/tables/FeaturesTable";
import { PlansTable } from "../../components/tables/PlansTable";
import { TransactionsTable } from "../../components/tables/TransactionsTable";
import { useFeatures } from "../../hooks/useFeatures";
import { usePlans } from "../../hooks/usePlans";
import { useAllTransactions } from "../../hooks/useTransactions";
import { CreateFeatureModal } from "../../components/admin/CreateFeatureModal";
import { CreatePlanModal } from "../../components/admin/CreatePlanModal";
import { RecordUsageModal } from "../../components/admin/RecordUsageModal";
import { RunBillingModal } from "../../components/admin/RunBillingModal";

export const AdminDashboard: React.FC = () => {
  const { features } = useFeatures();
  const { plans } = usePlans();
  const { transactions } = useAllTransactions();

  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-12 flex-1">
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#1e293b] pb-8">
          <div className="space-y-1 max-w-2xl">
            <h1 className="text-3xl md:text-4xl text-white font-light tracking-tight">Admin Overview</h1>
            <p className="text-sm md:text-base text-slate-400 font-light">
              System feature management, plan builder, usage tracking, and billing automation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsBillingModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#0b0f19] px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              Trigger Billing Run
            </button>
            <button
              onClick={() => setIsUsageModalOpen(true)}
              className="border border-[#1e293b] hover:border-white text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">monitoring</span>
              Log Usage
            </button>
            <button
              onClick={() => setIsFeatureModalOpen(true)}
              className="border border-[#1e293b] hover:border-white text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              New Feature
            </button>
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="bg-white hover:bg-slate-200 text-[#0b0f19] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Create Plan
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Features */}
          <div className="border border-[#1e293b] p-6 bg-[#181b25]/60 transition-colors hover:border-white duration-300 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#1e293b] bg-[#181b25]">
              <span className="material-symbols-outlined text-white text-2xl">bolt</span>
            </div>
            <div>
              <p className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
                Total Catalog Features
              </p>
              <p className="text-3xl font-light text-white mt-1">{features.length}</p>
            </div>
          </div>

          {/* Card 2: Plans */}
          <div className="border border-[#1e293b] p-6 bg-[#181b25]/60 transition-colors hover:border-white duration-300 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#1e293b] bg-[#181b25]">
              <span className="material-symbols-outlined text-white text-2xl">layers</span>
            </div>
            <div>
              <p className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
                Configured Plans
              </p>
              <p className="text-3xl font-light text-white mt-1">{plans.length}</p>
            </div>
          </div>

          {/* Card 3: Transactions */}
          <div className="border border-[#1e293b] p-6 bg-[#181b25]/60 transition-colors hover:border-white duration-300 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#1e293b] bg-[#181b25]">
              <span className="material-symbols-outlined text-white text-2xl">receipt_long</span>
            </div>
            <div>
              <p className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
                Processed Transactions
              </p>
              <p className="text-3xl font-light text-white mt-1">{transactions.length}</p>
            </div>
          </div>
        </section>

        {/* Quick Tables Section */}
        <div className="space-y-10">
          {/* Section 1: Plans */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">layers</span>
                <h2 className="text-xl font-light text-white">Subscription Plans Catalog</h2>
              </div>
              <Link to="/admin/plans" className="text-xs font-mono-data text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                VIEW ALL PLANS &rarr;
              </Link>
            </div>
            <PlansTable plans={plans} />
          </section>

          {/* Section 2: Features */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">bolt</span>
                <h2 className="text-xl font-light text-white">System Features</h2>
              </div>
              <Link to="/admin/features" className="text-xs font-mono-data text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                VIEW ALL FEATURES &rarr;
              </Link>
            </div>
            <FeaturesTable features={features} />
          </section>

          {/* Section 3: Transactions */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">receipt_long</span>
                <h2 className="text-xl font-light text-white">Recent Billing Transactions</h2>
              </div>
              <Link to="/admin/transactions" className="text-xs font-mono-data text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                VIEW ALL TRANSACTIONS &rarr;
              </Link>
            </div>
            <TransactionsTable transactions={transactions.slice(0, 5)} isAdminView />
          </section>
        </div>
      </main>

      {/* Modals */}
      <CreateFeatureModal isOpen={isFeatureModalOpen} onClose={() => setIsFeatureModalOpen(false)} />
      <CreatePlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />
      <RecordUsageModal isOpen={isUsageModalOpen} onClose={() => setIsUsageModalOpen(false)} />
      <RunBillingModal isOpen={isBillingModalOpen} onClose={() => setIsBillingModalOpen(false)} />

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1e293b]/50 bg-[#0b0f19]/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full px-6 py-12 max-w-7xl mx-auto">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <span className="text-xs font-mono-data text-slate-400 uppercase tracking-widest block">
              BillPulse
            </span>
            <p className="text-xs text-slate-500 leading-relaxed font-mono-data">
              &copy; {new Date().getFullYear()} BillPulse Core.<br />
              Precision Billing Engine.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono-data text-white uppercase tracking-wider block mb-2">Product</span>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono-data">
              <li><Link className="hover:text-white transition-colors" to="/admin/plans">Plans</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/admin/features">Features</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/admin/usage">Log Usage</Link></li>
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
