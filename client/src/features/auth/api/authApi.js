import api from "../../../app/api/axios";

export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);

  return response.data.data.user;
}

export async function loginUser(userData) {
  const response = await api.post("/auth/login", userData, {
    skipAuthRefresh: true,
  });

  return response.data.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");

  return response.data;
}

export async function forgotPassword(userData) {
  const response = await api.post("/auth/forgot-password", userData);

  return response.data;
}

export async function resetPassword(userData) {
  const response = await api.post("/auth/reset-password", userData);

  return response.data;
}

export async function verifyEmail(userData) {
  const response = await api.post("/auth/verify-email", userData);

  return response.data;
}

export async function resendVerification(userData) {
  const response = await api.post("/auth/send-email-verification", userData);

  return response.data;
}

export async function changePassword(userData) {
  const response = await api.patch("/auth/change-password", userData);

  return response.data;
}

export async function logoutAllDevices() {
  const response = await api.post("/auth/logout-all");

  return response.data;
}

export async function changeEmail(userData) {
  const response = await api.patch("/auth/change-email", userData, {
    skipAuthRefresh: true,
  });

  return response.data;
}

export async function verifyTwoFactor(userData) {
  const response = await api.post("/auth/verify-2fa", userData, {
    skipAuthRefresh: true,
  });

  return response.data.data.user;
}
