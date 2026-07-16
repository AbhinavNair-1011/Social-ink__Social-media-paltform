import { useParams } from "react-router-dom";

import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import UserList from "./UserList";

import { useFollowing } from "../hooks/useFollowing";

function FollowingPage({ userId }) {
  const { data = [], isLoading, isError } = useFollowing(userId);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load following"
        description="Please try again."
      />
    );
  }

  return (
  <div className="mx-auto max-w-4xl">
  <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 className="text-3xl font-bold text-slate-800">Following</h1>

    <p className="mt-2 text-sm text-slate-500">
      People this account follows.
    </p>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <UserList users={data} alternate="Not Following Anyone" />
  </div>
</div>
  );
}

export default FollowingPage;
