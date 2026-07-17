import api from "../../../app/api/axios";

export async function getNotifications(page) {
  const response = await api.get("/notifications", {
    params: {
      page,
      limit: 20,
    },
  });

  return response.data.data;
}

export async function getUnreadCount() {
  const response = await api.get("/notifications/unread-count");

  return response.data.data.unreadCount;
}

export async function markAsRead(id) {
   const response =  await api.patch(`/notifications/${id}/read`);
  return response.data.data
}

export async function markAllAsRead() {
   const response =await api.patch("/notifications/read-all");
    return response.data.data

}
