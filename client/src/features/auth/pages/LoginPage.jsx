import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import AuthHeader from "../components/AuthHeader";

import { loginSchema } from "../schemas/authSchemas";
import { useLogin } from "../hooks/useLogin";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useResendVerification } from "../hooks/useResendVerification";
import socket from "../../../app/socket";


function LoginPage() {
  const { mutate, isPending } = useLogin();
  const { mutate: sendVerification } = useResendVerification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data) {
    mutate(data, {
      onSuccess: (data) => {
        if (data.requiresTwoFactor) {
          navigate("/verify-2fa", {
            state: {
              email: data.email,
            },
          });
          return;
        } else {
          queryClient.setQueryData(["me"], data.user);

          toast.success("Logged in successfully.");
     
          navigate("/feed");
        }
      },

      onError: (error) => {
        toast.error(error.response?.data?.error?.message ?? "Login failed");

        if (error.response?.data?.error?.name == "verifyEmail") {
          sendVerification(
            { email: data.email },
            {
              onSuccess: () => {
                toast.success("Verification email sent");
              },
              onError: (error) => {
                return;
              },
            },
          );

          navigate("/verify-email", {
            state: {
              email: data.email,
            },
          });
        }
      },
    });
  }

  return (
    <>
      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to continue your journey with Social Ink."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          register={register("email")}
          error={errors.email}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          register={register("password")}
          error={errors.password}
        />

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </>
  );
}

export default LoginPage;
