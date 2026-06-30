import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Button from "../../../shared/components/Button";
import { useLogout } from "../hooks/useLogout";

function LogoutButton() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useLogout();

  function handleLogout() {
    mutate(undefined, {
      onSuccess: async () => {
        await queryClient.removeQueries({
          queryKey: ["me"],
        });

        toast.success("Logged out.");

        navigate("/login");
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.error?.message ||
            "Something went wrong."
        );
      },
    });
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

export default LogoutButton;