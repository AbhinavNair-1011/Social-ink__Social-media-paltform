import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { postSchema } from "../schemas/postSchema";
import { useCreatePost } from "../hooks/useCreatePost";

import Textarea from "../../../shared/components/Textarea";
import Button from "../../../shared/components/Button";

function CreatePostForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreatePost();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  function onSubmit(formData) {
    mutate(formData, {
      onSuccess: async () => {
        toast.success("Post created.");

        reset();

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-6 rounded-2xl bg-white p-5 shadow"
    >
      <Textarea
        id="content"
        label="What's on your mind?"
        register={register("content")}
        error={errors.content}
        rows={4}
        placeholder="Share something..."
      />

      <div className="mt-4">
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}

export default CreatePostForm;