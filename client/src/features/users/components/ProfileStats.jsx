import { Link } from "react-router-dom";

function ProfileStats({
  userId,
  posts = 0,
  followers = 0,
  following = 0,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex  gap-3">
        <div className="flex-1  bg-slate-100  py-3 text-center">
          <p className="text-xl font-bold text-slate-900">
            {posts}
          </p>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Posts
          </p>
        </div>

        <Link
          to={`/users/${userId}/followers`}
          className="flex-1 border-r border-slate-200 py-3 text-center transition bg-slate-100 hover:bg-slate-200"
        >
          <p className="text-xl font-bold text-slate-900">
            {followers}
          </p>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Followers
          </p>
        </Link>

        <Link
          to={`/users/${userId}/following`}
          className="flex-1 py-3 text-center transition bg-slate-100 hover:bg-slate-200"
        >
          <p className="text-xl font-bold text-slate-900">
            {following}
          </p>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Following
          </p>
        </Link>
      </div>
    </div>
  );
}

export default ProfileStats;