import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { commentSchema } from "../schemas/commentSchema";
import { useUpdateComment } from "../hooks/useUpdateComment";

import Textarea from "../../../shared/components/Textarea";
import Button from "../../../shared/components/Button";

function EditCommentForm({
  comment,
  postId,
  setIsEditing,
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } =
    useUpdateComment();

  const {
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(commentSchema),

    defaultValues: {
      content: comment.content,
    },
  });

  function onSubmit(formData) {
    mutate(
      {
        commentId: comment._id,
        content: formData.content,
      },
      {
        onSuccess: async () => {
          toast.success("Comment updated.");

          await queryClient.invalidateQueries({
            queryKey: ["comments", postId],
          });

          setIsEditing(false);
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.error?.message ||
              "Something went wrong."
          );
        },
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
    >
      <Textarea
        id="content"
        label=""
        register={register("content")}
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-auto"
        >
          Save
        </Button>

        <Button
          type="button"
          onClick={() =>
            setIsEditing(false)
          }
          className="w-auto bg-gray-500 hover:bg-gray-600"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default EditCommentForm;