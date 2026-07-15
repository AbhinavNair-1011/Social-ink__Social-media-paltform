import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import EditProfileModal from "../components/EditProfileModal";

import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useState, useRef } from "react";
import { useUploadProfileImage } from "../hooks/useUploadProfileImage";
function ProfilePage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: uploadImage } = useUploadProfileImage();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data.user) {
    return (
      <EmptyState
        title="Profile not found"
        description="Unable to load your profile."
      />
    );
  }

  function handleImageUpload(file) {
    if (!file) return;

    uploadImage(file, {
      onSuccess: (updatedData) => {
        queryClient.setQueryData(["profile"], updatedData);

        queryClient.setQueryData(["me"], updatedData.user);

        toast.success("Profile picture updated.");
      },

      onError: (error) => {
        toast.error(error.response?.data?.error?.message);
      },
    });
  }
  function handleUpdate(data) {
    updateProfile(data, {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData(["profile"], updatedUser);
        
        queryClient.setQueryData(["me"], updatedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully.");
      },

      onError: (error) => {
        toast.error(error.response?.data?.error?.message);
      },
    });
  }

  return (
    <div className="">
      <ProfileHeader
        user={data.user}
        onEdit={() => setIsEditing(true)}
        onImageChange={handleImageUpload}
      />

      <ProfileStats
        userId={data.user._id}
        posts={data.postsCount}
        followers={data.followersCount}
        following={data.followingCount}
      />

      {isEditing && (
        <EditProfileModal
          user={data.user}
          onClose={() => setIsEditing(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

export default ProfilePage;
