import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-white p-6 lg:block">
      <nav className="space-y-4">
        <Link
          to="/feed"
          className="block rounded-lg p-2 hover:bg-gray-100"
        >
          Feed
        </Link>

        <Link
          to="/profile"
          className="block rounded-lg p-2 hover:bg-gray-100"
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;