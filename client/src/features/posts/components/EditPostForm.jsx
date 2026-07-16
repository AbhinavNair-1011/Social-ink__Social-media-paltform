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
  querykey
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } =
    useUpdatePost();

  const {
    register,
    handleSubmit,
    formState:{errors}
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
            queryKey: querykey,
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
  className="space-y-4"
>
  <Textarea
    id="content"
    label=""
    register={register("content")}
    rows={4}
    className="rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white"
  />
  {errors && <p className="text-red-600 text-sm"> {errors?.content?.message}</p>}

  <div className="flex items-center justify-end gap-3">
    <Button
      type="button"
      onClick={() => setIsEditing(false)}
      className="rounded-full border border-slate-300 bg-red-500 px-5 py-2 text-slate-700 shadow-none hover:bg-red-600"
    >
      Cancel
    </Button>

    <Button
      type="submit"
      disabled={isPending}
      className="rounded-full px-6 py-2 "
    >
      {isPending ? "Saving..." : "Save"}
    </Button>
  </div>
</form>
  );
}

export default EditPostForm;