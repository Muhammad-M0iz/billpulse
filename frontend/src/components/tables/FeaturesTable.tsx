import React from "react";
import type { FeatureResponse } from "../../client";

interface FeaturesTableProps {
  features: FeatureResponse[];
}

export const FeaturesTable: React.FC<FeaturesTableProps> = ({ features }) => {
  if (features.length === 0) {
    return (
      <div className="border border-[#1e293b] p-8 text-center bg-[#181b25] text-slate-400">
        <span className="material-symbols-outlined text-slate-500 mb-2 block" style={{ fontSize: "32px" }}>
          bolt
        </span>
        <p className="text-xs font-mono-data">No features created yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#1e293b]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#181b25] border-y border-[#1e293b]">
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Feature Name</th>
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Feature Code</th>
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Unit Price</th>
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase">Max Unit Limit</th>
            <th className="py-3 px-4 text-xs font-mono-data text-slate-400 uppercase text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id} className="border-b border-[#1e293b] hover:bg-[#181b25]/60 transition-colors">
              <td className="py-4 px-4 font-semibold text-white text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base">bolt</span>
                {feature.name}
              </td>
              <td className="py-4 px-4 font-mono-data text-xs text-slate-300">
                <span className="px-2 py-0.5 border border-[#1e293b] bg-[#181b25]">
                  {feature.code}
                </span>
              </td>
              <td className="py-4 px-4 font-mono-data text-xs text-white">
                ${parseFloat(feature.unit_price).toFixed(2)}
              </td>
              <td className="py-4 px-4 font-mono-data text-xs text-slate-400">
                {feature.max_unit_limit} units
              </td>
              <td className="py-4 px-4 text-right">
                {feature.is_active ? (
                  <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400 uppercase font-mono-data bg-emerald-500/10">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none"></span> ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 border border-rose-500/30 px-2 py-0.5 text-[10px] text-rose-400 uppercase font-mono-data bg-rose-500/10">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-none"></span> INACTIVE
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
