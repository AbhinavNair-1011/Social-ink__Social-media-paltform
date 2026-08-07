import { useLikePost } from "../hooks/useLikePost";
import { useUnlikePost } from "../hooks/useUnlikePost";
import { useDeletePost } from "../hooks/useDeletePost";
import toast from "react-hot-toast";

function PostActions({
  post,
  showComments,
  setShowComments,
  setIsEditing,
  onLikeSuccess,
  onDeleteSuccess,
}) {
  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();
  const { mutate: deletePost } = useDeletePost();

  function handleLike() {
    const action = post.isLikedByMe ? unlikePost : likePost;

    action(post._id, {
      onSuccess: () => {
        onLikeSuccess?.();
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.error?.message || "Something went wrong.",
        );
      },
    });
  }

  function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;
    
    deletePost(post._id, {
      onSuccess: () => {
        toast.success("Post deleted.");

        onDeleteSuccess?.();
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.error?.message || "Something went wrong.",
        );
      },
    });
  }

  return (
    <div className="mt-4 flex items-center gap-6 border-t border-slate-100 pt-3">
      {/* <button
        onClick={handleLike}
        className={`flex items-center gap-2 text-sm font-medium transition ${
          post.isLikedByMe
            ? "text-red-500"
            : "text-slate-500 hover:text-red-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={post.isLikedByMe ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121.5 12C19 16.65 12 21 12 21z"
          />
        </svg>

        <span>{post.likesCount}</span>
      </button> */}

      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
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
            d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          />
        </svg>

        <span>{post.commentsCount}</span>
      </button>
    </div>
  );
}

export default PostActions;
