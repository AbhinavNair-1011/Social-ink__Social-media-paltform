import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { postSchema } from "../schemas/postSchema";
import { useCreatePost } from "../hooks/useCreatePost";

import Textarea from "../../../shared/components/Textarea";
import Button from "../../../shared/components/Button";
import { useState } from "react";

function CreatePostForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreatePost();

  const [image, setImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  function onSubmit(data) {
    const formData = new FormData();

    formData.append("content", data.content);

    if (image) {
      formData.append("image", image);
    }

    mutate(formData, {
      onSuccess: async () => {
        toast.success("Post created.");

        reset();
        setImage(null);

        await queryClient.invalidateQueries({
          queryKey: ["feed"],
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <Textarea
        id="content"
        register={register("content")}
        error={errors.content}
        rows={4}
        placeholder="What's happening today?"
      />

      {image && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="max-h-80 w-full rounded-xl border border-slate-200 object-contain"
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <label className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
           Add Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>

        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full px-6"
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}

export default CreatePostForm;
