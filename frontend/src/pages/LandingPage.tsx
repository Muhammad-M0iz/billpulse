import React from "react";
import { Link } from "react-router-dom";
import { usePlans } from "../hooks/usePlans";
import { PlanCard } from "../components/buyer/PlanCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

export const LandingPage: React.FC = () => {
  const { plans, isLoading } = usePlans();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      {/* TopNavBar Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-[#1e293b]/50">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="text-xl font-bold text-white tracking-tighter flex items-center gap-2">
            <div className="w-7 h-7 bg-white text-[#0b0f19] font-black flex items-center justify-center text-xs tracking-tighter">
              BP
            </div>
            BillPulse
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium">
            <a className="text-slate-400 hover:text-white transition-colors duration-200" href="#features">
              Features
            </a>
            <a className="text-slate-400 hover:text-white transition-colors duration-200" href="#plans">
              Plans Catalog
            </a>
            <a className="text-slate-400 hover:text-white transition-colors duration-200" href="#portals">
              Dashboard
            </a>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/buyer/dashboard"}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-5 py-2 border border-[#1e293b] text-white font-semibold text-xs uppercase tracking-wider rounded-none transition-all hover:border-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-white text-[#0b0f19] font-semibold text-xs uppercase tracking-wider rounded-none transition-all hover:bg-slate-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-24 flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-20 flex flex-col items-center text-center max-w-6xl mx-auto min-h-[65vh] justify-center">
          <div className="mb-6 animate-fade-in">
            <span className="font-mono-data text-[10px] uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full text-white/60">
              Core Infrastructure v2.4
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl text-white font-light mb-6 max-w-4xl tracking-tight leading-tight">
            Automated Recurring Billing &amp; Real-Time Usage Metering
          </h1>
          <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl font-light leading-relaxed">
            Charge monthly plan fees on designated billing days, meter feature consumption, and automatically calculate overuse extra charges.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <a
              href="#plans"
              className="px-8 py-3.5 bg-white text-[#0b0f19] text-xs font-semibold uppercase tracking-wider transition-all hover:bg-white/90"
            >
              Browse Subscription Plans
            </a>
            {isAuthenticated ? (
              <Link
                to={isAdmin ? "/admin/dashboard" : "/buyer/dashboard"}
                className="px-8 py-3.5 border border-[#1e293b] text-white text-xs font-semibold uppercase tracking-wider transition-all hover:border-white"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-8 py-3.5 border border-[#1e293b] text-white text-xs font-semibold uppercase tracking-wider transition-all hover:border-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </section>

        {/* Features Section (API Matched) */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1e293b]/30" id="features">
          <div className="mb-12">
            <span className="text-xs font-mono-data text-slate-400 uppercase tracking-widest block mb-1">
              Protocol Capabilities
            </span>
            <h2 className="text-3xl font-light text-white">Precision Billing Engine</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recurring */}
            <div className="minimal-card p-8 flex flex-col justify-between bg-[#181b25] transition-all duration-300">
              <div>
                <span className="material-symbols-outlined text-white mb-6 block" style={{ fontSize: "28px" }}>
                  update
                </span>
                <h3 className="text-xl font-medium text-white mb-3">Recurring Monthly Billing</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  An automatic cycle runner executing on <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono-data text-white">billing_day</code> (1-28). Ensures consistent revenue capture without manual intervention.
                </p>
              </div>
            </div>
            {/* Metering */}
            <div className="minimal-card p-8 flex flex-col justify-between bg-[#181b25] transition-all duration-300">
              <div>
                <span className="material-symbols-outlined text-white mb-6 block" style={{ fontSize: "28px" }}>
                  speed
                </span>
                <h3 className="text-xl font-medium text-white mb-3">Usage Metering</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Real-time feature usage logging with automated limit comparison. Our engine triggers precise overuse rate calculations as thresholds are crossed.
                </p>
              </div>
            </div>
            {/* Management */}
            <div className="minimal-card p-8 flex flex-col justify-between bg-[#181b25] transition-all duration-300">
              <div>
                <span className="material-symbols-outlined text-white mb-6 block" style={{ fontSize: "28px" }}>
                  account_tree
                </span>
                <h3 className="text-xl font-medium text-white mb-3">Plan &amp; Feature Management</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Dynamic plan creation architecture. Multi-feature bundling with individual unit limits allows for granular monetization strategies.
                </p>
              </div>
            </div>
            {/* History */}
            <div className="minimal-card p-8 flex flex-col justify-between bg-[#181b25] transition-all duration-300">
              <div>
                <span className="material-symbols-outlined text-white mb-6 block" style={{ fontSize: "28px" }}>
                  history_edu
                </span>
                <h3 className="text-xl font-medium text-white mb-3">Transaction History</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  High-performance paginated cursor transaction logs. Immutable audit trails for both buyer verification and administrative reconciliation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Catalog (Pricing Matrix) */}
        <section className="py-20 bg-[#0a0e17]/50 border-y border-[#1e293b]/30" id="plans">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <span className="text-xs font-mono-data text-slate-400 uppercase tracking-widest block mb-1">
                Pricing Matrix
              </span>
              <h2 className="text-3xl font-light text-white">Plans Catalog</h2>
            </div>

            {isLoading ? (
              <LoadingSpinner label="Fetching live pricing matrix..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Role Based Access Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto" id="portals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Admin Portal */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-400">admin_panel_settings</span> Admin Portal
                </h2>
                <p className="text-sm text-slate-400">Operations dashboard for finance and engineering teams.</p>
              </div>
              <div className="space-y-4">
                <div className="glass-panel p-6 border-l-2 border-l-white bg-[#181b25]/80">
                  <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">Usage Logger</h4>
                  <p className="text-xs text-slate-400">Monitor feature consumption telemetry across the entire user base in real-time.</p>
                </div>
                <div className="glass-panel p-6 border-l-2 border-l-white/40 bg-[#181b25]/80 flex justify-between items-center">
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">Plan Creator &amp; Billing Runner</span>
                  <Link to="/admin" className="text-xs font-mono-data text-white hover:underline">
                    Access Hub &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Buyer Portal */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">person</span> Buyer Portal
                </h2>
                <p className="text-sm text-slate-400">Self-service interface for end-users to manage their accounts.</p>
              </div>
              <div className="space-y-4">
                <div className="glass-panel p-6 border-l-2 border-l-emerald-400 bg-[#181b25]/80">
                  <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">Active Subscriptions</h4>
                  <p className="text-xs text-slate-400">Clear visibility into current quotas, billing days, and upcoming cycles.</p>
                </div>
                <div className="glass-panel p-6 border-l-2 border-l-emerald-400/40 bg-[#181b25]/80 flex justify-between items-center">
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">Browse Plans &amp; Payment History</span>
                  <Link to="/buyer/dashboard" className="text-xs font-mono-data text-emerald-400 hover:underline">
                    Access Portal &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 border-t border-[#1e293b]/30 overflow-hidden relative">
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">Modernize your revenue stack.</h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto font-light">
              Integrated metering and billing that scales from your first user to IPO.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
              {isAuthenticated ? (
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/buyer/dashboard"}
                  className="px-10 py-3.5 bg-white text-[#0b0f19] font-semibold text-xs uppercase tracking-wider transition-all hover:scale-[1.02]"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-10 py-3.5 bg-white text-[#0b0f19] font-semibold text-xs uppercase tracking-wider transition-all hover:scale-[1.02]"
                >
                  Register Account
                </Link>
              )}
            </div>
          </div>
          {/* Subtle Ambient Light */}
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0f19]/80 border-t border-[#1e293b]/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full px-6 py-16 max-w-7xl mx-auto">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xs font-bold text-white uppercase tracking-widest mb-4">BillPulse</div>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              The precision billing engine for modern engineering teams.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-widest mb-3">API Reference</div>
            <ul className="space-y-2 text-xs text-slate-400 font-mono-data">
              <li><a className="hover:text-white transition-colors" href="#features">Billing Runner</a></li>
              <li><a className="hover:text-white transition-colors" href="#features">Usage Logging</a></li>
              <li><a className="hover:text-white transition-colors" href="#features">Auth Scopes</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-widest mb-3">Portal</div>
            <ul className="space-y-2 text-xs text-slate-400 font-mono-data">
              <li><Link className="hover:text-white transition-colors" to="/admin">Admin Dashboard</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/buyer/dashboard">Buyer View</Link></li>
              <li><span className="text-emerald-400">System Active</span></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-widest mb-3">Legal</div>
            <ul className="space-y-2 text-xs text-slate-400 font-mono-data">
              <li><span className="hover:text-white cursor-pointer">Privacy Protocol</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Scale</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1e293b]/20 py-6 px-6 text-center">
          <p className="font-mono-data text-[10px] text-white/30 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} BillPulse Core. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
