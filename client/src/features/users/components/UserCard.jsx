import { Link } from "react-router-dom";

import Avatar from "../../../shared/components/Avatar";

function UserCard({ user }) {
  return (
    <Link
      to={`/users/${user._id}`}
      className="block"
    >
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md">
        <Avatar
          src={user.profileImage}
          className="h-14 w-14"
        />

        <div>
          <h2 className="font-semibold text-slate-900">
            {user.name}
          </h2>

          <p className="text-sm text-slate-500">
            @{user.userName}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {user.bio || "No bio yet."}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserCard;