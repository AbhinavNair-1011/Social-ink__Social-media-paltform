import Modal from "../../../shared/components/Modal";

import PostContent from "./PostContent";
import PostActions from "./PostActions";
import CommentList from "../../comments/components/CommentList";
import EditPostForm from "./EditPostForm";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PostMenu from "./PostMenu";

function PostModal({ post, querykey, onClose }) {
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="absolute top-0 right-0">
          {post.isOwner && (
            <PostMenu
              post={post}
              setIsEditing={setIsEditing}
              querykey={querykey}
            />
          )}
        </div>

        {isEditing ? (
          <EditPostForm post={post} setIsEditing={setIsEditing} />
        ) : (
          <>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="mt-4 max-h-[550px] w-full rounded-xl object-cover"
              />
            )}
      
            <PostContent content={post.content}  showPost={true}/>
          
          </>
        )}

        <PostActions
          post={post}
          showComments={showComments}
          setShowComments={setShowComments}
          setIsEditing={setIsEditing}
          onLikeSuccess={() =>
            queryClient.invalidateQueries({
              querykey,
            })
          }
          onDeleteSuccess={() => {
            queryClient.invalidateQueries({
              querykey,
            });

            onClose();
          }}
        />

        {showComments && <CommentList postId={post._id} querykey={querykey} />}
      </div>
    </Modal>
  );
}

export default PostModal;
