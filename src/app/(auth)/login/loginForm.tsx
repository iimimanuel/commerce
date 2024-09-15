"use client";

import { useForm } from "react-hook-form";
import { loginSchema, loginValue } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState<String>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<loginValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    setError(undefined);
    startTransition(async () => {
      const { error } = await login(values);
      if (error) setError(error);
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full max-w-sm flex-col items-center space-y-4 p-4"
    >
      {/* Username Input */}
      <div className="form-control w-full">
        <label htmlFor="username" className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          {...form.register("username")}
          className="input input-bordered w-full"
        />
        {form.formState.errors.username && (
          <p className="mt-1 text-sm text-error">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="form-control w-full">
        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...form.register("password")}
          className="input input-bordered w-full"
        />
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-error">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`btn btn-primary w-full ${isPending ? "loading" : ""}`}
        disabled={isPending}
      >
        {isPending ? "Logging in..." : "Login"}
      </button>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </form>
  );
}
