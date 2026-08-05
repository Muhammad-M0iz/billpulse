import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="glass-panel p-10 rounded-3xl border border-rose-500/30 max-w-md w-full text-center space-y-4">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 w-fit mx-auto border border-rose-500/30">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">403 Access Denied</h1>
          <p className="text-sm text-slate-400">
            You do not have permission to view this resource or perform this administrative action.
          </p>
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
