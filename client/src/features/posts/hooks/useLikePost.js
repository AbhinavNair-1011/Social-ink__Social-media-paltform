import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../api/postsApi";

export function useLikePost(page) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,

    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: ["feed", page],
      });

      const previousFeed = queryClient.getQueryData(["feed", page]);
      
      queryClient.setQueryData(["feed", page], (oldData) => {
        return {
          ...oldData,
          posts: oldData.posts.map((post) => {
            if (post._id !== postId) {
              return post;
            }

            return {
              ...post,
              isLikedByMe: true,
              likesCount: post.likesCount + 1,
            };
          }),
        };
      });

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

export default useLikePost;
