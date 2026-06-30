import api from "../../../app/api/axios";

export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);

  return response.data.data.user;
}
export async function loginUser(userData) {
  const response = await api.post("/auth/login", userData);

  return response.data.data.user;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");

  return response.data;
}

export async function getMyProfile() {
  const response = await api.get("/users/me");

  return response.data.data.user;
}