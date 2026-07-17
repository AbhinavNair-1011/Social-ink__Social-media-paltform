import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "../../shared/components/Navbar";
import Sidebar from "../../shared/components/Sidebar";
import ScrollToTop from "../../shared/components/ScrollToTop";
import socket from "../socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleNotification(notification) {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  notifications: [notification, ...page.notifications],
                }
              : page,
          ),
        };
      });

      queryClient.setQueryData(
        ["notification-count"],
        (count = 0) => count + 1,
      );
    }

    function handleNotificationDelete(notificationId) {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            notifications: page.notifications.filter(
              (notification) => notification._id !== notificationId,
            ),
          })),
        };
      });

      queryClient.setQueryData(["notification-count"], (count = 0) =>
        Math.max(count - 1, 0),
      );
    }

    function handlePostUpdated(updatedPost) {
      queryClient.setQueryData(["feed"], (old) => {
        console.log(old);
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id == updatedPost._id
                ? {
                    ...post,
                    likesCount: updatedPost.likesCount,
                    commentsCount: updatedPost.commentsCount,
                  }
                : post,
            ),
          })),
        };
      });
      queryClient.setQueryData(["my-posts"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === updatedPost._id
                ? {
                    ...post,
                    likesCount: updatedPost.likesCount,
                    commentsCount: updatedPost.commentsCount,
                  }
                : post,
            ),
          })),
        };
      });
      queryClient.setQueryData(["user-posts"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === updatedPost._id
                ? {
                    ...post,
                    likesCount: updatedPost.likesCount,
                    commentsCount: updatedPost.commentsCount,
                  }
                : post,
            ),
          })),
        };
      });
      queryClient.setQueryData(["post", updatedPost._id], (oldPost) => {
        if (!oldPost) return oldPost;

        return {
          ...oldPost,
          likesCount: updatedPost.likesCount,
          commentsCount: updatedPost.commentsCount,
        };
      });
    }

    const handleCommentCreation = (comment) => {
      queryClient.setQueryData(["comments", comment.postId], (oldComments) => {
        if (!oldComments) return oldComments;

        return [comment, ...oldComments];
      });
    };

    function handlePostDeleted(postId) {
      queryClient.setQueryData(["feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post._id !== postId),
          })),
        };
      });

      queryClient.setQueryData(["my-posts"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post._id !== postId),
          })),
        };
      });

      queryClient.setQueryData(["user-posts"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post._id !== postId),
          })),
        };
      });

      queryClient.removeQueries({
        queryKey: ["post", postId],
      });

      queryClient.removeQueries({
        queryKey: ["comments", postId],
      });
    }

    socket.on("notification:new", handleNotification);

    socket.on("notification:delete", handleNotificationDelete);
    socket.on("post:updated", handlePostUpdated);
    socket.on("comment:created", handleCommentCreation);
    socket.on("post:deleted", handlePostDeleted);
    return () => {
      socket.off("notification:delete", handleNotificationDelete);
      socket.off("notification:new", handleNotification);
      socket.off("post:updated", handlePostUpdated);
      socket.off("comment:created", handleCommentCreation);
          socket.on("post:deleted", handlePostDeleted);

    };
  }, [queryClient]);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <div className="mx-auto flex">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="min-w-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default AppLayout;
