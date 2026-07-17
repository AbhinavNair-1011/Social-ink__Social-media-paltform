import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

import { useMarkAsRead } from "../hooks/useMarkAsRead";

function NotificationItem({ notification, onClose= ()=>{} }) {
  const navigate = useNavigate();

  const { mutate: markAsRead } = useMarkAsRead();

  function handleClick() {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    onClose();

    if (notification.type === "follow") {
      navigate(`/users/${notification.sender._id}`);
      return;
    }

    
    if (notification.type === "like" || notification.type === "comment") {
      navigate(`/posts/${notification.post}`);
    }
  }

  return (
    <button
      onClick={handleClick}
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
