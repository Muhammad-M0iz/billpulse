import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../client";
import { createUserMutation } from "../client/@tanstack/react-query.gen";
import type { UserCreate, UserRole } from "../client";
import { zUserCreate } from "../client/zod.gen";

type FormValues = Omit<UserCreate, "role"> & {
  role?: UserRole;
  profile_image?: FileList;
};

export function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(zUserCreate),
    defaultValues: {
      role: "buyer" as UserRole,
    },
  });

  const { mutate: createUser, isPending, isError, error, isSuccess } = useMutation({
    ...createUserMutation(),
  });

  const onSubmit = async (data: FormValues) => {
    let profileImgUrl: string | undefined = undefined;
    const imageFile = data.profile_image?.[0];

    if (imageFile) {
      const uploadRes = await uploadFile({
        body: {
          file: imageFile,
        },
      });
      profileImgUrl = uploadRes.data?.url;
    }

    createUser({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role ?? ("buyer" as UserRole),
        profile_img: profileImgUrl,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          {/* Clean register calls without inline duplicate constraints */}
          <input
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="user@example.com"
            {...register("email")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Account Role
          </label>
          <select
            {...register("role")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
          >
            <option value="buyer">Buyer</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Profile Image <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("profile_image")}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? "Creating User..." : "Register User"}
        </button>

        {/* Feedback */}
        {isSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
            User created successfully!
          </div>
        )}

        {isError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {(error as Error)?.message || "Failed to create user"}
          </div>
        )}
      </form>
    </div>
  );
}