/**
 * Derived views over the user list returned by GET /api/auth/users.
 *
 * Everything here is computed from real records -- nothing is invented. When
 * the directory is empty, every counter is zero and the UI says so.
 */

export const ROLES = ["USER", "RECRUITER", "ADMIN"];

export const ROLE_LABELS = {
  USER: "Candidate",
  RECRUITER: "Recruiter",
  ADMIN: "Admin",
};

export const WORK_STATUS_LABELS = {
  FRESHER: "Fresher",
  EXPERIENCED: "Experienced",
};

const DAY = 24 * 60 * 60 * 1000;

export const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase() || "?";

export const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatRelative = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  const days = Math.floor((Date.now() - date.getTime()) / DAY);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} mo ago`;

  return `${Math.floor(days / 365)} yr ago`;
};

export const experienceOf = (user) => {
  const years = user?.totalExperience?.years ?? 0;
  const months = user?.totalExperience?.months ?? 0;

  if (!years && !months) return "--";
  if (!years) return `${months} mo`;
  if (!months) return `${years} yr`;

  return `${years} yr ${months} mo`;
};

/**
 * How much of the optional profile a user has actually filled in. Ten equally
 * weighted fields, so the number moves for a reason the admin can point at.
 */
const PROFILE_FIELDS = [
  (u) => Boolean(u.phone),
  (u) => Boolean(u.location),
  (u) => Boolean(u.headline),
  (u) => Boolean(u.bio),
  (u) => (u.skills?.length ?? 0) > 0,
  (u) => (u.experience?.length ?? 0) > 0,
  (u) => (u.education?.length ?? 0) > 0,
  (u) => Boolean(u.resume?.url),
  (u) => Boolean(u.preferredJobTitle),
  (u) => (u.preferredLocation?.length ?? 0) > 0,
];

export const profileScore = (user) => {
  if (!user) return 0;

  const filled = PROFILE_FIELDS.filter((test) => test(user)).length;

  return Math.round((filled / PROFILE_FIELDS.length) * 100);
};

/** Headline counters for the stat row. All of them are plain tallies. */
export function summarise(users) {
  const total = users.length;

  const byRole = ROLES.reduce((acc, role) => {
    acc[role] = users.filter((user) => user.role === role).length;
    return acc;
  }, {});

  const weekAgo = Date.now() - 7 * DAY;

  const newThisWeek = users.filter((user) => {
    const created = new Date(user.createdAt).getTime();
    return !Number.isNaN(created) && created >= weekAgo;
  }).length;

  const active = users.filter((user) => user.isActive !== false).length;
  const verified = users.filter((user) => user.isEmailVerified).length;

  const averageProfile = total
    ? Math.round(
        users.reduce((sum, user) => sum + profileScore(user), 0) / total,
      )
    : 0;

  return {
    total,
    byRole,
    newThisWeek,
    active,
    inactive: total - active,
    verified,
    verifiedPercent: total ? Math.round((verified / total) * 100) : 0,
    averageProfile,
  };
}
