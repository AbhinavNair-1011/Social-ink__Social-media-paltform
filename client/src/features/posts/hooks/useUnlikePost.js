import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlikePost } from "../api/postsApi";

export function useUnlikePost(page) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlikePost,

    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: ["feed", page],
      });

      const previousFeed = queryClient.getQueryData(["feed", page]);
      queryClient.setQueryData(["feed", page], (oldData) => ({
        ...oldData,
        posts: oldData.posts.map((post) => {
          if (post._id !== postId) return post;

          return {
            ...post,
            isLikedByMe: false,
            likesCount: post.likesCount - 1,
          };
        }),
      }));

      return { previousFeed };
    },

    onError: (error, variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed", page], context.previousFeed);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed", page],
      });
    },
  });
}
export default useUnlikePost;
