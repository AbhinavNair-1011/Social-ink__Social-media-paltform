import Button from "../../../shared/components/Button";

function FollowButton({ isFollowing, onFollow, onUnfollow, isPending }) {
  if (isFollowing) {
    return (
      <Button
        onClick={onUnfollow}
        disabled={isPending}
        className="bg-slate-700 hover:bg-slate-800"
      >
        Unfollow
      </Button>
    );
  }

  return (
    <Button onClick={onFollow} disabled={isPending} className=" w-24">
      Follow
    </Button>
  );
}

export default FollowButton;
