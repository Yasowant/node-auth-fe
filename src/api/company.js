import api from "./axios";

export const getMyCompany = ({ signal } = {}) =>
  api.get("/company/my/company", { signal }).then((res) => res.data);

export const createCompany = (payload) =>
  api.post("/company", payload).then((res) => res.data);

export const updateCompany = (id, payload) =>
  api.put(`/company/${id}`, payload).then((res) => res.data);
