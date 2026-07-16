import { Link } from "react-router-dom";
function ProfileStats({
  posts,
  followers,
  following,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 text-center transition ${
            activeTab === "posts" ? "bg-slate-100" : "hover:bg-slate-50"
          }`}
        >
          <p className="text-xl font-bold">{posts}</p>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Posts
          </p>
        </button>

        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 border-x border-slate-200 py-3 text-center transition ${
            activeTab === "followers" ? "bg-slate-100" : "hover:bg-slate-50"
          }`}
        >
          <p className="text-xl font-bold">{followers}</p>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Followers
          </p>
        </button>

        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-3 text-center transition ${
            activeTab === "following" ? "bg-slate-100" : "hover:bg-slate-50"
          }`}
        >
          <p className="text-xl font-bold">{following}</p>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Following
          </p>
        </button>
      </div>
    </div>
  );
}

export default ProfileStats;
