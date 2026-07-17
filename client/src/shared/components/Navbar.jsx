import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

import Logo from "./Logo";

import NotificationBell from "../../features/notification/components/NotificationBell";

import { useUnreadConversationCount } from "../../features/chat/hooks/useUnreadConversationCount";
import { useQueryClient } from "@tanstack/react-query";
import { useUnreadCount } from "../../features/notification/hooks/useUnreadCount";

function Navbar({ onOpenSidebar }) {
  const { data: unreadCount = 0 } = useUnreadConversationCount();
  const { data: unreadFeedCount } = useUnreadCount();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <Logo />
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell unreadFeedCount={unreadFeedCount} />

        <Link
          to="/chat"
          className="relative rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
        >
          <MessageCircle className="h-6 w-6" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
