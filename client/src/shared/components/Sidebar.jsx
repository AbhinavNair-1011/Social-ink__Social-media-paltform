import { NavLink } from "react-router-dom";
function Sidebar({ isOpen, onClose }) {
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
        className="absolute right-2 top-2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
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

      <NavLink
        to="/profile"
        onClick={onClose}
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

      <NavLink to="/feed" onClick={onClose} className={getNavClass}>
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
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 border-r bg-slate-50 p-2 lg:block">
   
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
