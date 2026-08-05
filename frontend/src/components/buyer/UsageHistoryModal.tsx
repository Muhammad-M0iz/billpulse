import React from "react";
import { Modal } from "../common/Modal";
import { useSubscriptionUsage } from "../../hooks/useUsage";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: number | null;
  planName?: string;
}

export const UsageHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  subscriptionId,
  planName = "Subscription",
}) => {
  const { usageRecords, isLoading } = useSubscriptionUsage(subscriptionId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Usage Breakdown (${planName})`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {isLoading ? (
          <LoadingSpinner label="Fetching feature usage telemetry..." />
        ) : usageRecords.length === 0 ? (
          <div className="p-8 text-center bg-[#181b25] border border-[#1e293b] text-slate-400">
            <span className="material-symbols-outlined text-slate-500 mb-2 block" style={{ fontSize: "32px" }}>
              monitoring
            </span>
            <p className="text-xs font-mono-data">No feature usage recorded yet for this subscription.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-[#181b25] border border-[#1e293b] text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-data text-[11px] text-slate-400">Formula:</span>
              <code className="font-mono-data text-white bg-white/5 px-2 py-0.5 border border-white/10 text-[11px]">
                Overuse Charge = (Units Used - Max Limit) * Unit Price
              </code>
            </div>

            <div className="overflow-x-auto border border-[#1e293b]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#181b25] text-slate-400 font-mono-data uppercase border-b border-[#1e293b]">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3 text-center">Units Used</th>
                    <th className="p-3 text-center">Limit</th>
                    <th className="p-3 text-center">Unit Price</th>
                    <th className="p-3 text-right">Overuse Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b] text-slate-200">
                  {usageRecords.map((record) => {
                    const feature = record.feature;
                    const unitsUsed = record.units_used || 0;
                    const maxLimit = feature?.max_unit_limit || 0;
                    const unitPrice = feature?.unit_price ? parseFloat(feature.unit_price) : 0;

                    const exceededUnits = Math.max(0, unitsUsed - maxLimit);
                    const overuseBill = exceededUnits * unitPrice;
                    const isOverused = exceededUnits > 0;

                    return (
                      <tr key={record.id} className="hover:bg-[#181b25]/60 transition-colors">
                        <td className="p-3 font-medium text-white">
                          {feature?.name || `Feature #${record.feature_id}`}
                          <span className="block text-[10px] text-slate-500 font-mono-data">
                            {feature?.code}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono-data font-bold text-white">{unitsUsed}</td>
                        <td className="p-3 text-center font-mono-data text-slate-400">{maxLimit}</td>
                        <td className="p-3 text-center font-mono-data">${unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono-data font-bold">
                          {isOverused ? (
                            <span className="text-rose-400 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">warning</span>
                              +${overuseBill.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-emerald-400 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">check</span>
                              $0.00
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-[#1e293b]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-[#0b0f19] text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
