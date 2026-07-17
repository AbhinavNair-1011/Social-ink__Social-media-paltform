import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

import { useMarkAsRead } from "../hooks/useMarkAsRead";
import { useQueryClient } from "@tanstack/react-query";
import { useUnreadCount } from "../hooks/useUnreadCount";

function NotificationItem({ notification, onClose = () => {} }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: markAsRead } = useMarkAsRead();
  const { data: unreadFeedCount } = useUnreadCount();

  function handleClick() {
    markAsRead(notification._id, {
      onSuccess: async (data) => {

        unreadFeedCount()
        await queryClient.invalidateQueries({
          queryKey: ["notification-count"],
        });

        await queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });

        await queryClient.refetchQueries({
          queryKey: ["notification-count"],
          type: "active",
        });

        await queryClient.refetchQueries({
          queryKey: ["notifications"],
          type: "active",
        });
      },
      onError:(error)=>{
        console.log(error)
      }
    });

      if (notification.type === "follow") {
        navigate(`/users/${notification.sender._id}`);
        return;
      }

      if (notification.type === "like" || notification.type === "comment") {
        navigate(`/posts/${notification.post}`);
      }
      onClose()
  }

  return (
    <button
      onClick={() => handleClick()}
      className={`flex w-full gap-3 m-2 border-b border-slate-200 p-4 text-left transition hover:bg-slate-50 ${
        !notification.isRead ? "bg-indigo-50" : ""
      }`}
    >
      <img
        src={notification.sender.profileImage}
        alt={notification.sender.name}
        className="h-10 w-10 rounded-full object-cover"
      />

      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{notification.sender.name}</span>{" "}
          {notification.type === "follow" && "started following you."}
          {notification.type === "like" && "liked your post."}
          {notification.type === "comment" && "commented on your post."}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {!notification.isRead && (
        <span className="mt-2 h-2.5 w-2.5 rounded-full bg-indigo-600" />
      )}
    </button>
  );
}

export default NotificationItem;
