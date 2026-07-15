import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "../components/AuthHeader";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

import { changeEmailSchema } from "../schemas/authSchemas";

import { useChangeEmail } from "../hooks/useChangeEmail";

function ChangeEmailPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const oldEmail = location.state?.email || "";

  const { mutate, isPending } = useChangeEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changeEmailSchema),

    defaultValues: {
      oldEmail,
      newEmail: "",
    },
  });

  function onSubmit(data) {
    mutate(data, {
      onSuccess: () => {
        navigate("/verify-email", {
          state: {
            email: data.newEmail,
          },
        });
      },
    });
  }

  return (
   <>
  <AuthHeader
    title="Change Email"
    subtitle="Update your email address and we'll send a new verification code to the new address."
  />

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="mt-8 space-y-6"
  >
    <Input
      id="oldEmail"
      label="Current Email Address"
      type="email"
      register={register("oldEmail")}
      error={errors.oldEmail}
      disabled
      inputClassName="cursor-not-allowed bg-slate-100 text-slate-500"
    />

    <Input
      id="newEmail"
      label="New Email Address"
      type="email"
      placeholder="john@example.com"
      register={register("newEmail")}
      error={errors.newEmail}
    />

    <Button
      type="submit"
      disabled={isPending}
      className="w-full"
    >
      {isPending
        ? "Updating Email..."
        : "Update Email"}
    </Button>
  </form>

  <div className="mt-8 border-t border-slate-200 pt-6 text-center">
    <p className="text-sm text-slate-500">
      Changed your mind?{" "}
      <Link
        to="/verify-email"
        state={{
          email: oldEmail,
        }}
        className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
      >
        Back to Verification
      </Link>
    </p>
  </div>
</>
  );
}

export default ChangeEmailPage;
