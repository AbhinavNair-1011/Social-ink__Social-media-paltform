import { formatDistanceToNow } from "date-fns";

import Avatar from "../../../shared/components/Avatar";

import PostActions from "./PostActions";
import { useState } from "react";
import CommentList from "../../comments/components/CommentList";

import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import EditPostForm from "./EditPostForm";
import { useQueryClient } from "@tanstack/react-query";
import PostModal from "./PostModal";

function PostCard({ post, page, querykey }) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPost, setShowPost] = useState(false);

  const queryClient = useQueryClient();
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg">
      <PostHeader post={post} setIsEditing={setIsEditing} />
      {isEditing ? (
        <EditPostForm
          post={post}
          setIsEditing={setIsEditing}
          querykey={querykey}
        />
      ) : (
        <>
          {post.imageUrl && (
            <div className="mt-4 overflow-hidden rounded-2xl">
              <img
              onClick={()=>setShowPost(true)}
                src={post.imageUrl}
                alt="Post"
                className="max-h-[300px] w-full  object-contain transition duration-300 hover:scale-[1.01]"
              />
            </div>
          )}
          <PostContent content={post.content} onClick={()=>setShowPost(true)} showPost={showPost}/>
        </>
      )}

      <PostActions
        post={post}
        showComments={showComments}
        setShowComments={setShowComments}
        setIsEditing={setIsEditing}
        onLikeSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ["feed"],
          })
        }
        onDeleteSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ["feed"],
          })
        }
      />

      {showComments && <CommentList postId={post._id} querykey={querykey} />}
      {showPost && (
        <PostModal
          post={post}
          querykey={querykey}
          onClose={() => setShowPost(false)}
        />
      )}
    </div>
  );
}

export default PostCard;
