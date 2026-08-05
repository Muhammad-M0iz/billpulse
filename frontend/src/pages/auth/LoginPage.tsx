import React from "react";
import { Link } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Top Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white text-[#0b0f19] font-bold px-2 py-1 text-sm tracking-tighter">
            BP
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">BillPulse</span>
        </Link>
        <div className="hidden md:block">
          <span className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
            Global Infrastructure
          </span>
        </div>
      </header>

      {/* Centered Card Container */}
      <main className="flex-grow flex items-center justify-center px-6 py-12 w-full">
        <LoginForm />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center max-w-7xl mx-auto">
        <div className="border-t border-[#1e293b] pt-6">
          <p className="text-xs font-mono-data text-slate-400 uppercase tracking-[0.2em]">
            BillPulse Security &amp; Authentication Gateway
          </p>
          <p className="font-mono-data text-[10px] text-slate-600 opacity-40 mt-1">
            NODE_SEC_V4 // IP: 192.168.1.1 // TLS 1.3
          </p>
        </div>
      </footer>
    </div>
  );
};
