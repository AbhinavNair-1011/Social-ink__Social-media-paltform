const postRepository = require("../repositories/post.repository");

async function getPostRealtimeData(postId) {
  return await postRepository.getPostRealtimeData(postId);
}

module.exports = getPostRealtimeData;