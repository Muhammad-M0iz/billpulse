import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { createUserMutation, loginUserMutation } from "../../client/@tanstack/react-query.gen";
import { uploadFile, type UserRole } from "../../client";
import { registerSchema, type RegisterSchemaType } from "../../schemas/authSchemas";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export const RegisterForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "buyer" as UserRole,
    },
  });

  const selectedRole = watch("role");

  const createUserMut = useMutation({
    ...createUserMutation(),
  });

  const loginMut = useMutation({
    ...loginUserMutation(),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      let uploadedProfileImgUrl: string | undefined = undefined;
      const file = data.profile_file?.[0];

      if (file) {
        setIsUploading(true);
        const uploadRes = await uploadFile({
          body: { file },
        });
        setIsUploading(false);
        uploadedProfileImgUrl = uploadRes.data?.url;
      }

      await createUserMut.mutateAsync({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: (data.role as UserRole) || "buyer",
          profile_img: uploadedProfileImgUrl,
        },
      });

      toast.success("Account created successfully!");

      // Auto login after registration
      const tokenRes = await loginMut.mutateAsync({
        body: {
          email: data.email,
          password: data.password,
        },
      });

      if (tokenRes?.token?.access_token && tokenRes?.user) {
        login(tokenRes.token.access_token, tokenRes.user);
        if (tokenRes.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/buyer/dashboard");
        }
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      setIsUploading(false);
      toast.error(err?.message || "Failed to register account");
    }
  };

  return (
    <div className="w-full max-w-md border border-[#1e293b] bg-[#0b0f19]/80 backdrop-blur-sm p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Title Section */}
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-light text-white tracking-tight">Create an Account</h1>
        <p className="text-xs font-mono-data text-slate-400 opacity-70 uppercase tracking-widest">
          Join BillPulse Subscription Network
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 group-focus-within:text-white transition-colors mb-1">
            Full Name
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-white">
              person
            </span>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-600 p-0 text-sm font-mono-data"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 group-focus-within:text-white transition-colors mb-1">
            Email Address
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-white">
              mail
            </span>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-600 p-0 text-sm font-mono-data"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="group">
          <label className="block text-xs font-mono-data text-slate-400 group-focus-within:text-white transition-colors mb-1">
            Password
          </label>
          <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 group-focus-within:border-white transition-all">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-white">
              lock
            </span>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-600 p-0 text-sm font-mono-data"
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-rose-400 font-mono-data">{errors.password.message}</p>
          )}
        </div>

        {/* Account Role Toggle */}
        <div className="space-y-2">
          <label className="block text-xs font-mono-data text-slate-400 uppercase tracking-wider">
            Account Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue("role", "buyer")}
              className={`py-2.5 px-4 flex items-center justify-center gap-2 font-mono-data text-xs transition-all uppercase font-semibold cursor-pointer ${
                selectedRole === "buyer"
                  ? "bg-white text-[#0b0f19]"
                  : "border border-[#1e293b] text-slate-400 hover:border-white"
              }`}
            >
              <span className="material-symbols-outlined text-base">verified_user</span> Buyer
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "admin")}
              className={`py-2.5 px-4 flex items-center justify-center gap-2 font-mono-data text-xs transition-all uppercase font-semibold cursor-pointer ${
                selectedRole === "admin"
                  ? "bg-white text-[#0b0f19]"
                  : "border border-[#1e293b] text-slate-400 hover:border-white"
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span> Admin
            </button>
          </div>
          <select {...register("role")} className="hidden">
            <option value="buyer">Buyer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Profile Image File Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-mono-data text-slate-400 uppercase tracking-wider">
            Profile Image <span className="text-slate-600 font-normal">(Optional)</span>
          </label>
          <label className="border border-dashed border-[#1e293b] p-4 flex flex-col items-center justify-center gap-1 hover:border-white transition-colors cursor-pointer group block">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-10 h-10 rounded-full object-cover border border-white mx-auto"
              />
            ) : (
              <>
                <span className="material-symbols-outlined text-slate-500 group-hover:text-white text-2xl">
                  upload_file
                </span>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors font-mono-data">
                  Choose Avatar File
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              {...register("profile_file", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewUrl(URL.createObjectURL(file));
                  } else {
                    setPreviewUrl(null);
                  }
                },
              })}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createUserMut.isPending || isUploading}
          className="w-full bg-white text-[#0b0f19] py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-200 transition-all group disabled:opacity-50 cursor-pointer"
        >
          {createUserMut.isPending || isUploading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              Creating Account...
            </>
          ) : (
            <>
              <span>Register Account</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline underline-offset-4 font-mono-data">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
