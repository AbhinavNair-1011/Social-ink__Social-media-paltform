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
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Followers</h1>

      <UserList users={data} alternate={"No Followers"} />
    </div>
  );
}

export default FollowersPage;
