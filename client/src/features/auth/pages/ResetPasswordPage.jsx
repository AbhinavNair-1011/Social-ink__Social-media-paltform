import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "../components/AuthHeader";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

import { resetPasswordSchema } from "../schemas/authSchemas";

import { useResetPassword } from "../hooks/useResetPassword";

function ResetPasswordPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const { mutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(data) {
    mutate(
      {
        ...data,
  
      },
      {
        onSuccess: () => {
          navigate("/login");
        },
      },
    );
  }

  return (
<>
  <AuthHeader
    title="Reset Password"
    subtitle="Enter the verification code sent to your email and choose a strong new password."
  />

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="mt-8 space-y-6"
  >
    <Input
      id="code"
      label="Verification Code"
      placeholder="123456"
      register={register("code")}
      error={errors.code}
    />

    <Input
      id="password"
      type="password"
      label="New Password"
      placeholder="••••••••"
      register={register("password")}
      error={errors.password}
    />

    <Button
      type="submit"
      disabled={isPending}
      className="w-full"
    >
      {isPending
        ? "Updating Password..."
        : "Reset Password"}
    </Button>
  </form>

  <div className="mt-8 border-t border-slate-200 pt-6 text-center">
    <p className="text-sm text-slate-500">
      Back to{" "}
      <Link
        to="/login"
        className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
      >
        Sign In
      </Link>
    </p>
  </div>
</>
  );
}

export default ResetPasswordPage;
