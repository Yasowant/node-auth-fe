import { useCallback, useEffect, useState } from "react";

import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notifications";

const POLL_MS = 30000;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getMyNotifications({ limit: 20, signal: controller.signal })
      .then((data) => {
        setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
        setUnreadCount(data?.unreadCount ?? 0);
        setError(null);
      })
      .catch((requestError) => {
        if (requestError.name === "CanceledError") return;
        setError(
          requestError.friendlyMessage ||
            requestError.response?.data?.message ||
            "Couldn't load notifications right now.",
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [reloadToken]);

  // Background poll, silent -- doesn't flip `loading`, just refreshes the
  // badge/list so a new notification shows up without a manual refresh.
  useEffect(() => {
    const id = setInterval(() => {
      getMyNotifications({ limit: 20 })
        .then((data) => {
          setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
          setUnreadCount(data?.unreadCount ?? 0);
        })
        .catch(() => {});
    }, POLL_MS);

    return () => clearInterval(id);
  }, []);

  const refetch = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadToken((token) => token + 1);
  }, []);

  const markAsRead = useCallback(async (id) => {
    const { notification } = await markNotificationAsRead(id);
    setNotifications((current) =>
      current.map((item) => (item._id === id ? notification : item)),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsRead();
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, loading, error, refetch, markAsRead, markAllAsRead };
}

export default useNotifications;