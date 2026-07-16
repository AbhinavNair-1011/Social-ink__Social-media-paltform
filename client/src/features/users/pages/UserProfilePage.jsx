import { Navigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState, useRef } from "react";

import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import FollowButton from "../components/FollowButton";

import { useUserProfile } from "../hooks/useUserProfile";
import { useFollow } from "../hooks/useFollow";
import { useUnfollow } from "../hooks/useUnfollow";
import UserPosts from "../components/UserPosts";
import FollowersList from "../components/FollowersList";
import FollowingList from "../components/FollowingList";

function UserProfilePage() {
  const { userId } = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useUserProfile(userId);

  const { mutate: follow } = useFollow();

  const { mutate: unfollow } = useUnfollow();
  const [activeTab, setActiveTab] = useState("posts");

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="User not found"
        description="Unable to load this profile."
      />
    );
  }

  function handleFollow() {
    follow(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-profile", userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
        toast.success("Following user.");
      },

      onError: (error) => {
        toast.error(error.response?.data?.error?.message);
      },
    });
  }

  function handleUnfollow() {
    unfollow(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-profile", userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });

        toast.success("Unfollowed user.");
      },

      onError: (error) => {
        toast.error(error.response?.data?.error?.message);
      },
    });
  }

  if (data.isMe) {
    return <Navigate to="/profile" replace />;
  }
  return (
    <div className="">
      <ProfileHeader user={data.user}>
        <FollowButton
          isFollowing={data.isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      </ProfileHeader>

      <ProfileStats
        userId={data.user._id}
        posts={data.postsCount}
        followers={data.followersCount}
        following={data.followingCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-8">
        {activeTab === "posts" && <UserPosts userId={userId} />}

        {activeTab === "followers" && <FollowersList userId={userId} />}

        {activeTab === "following" && <FollowingList userId={userId} />}
      </div>
    </div>
  );
}

export default UserProfilePage;
