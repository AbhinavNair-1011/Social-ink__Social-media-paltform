import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useDeletePost } from "../hooks/useDeletePost";

function PostMenu({ post, setIsEditing , querykey }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deletePost } = useDeletePost();

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this post?"
    );

    if (!confirmed) return;

    deletePost(post._id, {
      onSuccess: async () => {
        toast.success("Post deleted.");

        await queryClient.invalidateQueries({
          queryKey:querykey,
        });
         await queryClient.invalidateQueries({
          queryKey:["profile"],
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
        <div className="absolute right-0 mt-2 w-36 rounded-xl  bg-white shadow-lg">
          <button
            onClick={() => {
              setIsEditing(true);
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
             Edit
          </button>

          <button
            onClick={handleDelete}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default PostMenu;