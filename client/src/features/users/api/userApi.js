import api from "../../../app/api/axios";

export async function getMyProfile() {
  const response = await api.get("/users/me");

  return response.data.data;
}

export async function updateProfile(userData) {
  const response = await api.patch("/users/me", userData);

  return response.data.data;
}

export async function getUserProfile(userId) {
  const response = await api.get(`/users/${userId}`);

  return response.data.data;
}

export async function searchUsers(search) {
  const response = await api.get(`/users/search?search=${search}`);

  return response.data.data.users;
}

export async function followUser(userId) {
  await api.post(`/users/${userId}/follow`);
}

export async function unfollowUser(userId) {
  await api.delete(`/users/${userId}/follow`);
}

export async function getFollowers(userId) {
  const response = await api.get(`/users/${userId}/followers`);

  return response.data.data.followers;
}

export async function getFollowing(userId) {
  const response = await api.get(`/users/${userId}/following`);

  return response.data.data.following;
}
export async function uploadProfileImage(file) {
  const formData = new FormData();

  formData.append("profileImage", file);

  const response = await api.patch("/users/me/profile-image", formData);

  return response.data.data;
}
