import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { loginSchema } from "../schemas/loginSchema";
import { useLogin } from "../hooks/useLogin";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

function LoginForm() {
  const navigate = useNavigate();

  const { mutate, isPending } = useLogin();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(formData) {
    mutate(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["me"],
        });

        toast.success("Login successful.");

        navigate("/feed");
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.error?.message || "Something went wrong.",
        );
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="email"
        label="Email"
        type="email"
        register={register("email")}
        error={errors.email}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        register={register("password")}
        error={errors.password}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}

export default LoginForm;
