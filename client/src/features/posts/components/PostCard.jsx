import { formatDistanceToNow } from "date-fns";

import Avatar from "../../../shared/components/Avatar";

import PostActions from "./PostActions";
import { useState } from "react";
import CommentList from "../../comments/components/CommentList";

import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import EditPostForm from "./EditPostForm";
function PostCard({ post, page }) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg">
      <PostHeader post={post} setIsEditing={setIsEditing} />
      {isEditing ? (
        <EditPostForm post={post} setIsEditing={setIsEditing} />
      ) : (
        <PostContent content={post.content} />
      )}

      <PostActions
        post={post}
        showComments={showComments}
        setShowComments={setShowComments}
        setIsEditing={setIsEditing}
        page={page}
      />

      {showComments && <CommentList postId={post._id} />}
    </div>
  );
}

export default PostCard;
