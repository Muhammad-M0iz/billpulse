import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUserMutation } from "../../client/@tanstack/react-query.gen";
import { loginSchema, type LoginSchemaType } from "../../schemas/authSchemas";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const loginMut = useMutation({
    ...loginUserMutation(),
    onSuccess: (data) => {
      if (data?.token?.access_token && data?.user) {
        login(data.token.access_token, data.user);
        toast.success(`Welcome back, ${data.user.name}!`);

        if (from) {
          navigate(from, { replace: true });
        } else if (data.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/buyer/dashboard", { replace: true });
        }
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Invalid email or password");
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    loginMut.mutate({ body: data });
  };

  return (
    <div className="w-full max-w-[440px] border border-[#1e293b] bg-[#0b0f19]/80 backdrop-blur-sm p-6 md:p-8 shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-white mb-1">Sign in to BillPulse</h2>
        <p className="text-xs font-mono-data text-slate-400 uppercase tracking-widest">
          Authentication &amp; Subscription Portal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Input 1: Email Address */}
        <div className="group">
          <label
            htmlFor="email"
            className="text-xs font-mono-data text-slate-400 uppercase mb-1 block transition-colors group-focus-within:text-white"
          >
            Email Address
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 transition-all group-focus-within:border-white">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-white">
              mail
            </span>
            <input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register("email")}
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-white placeholder:text-slate-600 p-0 text-sm font-mono-data"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.email.message}</p>
          )}
        </div>

        {/* Input 2: Password */}
        <div className="group">
          <div className="flex justify-between items-end mb-1">
            <label
              htmlFor="password"
              className="text-xs font-mono-data text-slate-400 uppercase transition-colors group-focus-within:text-white"
            >
              Password
            </label>
          </div>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 transition-all group-focus-within:border-white">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-white">
              lock
            </span>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-white placeholder:text-slate-600 p-0 text-sm font-mono-data"
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginMut.isPending}
          className="w-full bg-white text-[#0b0f19] py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors group disabled:opacity-50 cursor-pointer"
        >
          {loginMut.isPending ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-sm">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#1e293b] text-center">
        <p className="text-xs text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-white hover:underline underline-offset-4 font-mono-data"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};
