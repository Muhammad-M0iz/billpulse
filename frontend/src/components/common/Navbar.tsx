import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../utils/avatar";

const AvatarImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [failedAttempts, setFailedAttempts] = useState(0);

  let currentSrc = src;
  if (failedAttempts === 1) {
    currentSrc = src.startsWith("/") ? `http://localhost:8000${src}` : src;
  } else if (failedAttempts === 2) {
    currentSrc = src.startsWith("/") ? `${window.location.origin}${src}` : src;
  }

  if (failedAttempts >= 3) {
    return <span className="material-symbols-outlined text-slate-400 text-sm">person</span>;
  }

  return (
    <img
      src={currentSrc}
      alt={alt || "User Avatar"}
      className="w-full h-full object-cover"
      onError={() => {
        console.warn(`[Navbar] Avatar failed to load from '${currentSrc}'. Trying fallback...`);
        setFailedAttempts((prev) => prev + 1);
      }}
    />
  );
};

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, isAdmin, isBuyer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fullAvatarUrl = getAvatarUrl(user?.profile_img);

  const navItemClass = (path: string) =>
    `font-body-lg text-sm transition-all duration-200 ${
      location.pathname === path
        ? "text-white font-semibold border-b border-white pb-0.5"
        : "text-slate-400 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-[#1e293b]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 bg-white text-[#0b0f19] font-black flex items-center justify-center text-xs tracking-tighter">
              BP
            </div>
            BillPulse
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex gap-6 items-center">
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className={navItemClass("/admin/dashboard")}>
                    Dashboard
                  </Link>
                  <Link to="/admin/plans" className={navItemClass("/admin/plans")}>
                    Plans
                  </Link>
                  <Link to="/admin/features" className={navItemClass("/admin/features")}>
                    Features
                  </Link>
                  <Link to="/admin/usage" className={navItemClass("/admin/usage")}>
                    Log Usage
                  </Link>
                  <Link to="/admin/transactions" className={navItemClass("/admin/transactions")}>
                    Transactions
                  </Link>
                </>
              )}

              {isBuyer && (
                <>
                  <Link to="/buyer/dashboard" className={navItemClass("/buyer/dashboard")}>
                    Dashboard
                  </Link>
                  <Link to="/buyer/plans" className={navItemClass("/buyer/plans")}>
                    Browse Plans
                  </Link>
                  <Link to="/buyer/subscriptions" className={navItemClass("/buyer/subscriptions")}>
                    My Subscriptions
                  </Link>
                  <Link to="/buyer/transactions" className={navItemClass("/buyer/transactions")}>
                    Transactions
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* User Status / Action Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 pr-4 border-r border-[#1e293b]">
                <div className="w-8 h-8 rounded-full border border-[#1e293b] flex items-center justify-center overflow-hidden bg-[#181b25]">
                  {fullAvatarUrl ? (
                    <AvatarImage src={fullAvatarUrl} alt={user?.name} />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                  )}
                </div>
                <span className="text-xs font-mono-data text-slate-300">{user?.name}</span>
                <span className="text-[10px] uppercase font-mono-data px-1.5 py-0.5 border border-[#1e293b] text-slate-400">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-mono-data text-slate-400 hover:text-white uppercase tracking-widest cursor-pointer transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-white text-[#0b0f19] font-semibold text-xs uppercase tracking-wider rounded-none transition-all hover:bg-slate-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
