import { useEffect, useRef } from "react";

import Loader from "../../../shared/components/Loader";

import NotificationItem from "../components/NotificationItem";

import { useInfiniteNotifications } from "../hooks/useInfiniteNotifications";

function NotificationsPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteNotifications();

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        observer.unobserve(entry.target);

        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [notifications.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Notifications</h1>

        <p className="mt-2 text-sm text-slate-500">
          Stay updated with likes, comments and follows.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}
      </div>

      <div ref={loadMoreRef} />

      {isFetchingNextPage && <Loader />}
    </section>
  );
}

export default NotificationsPage;
