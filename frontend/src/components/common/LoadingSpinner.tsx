import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-3" />
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  );
};
