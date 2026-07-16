import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { commentSchema } from "../schemas/commentSchema";
import { useCreateComment } from "../hooks/useCreateComment";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

function CommentForm({ postId , querykey }) {
  const queryClient = useQueryClient();

  
  const { mutate, isPending } = useCreateComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
  });

  function onSubmit(formData) {
    mutate(
      {
        postId,
        content: formData.content,
      },
      {
        onSuccess: async () => {
          reset();

          await queryClient.invalidateQueries({
            queryKey: ["comments", postId],
          });

          await queryClient.invalidateQueries({
            queryKey: querykey,
          });
          
     
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
    className="mt-4 flex items-end gap-3"
>
  <div className="flex-1">
    <Input
      id="content"
      label=""
      register={register("content")}
      error={errors.content}
      placeholder="Write a comment..."
    />
  </div>

  <Button
    type="submit"
    disabled={isPending}
    className="rounded-full px-5 py-2"
  >
    {isPending ? "Posting..." : "Post"}
  </Button>
</form>
  );
}

export default CommentForm;