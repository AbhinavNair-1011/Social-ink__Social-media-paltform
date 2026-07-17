import { useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import useLogout from "../../features/auth/hooks/useLogout";

function Sidebar({ isOpen, onClose }) {
  const { mutate: logout, isPending } = useLogout();

  const queryClient = useQueryClient();

  function handleProfileClick() {
    queryClient.invalidateQueries({
      queryKey: ["my-posts"],
    });
    queryClient.invalidateQueries({
      queryKey: ["profile"],
    });
    onClose();
  }
  function handleFeedClick() {
    queryClient.invalidateQueries({
      queryKey: ["feed"],
    });
    onClose();
  }

  const getNavClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 transition ${
      isActive
        ? "bg-indigo-100 font-semibold text-indigo-600"
        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
    }`;
  const Links = () => (
    <nav className="relative space-y-2 p-2">
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
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
            d="M6 6l12 12M18 6L6 18"
          />
        </svg>
      </button>

      <h2 className="mb-6 px-3 pt-2 text-lg font-bold text-slate-800">Menu</h2>
      <button
        onClick={() => logout()}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-red-400 px-2 py-2  mb-3 text-sm font-medium text-white transition hover:bg-red-500 w-full"
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H9" />
        </svg>

        <span>{isPending ? "Logging out..." : "Logout"}</span>
      </button>

      <NavLink
        to="/profile"
        onClick={handleProfileClick}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-3 transition ${
            isActive
              ? "bg-indigo-100 font-semibold text-indigo-600"
              : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          }`
        }
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
            d="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z"
          />
        </svg>

        <span>Profile</span>
      </NavLink>

      <NavLink to="/feed" onClick={handleFeedClick} className={getNavClass}>
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
            d="M3 12h18M3 6h18M3 18h18"
          />
        </svg>

        <span>Feed</span>
      </NavLink>
      <NavLink to="/chat" onClick={onClose} className={getNavClass}>
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
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          />
          <circle cx="9" cy="7" r="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          />
        </svg>

        <span>Chat</span>
      </NavLink>
      <NavLink to="/users" onClick={onClose} className={getNavClass}>
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
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          />
          <circle cx="9" cy="7" r="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          />
        </svg>

        <span>Users</span>
      </NavLink>
    </nav>
  );

  return (
    <>
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 border-r bg-slate-50 p-2 md:block z-40">
        <Links />
      </aside>

      {isOpen && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden "
          />

          <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-slate-50 p-2 shadow-xl lg:hidden">
            <Links />
          </aside>
        </>
      )}
    </>
  );
}

export default Sidebar;
