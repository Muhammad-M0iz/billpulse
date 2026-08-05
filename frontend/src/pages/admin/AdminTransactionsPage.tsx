import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/common/Navbar";
import { TransactionsTable } from "../../components/tables/TransactionsTable";
import { useAllTransactions } from "../../hooks/useTransactions";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export const AdminTransactionsPage: React.FC = () => {
  const { transactions, isLoading } = useAllTransactions();

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-8 flex-1">
        <header className="border-b border-[#1e293b] pb-6 space-y-1">
          <h1 className="text-3xl md:text-4xl text-white font-light tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-3xl">receipt_long</span>
            System Transaction Logs
          </h1>
          <p className="text-sm text-slate-400 font-light">
            Complete audit history of buyer initial subscriptions and automated recurring charges.
          </p>
        </header>

        {isLoading ? (
          <LoadingSpinner label="Fetching all system transactions..." />
        ) : (
          <TransactionsTable transactions={transactions} isAdminView />
        )}
      </main>

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
