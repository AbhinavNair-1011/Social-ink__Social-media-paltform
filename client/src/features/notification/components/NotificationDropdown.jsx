import { NavLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";
import NotificationItem from "./NotificationItem";
import { useInfiniteNotifications } from "../hooks/useInfiniteNotifications";

function NotificationDropdown({ onClose }) {
  const { data } = useInfiniteNotifications({});
  const notifications = data?.pages?.flatMap((page) => page?.notifications) || [];

  return (
    <div className="absolute right-0 mt-3   w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold">Notifications</h2>

        {notifications.length > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
          <div className="rounded-full bg-slate-100 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-8 w-8 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.4-1.4A2 2 0 0118 14.17V11a6 6 0 10-12 0v3.17a2 2 0 01-.6 1.43L4 17h5m6 0a3 3 0 11-6 0"
              />
            </svg>
          </div>

          <p className="font-medium">No notifications</p>

          <p className="text-sm text-slate-500">
            We'll notify you when someone follows, likes or comments.
          </p>
        </div>
      ) : (
        <>
          <div className="max-h-[450px] overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>

          <NavLink
            to="/notifications"
            onClick={onClose}
            className="block border-t border-slate-200 bg-white p-4 text-center text-sm font-semibold text-indigo-600 transition hover:bg-slate-50"
          >
            View all
          </NavLink>
        </>
      )}
    </div>
  );
}

export default NotificationDropdown;
