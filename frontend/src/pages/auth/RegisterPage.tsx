import React from "react";
import { Link } from "react-router-dom";
import { RegisterForm } from "../../components/auth/RegisterForm";

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white text-[#0b0f19] w-8 h-8 flex items-center justify-center font-bold tracking-tighter text-sm">
            BP
          </div>
          <span className="text-lg font-bold tracking-tight text-white uppercase">BillPulse</span>
        </Link>
        <div className="hidden md:block">
          <span className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
            User Registration Network
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <RegisterForm />
      </main>

      {/* Page Footer */}
      <footer className="w-full py-6 border-t border-[#1e293b]/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-xs font-mono-data text-slate-400/70 tracking-[0.2em] text-center uppercase">
            BILLPULSE USER REGISTRATION &amp; IDENTITY SYSTEM
          </p>
        </div>
      </footer>
    </div>
  );
};
