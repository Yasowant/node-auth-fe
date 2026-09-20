import api from "./axios";

export const applyToJob = (jobId, { coverNote, answers } = {}) =>
  api
    .post("/applications", { jobId, coverNote, answers })
    .then((res) => res.data);

export const getMyApplications = ({ signal, ...params } = {}) =>
  api.get("/applications/my", { params, signal }).then((res) => res.data);

export const withdrawApplication = (id) =>
  api.patch(`/applications/${id}/withdraw`).then((res) => res.data);
