import { useState } from "react";

import { BellIcon, CloseIcon } from "./icons";
import { useNotifications } from "../hooks/useNotifications";

const STATUS_COPY = {
  UNDER_REVIEW: "is under review",
  SHORTLISTED: "shortlisted you",
  INTERVIEW: "moved you to interview",
  OFFERED: "made you an offer",
  REJECTED: "was not moved forward",
  WITHDRAWN: "was withdrawn",
};

const NotificationBell = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpenItem = (item) => {
    if (!item.read) markAsRead(item._id);
  };

  return (
    <>
      <button
        type="button"
        className="icon-button notification-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="pill pill-brand notification-badge">
            {unreadCount}
          </span>
        ) : null}
        <span className="visually-hidden">Open notifications</span>
      </button>

      {open ? (
        <>
          <div
            className="drawer-backdrop"
            onClick={() => setOpen(false)}
            role="presentation"
          />

          <aside
            className="drawer notification-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            <header className="drawer-head">
              <h2>Notifications</h2>

              <button
                type="button"
                className="icon-button"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
                <span className="visually-hidden">Close notifications</span>
              </button>
            </header>

            <div className="drawer-body">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  className="link-button"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              ) : null}

              {loading ? <p className="field-hint">Loading...</p> : null}

              {!loading && notifications.length === 0 ? (
                <p className="field-hint">
                  Nothing yet -- status changes on your applications will show
                  up here.
                </p>
              ) : null}

              <ul className="notification-list">
                {notifications.map((item) => (
                  <li
                    key={item._id}
                    className={`notification-item${item.read ? "" : " is-unread"}`}
                    onClick={() => handleOpenItem(item)}
                  >
                    <strong>{item.title}</strong>
                    <p>
                      {item.message || STATUS_COPY[item.data?.status] || ""}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
};

export default NotificationBell;
