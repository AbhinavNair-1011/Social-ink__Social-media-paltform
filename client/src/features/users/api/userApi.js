import api from "../../../app/api/axios";

export async function getMyProfile() {
  const response = await api.get("/users/me");

  return response.data.data.user;
}

export async function updateProfile(profileData) {
  const response = await api.patch(
    "/users/me",
    profileData
  );

  return response.data.data.user;
}