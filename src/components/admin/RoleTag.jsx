import { ROLE_LABELS } from "../../utils/adminUsers";

const TONES = {
  ADMIN: "tag-admin",
  RECRUITER: "tag-recruiter",
  USER: "tag-user",
};

const RoleTag = ({ role }) => (
  <span className={`tag ${TONES[role] ?? "tag-user"}`}>
    {ROLE_LABELS[role] ?? role}
  </span>
);

export default RoleTag;
