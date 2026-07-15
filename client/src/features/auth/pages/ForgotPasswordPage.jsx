import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "../components/AuthHeader";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

import { forgotPasswordSchema } from "../schemas/authSchemas";

import { useForgotPassword } from "../hooks/useForgotPassword";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data) {
    mutate(data, {
      onSuccess: () => {
        navigate("/reset-password", {
          state: {
            email: data.email,
          },
        });
      },
    });
  }

  return (
<>
  <AuthHeader
    title="Forgot Password"
    subtitle="Enter your registered email address and we'll send you a verification code to reset your password."
  />

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="mt-8 space-y-6"
  >
    <Input
      id="email"
      label="Email Address"
      type="email"
      placeholder="john@example.com"
      register={register("email")}
      error={errors.email}
    />

    <Button
      type="submit"
      disabled={isPending}
      className="w-full"
    >
      {isPending
        ? "Sending Verification Code..."
        : "Send Verification Code"}
    </Button>
  </form>

  <div className="mt-8 border-t border-slate-200 pt-6 text-center">
    <p className="text-sm text-slate-500">
      Remember your password?{" "}
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

export default ForgotPasswordPage;
