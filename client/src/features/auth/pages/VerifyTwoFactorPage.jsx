import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "../components/AuthHeader";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

import { verifyEmailSchema, verifyTwoFactorSchema } from "../schemas/authSchemas";

import { useVerifyTwoFactor } from "../hooks/useVerifyTwoFactor";

function VerifyTwoFactorPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const { mutate, isPending } = useVerifyTwoFactor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyTwoFactorSchema),

    defaultValues: {
      email,
      code: "",
    },
  });

  function onSubmit(data) {
    mutate(data, {
      onSuccess: () => {
        navigate("/feed", {
          replace: true,
        });
      },
    });
  }

  return (
    <>
      <AuthHeader
        title="Two-Factor Authentication"
        subtitle="Enter the verification code sent to your email."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          register={register("email")}
          error={errors.email}
          readOnly
        />

        <Input
          id="code"
          label="Verification Code"
          placeholder="123456"
          register={register("code")}
          error={errors.code}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </>
  );
}

export default VerifyTwoFactorPage;
