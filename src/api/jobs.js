import api from "./axios";

export const getMyJobs = ({ signal } = {}) =>
  api.get("/jobs/my/jobs", { signal }).then((res) => res.data);

export const createJob = (payload) =>
  api.post("/jobs", payload).then((res) => res.data);
