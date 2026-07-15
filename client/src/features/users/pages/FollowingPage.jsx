import { useParams } from "react-router-dom";

import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import UserList from "../components/UserList";

import { useFollowing } from "../hooks/useFollowing";

function FollowingPage() {
  const { userId } = useParams();

  const {
    data = [],
    isLoading,
    isError,
  } = useFollowing(userId);

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
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        Following
      </h1>

      <UserList users={data} />
    </div>
  );
}

export default FollowingPage;