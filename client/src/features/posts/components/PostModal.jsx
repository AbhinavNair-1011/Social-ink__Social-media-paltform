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

  function handleCloseModal() {}

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
                className="mt-4 max-h-[550px] w-full rounded-xl object-contain"
              />
            )}

            <PostContent content={post.content} showPost={true} />
          </>
        )}
        <div className="mt-4 flex items-end justify-between">
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

          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18l-6-6 6-6"
              />
            </svg>

            <span>Back</span>
          </button>
        </div>

        {showComments && <CommentList postId={post._id} querykey={querykey} />}
      </div>
    </Modal>
  );
}

export default PostModal;
