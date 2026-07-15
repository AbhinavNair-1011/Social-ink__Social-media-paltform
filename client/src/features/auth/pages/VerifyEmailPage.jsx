import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "../components/AuthHeader";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

import { verifyEmailSchema } from "../schemas/authSchemas";

import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendVerification } from "../hooks/useResendVerification";

function VerifyEmailPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const verifyMutation = useVerifyEmail();

  const resendMutation = useResendVerification();

 const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm({
  resolver: zodResolver(verifyEmailSchema),

  defaultValues: {
    email,
    code: "",
  },
});

  function onSubmit(data) {
    verifyMutation.mutate(data, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  }

  function handleResend() {
    resendMutation.mutate({
      email
    });
  }

  return (
<>
  <AuthHeader
    title="Verify Your Email"
    subtitle="Enter the verification code we sent to your email address to activate your Social Ink account."
  />

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="mt-8 space-y-6"
  >
    <Input
      id="email"
      label="Email Address"
      type="email"
      register={register("email")}
      error={errors.email}
      disabled
      inputClassName="cursor-not-allowed bg-slate-100 text-slate-500"
    />

    <Input
      id="code"
      label="Verification Code"
      placeholder="Enter 6-digit code"
      maxLength={6}
      register={register("code")}
      error={errors.code}
    />

    <Button
      type="submit"
      disabled={verifyMutation.isPending}
      className="w-full"
    >
      {verifyMutation.isPending
        ? "Verifying..."
        : "Verify Email"}
    </Button>
  </form>

  <div className="mt-6 flex items-center justify-between">
    <button
      type="button"
      onClick={handleResend}
      disabled={resendMutation.isPending}
      className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {resendMutation.isPending
        ? "Sending..."
        : "Resend Verification Code"}
    </button>
    <Link to="/login" className="text-indigo-600 transition hover:text-indigo-700 text-sm font-medium">
       Back to login
       </Link>
  </div>

  <div className="mt-8 border-t border-slate-200 pt-6 text-center">
    <p className="text-sm text-slate-500">
      Wrong email?{" "}
      <Link
        to="/change-email"
        state={{ email }}
        className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
      >
        Change Email
      </Link>

    </p>
  </div>
</>
  );
}

export default VerifyEmailPage;
