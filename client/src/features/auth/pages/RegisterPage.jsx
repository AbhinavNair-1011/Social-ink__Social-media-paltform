import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "../components/AuthHeader";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

import { registerSchema } from "../schemas/authSchemas";

import { useRegister } from "../hooks/useRegister";
import toast from "react-hot-toast";
import { useResendVerification } from "../hooks/useResendVerification";

function RegisterPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useRegister();
const { mutate: sendVerification } = useResendVerification();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      twoFactorEnabled: false,
    },
  });

  function onSubmit(data) {
    mutate(data, {
      onSuccess: () => {
        toast.success("Registration successful. Please verify your email.");

        navigate("/verify-email", {
          state: {
            email: data.email,
          },
        });
      },
         onError: (error) => {
          console.log(error.response)
        toast.error(error.response?.data?.error?.message ?? "Login failed");

        if (error.response.data.error.name == "verifyEmail") {
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
    title="Create your account"
    subtitle="Join Social Ink and start connecting with people around the world."
  />

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="mt-8 space-y-6"
  >
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Input
        id="name"
        label="Full Name"
        placeholder="John Doe"
        register={register("name")}
        error={errors.name}
      />

      <Input
        id="userName"
        label="Username"
        placeholder="john_doe"
        register={register("userName")}
        error={errors.userName}
      />

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="john@example.com"
        register={register("email")}
        error={errors.email}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        register={register("password")}
        error={errors.password}
      />
    </div>

    <Input
      id="dob"
      type="date"
      label="Date of Birth"
      register={register("dob")}
      error={errors.dob}
    />

    <div className="rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
      <label className="flex cursor-pointer items-start gap-4">
        <input
          type="checkbox"
          {...register("twoFactorEnabled")}
          className="mt-1 h-5 w-5 accent-indigo-600"
        />

        <div>
          <h3 className="font-semibold text-slate-800">
            Enable Two-Factor Authentication
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600 hidden md:block">
            Add an extra layer of security to your account.
            Every login will require a one-time verification
            code sent to your email.
          </p>
        </div>
      </label>
    </div>

    <Button
      type="submit"
      disabled={isPending}
      className="mt-2 w-full"
    >
      {isPending
        ? "Creating your account..."
        : "Create Account"}
    </Button>
  </form>

  <div className="mt-8 border-t border-slate-200 pt-6 text-center">
    <p className="text-sm text-slate-500">
      Already have an account?
    </p>

    <Link
      to="/login"
      className="mt-2 inline-block font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
    >
      Sign in instead 
    </Link>
  </div>
</>
  );
}

export default RegisterPage;
