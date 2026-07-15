import Logo from "./Logo";
import Avatar from "./Avatar";
import Button from "./Button";

import { useLogout } from "../../features/auth/hooks/useLogout";

function Navbar() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <Logo />

      <div className="flex items-center gap-4">
        <Button
          onClick={() => logout()}
          disabled={isPending}
          className="bg-red-500 hover:bg-red-600"
        >
          {isPending ? "Logging out..." : "Logout"}
        </Button>

        <Avatar />
      </div>
    </header>
  );
}

export default Navbar;