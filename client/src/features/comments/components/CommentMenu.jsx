import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import { useDeleteComment } from "../hooks/useDeleteComment";

function CommentMenu({
  comment,
  postId,
  setIsEditing,
}) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useDeleteComment();

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) return;

    mutate(comment._id, {
      onSuccess: async () => {
        toast.success("Comment deleted.");

        await queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["feed"],
        });
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.error?.message ||
            "Something went wrong."
        );
      },
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="rounded-full p-2 hover:bg-gray-100"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border bg-white shadow-lg">
          <button
            onClick={() => {
              setIsEditing(true);
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            ✏️ Edit
          </button>

          <button
            onClick={handleDelete}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentMenu;