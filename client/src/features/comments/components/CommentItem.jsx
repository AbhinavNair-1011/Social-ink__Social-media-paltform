import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

import CommentMenu from "./CommentMenu";
import EditCommentForm from "./EditCommentForm";

import Avatar from "../../../shared/components/Avatar";

function CommentItem({ comment , postId}) {
  const [isEditing, setIsEditing] = useState(false);
  console.log(comment)
  return (
  <div className="flex gap-3 ">
  <Avatar
    src={comment.userId.profileImage}
    className="h-10 w-10"
  />

  <div className="min-w-0 flex-1">
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {comment.userId.name}
            </h3>

            <span className="text-xs text-slate-400">•</span>

            <span className="truncate text-xs text-slate-500">
              @{comment.userId.userName}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        {comment.isOwner && (
          <CommentMenu
            comment={comment}
            postId={postId}
            setIsEditing={setIsEditing}
          />
        )}
      </div>

      {isEditing ? (
        <div className="mt-3">
          <EditCommentForm
            comment={comment}
            postId={postId}
            setIsEditing={setIsEditing}
          />
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
          {comment.content}
        </p>
      )}
    </div>
  </div>
</div>
  )
}

export default CommentItem;
