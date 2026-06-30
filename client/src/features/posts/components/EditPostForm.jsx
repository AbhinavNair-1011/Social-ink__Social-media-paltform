import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { postSchema } from "../schemas/postSchema";
import { useUpdatePost } from "../hooks/useUpdatePost";

import Textarea from "../../../shared/components/Textarea";
import Button from "../../../shared/components/Button";

function EditPostForm({
  post,
  setIsEditing,
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } =
    useUpdatePost();

  const {
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(postSchema),

    defaultValues: {
      content: post.content,
    },
  });

  function onSubmit(formData) {
    mutate(
      {
        postId: post._id,
        postData: formData,
      },
      {
        onSuccess: async () => {
          toast.success("Post updated.");

          await queryClient.invalidateQueries({
            queryKey: ["feed"],
          });

          setIsEditing(false);
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.error
              ?.message ||
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

export default EditPostForm;