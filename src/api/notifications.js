import api from "./axios";

export const getMyNotifications = ({ signal, ...params } = {}) =>
  api.get("/notifications", { params, signal }).then((res) => res.data);

export const markNotificationAsRead = (id) =>
  api.patch(`/notifications/${id}/read`).then((res) => res.data);

export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/read-all").then((res) => res.data);
