const Post = require("../models/post.model");

async function getPostRealtimeData(postId, currentUserId) {
  const post = await Post.findById(postId).lean();



  return post
}

module.exports =getPostRealtimeData