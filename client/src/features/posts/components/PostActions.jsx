
import { useLikePost } from "../hooks/useLikePost";
import { useUnlikePost } from "../hooks/useUnlikePost";
import { useDeletePost } from "../hooks/useDeletePost";
import { useQueryClient } from "@tanstack/react-query";

function PostActions({ post, showComments, setShowComments, setIsEditing ,page }) {
  const queryClient = useQueryClient();
  const { mutate: likePost } = useLikePost(page);
  const { mutate: unlikePost } = useUnlikePost(page);
  const { mutate: deletePost } = useDeletePost();

  function handleLike() {
    const action = post.isLikedByMe ? unlikePost: likePost;

    action(post._id);
  }

  function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) return;

    deletePost(post._id, {
      onSuccess: async () => {
        toast.success("Post deleted.");

        await queryClient.invalidateQueries({
          queryKey: ["feed",page],
        });
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.error?.message || "Something went wrong.",
        );
      },
    });
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-gray-200 pt-4">
      <button
        onClick={handleLike}
        className={`font-medium transition ${
          post.isLikedByMe ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      >
        ❤️ {post.likesCount}
      </button>

      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="font-medium text-gray-500 hover:text-blue-500"
      >
        💬 {post.commentsCount}
      </button>
    </div>
  );
}

export default PostActions;
