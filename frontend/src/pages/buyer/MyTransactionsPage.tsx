import React from "react";
import { Navbar } from "../../components/common/Navbar";
import { TransactionsTable } from "../../components/tables/TransactionsTable";
import { useMyTransactions } from "../../hooks/useTransactions";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Link } from "react-router-dom";

export const MyTransactionsPage: React.FC = () => {
  const { transactions, isLoading } = useMyTransactions();

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-8 flex-1">
        {/* Page Banner */}
        <div className="border-b border-[#1e293b] pb-8">
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "36px" }}>
              receipt_long
            </span>
            Transaction &amp; Invoice History
          </h1>
          <p className="text-sm md:text-base text-slate-400 mt-2 font-light">
            Receipts and payment history for subscription initial signups and recurring monthly bills.
          </p>
        </div>

        {/* Transactions Table */}
        {isLoading ? (
          <LoadingSpinner label="Loading transaction receipts..." />
        ) : (
          <TransactionsTable transactions={transactions} />
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
