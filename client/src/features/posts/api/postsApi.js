import api from "../../../app/api/axios";

export async function getFeed(page) {
  const response = await api.get("/posts", {
    params: {
      page,
      limit: 10,
    },
  });

  return response.data.data;
}

export async function createPost(formData) {
  const response = await api.post("/posts", formData);

  return response.data.data.post;
}

export async function updatePost(postId, postData) {
  const response = await api.patch(`/posts/${postId}`, postData);

  return response.data.data.post;
}

export async function deletePost(postId) {
  await api.delete(`/posts/${postId}`);
}

export async function likePost(postId) {
  await api.post(`/posts/${postId}/like`);
}

export async function unlikePost(postId) {
  await api.delete(`/posts/${postId}/like`);
}
export async function getMyPosts(page, type) {
  const response = await api.get("/posts/me/posts", {
    params: {
      page,
      limit: 12,
      type,
    },
  });

  return response.data.data;
}
export async function getUserPosts(page,userId,type) {
  const response = await api.get(`/posts/${userId}/posts`, {
    params: {
      page,
      limit: 12,
      type,
    },
  });

  return response.data.data;
}
