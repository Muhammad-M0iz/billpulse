import React from "react";
import { Modal } from "../common/Modal";
import { useBilling } from "../../hooks/useBilling";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RunBillingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { runBilling, isRunning } = useBilling();

  const handleConfirm = () => {
    runBilling();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Execute Recurring Billing Cycle">
      <div className="space-y-6">
        <div className="p-4 bg-[#181b25] border border-[#1e293b] flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-400 text-xl shrink-0 mt-0.5">
            warning
          </span>
          <div className="text-xs space-y-1.5 font-mono-data">
            <p className="font-semibold text-white uppercase tracking-wider">Billing Cycle Automation</p>
            <p className="text-slate-400">
              Launching this action checks all buyer subscriptions due on their <code className="bg-[#0b0f19] border border-[#1e293b] px-1 py-0.5 text-white">billing_day</code>.
            </p>
            <p className="text-slate-400">
              It charges monthly plan recurring fees and calculates feature overuse extra fees using the formula:
            </p>
            <p className="text-emerald-400 bg-[#0b0f19] border border-[#1e293b] p-2 text-[11px]">
              Extra Fee = Exceeded Units * Feature Unit Price
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-mono-data">
          Are you sure you want to execute the billing engine now?
        </p>

        <div className="flex justify-end gap-3 pt-6 border-t border-[#1e293b]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white border border-[#1e293b] hover:border-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isRunning}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0b0f19] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            {isRunning ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">play_arrow</span>
            )}
            Run Billing Engine Now
          </button>
        </div>
      </div>
    </Modal>
  );
};
