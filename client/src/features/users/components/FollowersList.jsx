import { useParams } from "react-router-dom";

import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import UserList from "./UserList";

import { useFollowers } from "../hooks/useFollowers";

function FollowersPage({userId}) {
  

  const { data = [], isLoading, isError } = useFollowers(userId);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load followers"
        description="Please try again."
      />
    );
  }

  return (
   <div className="mx-auto max-w-4xl">
  <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 className="text-3xl font-bold text-slate-800">Followers</h1>

    <p className="mt-2 text-sm text-slate-500">
      People who follow this account.
    </p>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <UserList users={data} alternate="No Followers" />
  </div>
</div>
  );
}

export default FollowersPage;
