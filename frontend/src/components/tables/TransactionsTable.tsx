import React from "react";
import type { TransactionResponse } from "../../client";

interface TransactionsTableProps {
  transactions: TransactionResponse[];
  isAdminView?: boolean;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isAdminView = false,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="border border-[#1e293b] p-8 text-center bg-[#181b25] text-slate-400">
        <span className="material-symbols-outlined text-slate-500 mb-2 block" style={{ fontSize: "32px" }}>
          receipt_long
        </span>
        <p className="text-xs font-mono-data">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#1e293b]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#181b25] border-y border-[#1e293b]">
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Tx ID</th>
            {isAdminView && (
              <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">User ID</th>
            )}
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Sub ID</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Base Fee</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Extra Charges</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Total Amount</th>
            <th className="text-left py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Type</th>
            <th className="text-right py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const basePrice = parseFloat(tx.base_price || "0");
            const extraCharges = parseFloat(tx.extra_charges || "0");
            const totalAmount = parseFloat(tx.total_amount || `${basePrice + extraCharges}`);
            const hasOveruse = extraCharges > 0;

            return (
              <tr key={tx.id} className="border-b border-[#1e293b] hover:bg-[#181b25]/60 transition-colors">
                <td className="py-4 px-4 font-mono-data text-xs text-white">#{tx.id}</td>
                {isAdminView && (
                  <td className="py-4 px-4 font-mono-data text-xs text-violet-300">User #{tx.user_id}</td>
                )}
                <td className="py-4 px-4 font-mono-data text-xs text-slate-400">Sub #{tx.subscription_id}</td>
                <td className="py-4 px-4 font-mono-data text-xs text-slate-300">${basePrice.toFixed(2)}</td>
                <td className="py-4 px-4 font-mono-data text-xs">
                  {hasOveruse ? (
                    <span className="text-rose-400 font-semibold">+${extraCharges.toFixed(2)}</span>
                  ) : (
                    <span className="text-slate-600">$0.00</span>
                  )}
                </td>
                <td className="py-4 px-4 font-mono-data text-sm font-bold text-white">
                  ${totalAmount.toFixed(2)}
                </td>
                <td className="py-4 px-4">
                  {tx.is_recurring ? (
                    <span className="inline-flex items-center border border-[#1e293b] px-2 py-0.5 text-[10px] text-slate-300 uppercase font-mono-data">
                      <span className="material-symbols-outlined text-[12px] mr-1">sync</span>
                      Recurring
                    </span>
                  ) : (
                    <span className="inline-flex items-center border border-[#1e293b] px-2 py-0.5 text-[10px] text-slate-400 uppercase font-mono-data">
                      Initial Signup
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right font-mono-data text-xs text-slate-400">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
