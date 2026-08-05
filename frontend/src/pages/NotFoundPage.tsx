import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { FileQuestion, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="glass-panel p-10 rounded-3xl border border-slate-800 max-w-md w-full text-center space-y-4">
          <div className="p-4 rounded-full bg-violet-500/10 text-violet-400 w-fit mx-auto border border-violet-500/30">
            <FileQuestion className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">404 Page Not Found</h1>
          <p className="text-sm text-slate-400">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
