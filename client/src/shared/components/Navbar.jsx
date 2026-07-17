import Logo from "./Logo";

import { useLogout } from "../../features/auth/hooks/useLogout";
import NotificationBell from "../../features/notification/components/NotificationBell";

function Navbar({ onOpenSidebar }) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <Logo />
      </div>

<div className="flex">
  <NotificationBell />
   <button
        onClick={() => logout()}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-2 py-2 text-sm font-medium text-white transition hover:bg-red-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 17l5-5-5-5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12H9"
          />
        </svg>

        <span>
          {isPending ? "Logging out..." : "Logout"}
        </span>
      </button>
</div>
   
    </header>
  );
}

export default Navbar;