import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

import CommentMenu from "./CommentMenu";
import EditCommentForm from "./EditCommentForm";

import Avatar from "../../../shared/components/Avatar";

function CommentItem({ comment , postId}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex gap-3 rounded-xl  border-b  border-gray-300 p-3">
      <Avatar image={comment.userId.profileImage} />

      <div className="flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{comment.userId.name}</h3>

              <p className="text-sm text-gray-500">
                @{comment.userId.userName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>

              {comment.isOwner && (
                <CommentMenu
                  comment={comment}
                  postId={postId}
                  setIsEditing={setIsEditing}
                />
              )}
            </div>
          </div>

          {isEditing ? (
            <EditCommentForm
              comment={comment}
              postId={postId}
              setIsEditing={setIsEditing}
            />
          ) : (
            <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
