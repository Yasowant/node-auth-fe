/**
 * Job-board taxonomy and helpers.
 *
 * Roles come from GET /api/jobs (see useJobSearch), which only ever returns
 * ACTIVE listings shaped like the Job model. `mapApiJobToBoardJob` below is
 * the one place that translates that API shape into the flat shape every
 * component here (JobCard, filterJobs, sortJobs, experienceLabel...) expects.
 */

export const WORK_MODES = ["Remote", "Hybrid", "On-site"];
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export const EXPERIENCE_LEVELS = [
  { id: "entry", label: "0-1 yrs", min: 0, max: 1 },
  { id: "mid", label: "2-5 yrs", min: 2, max: 5 },
  { id: "senior", label: "6+ yrs", min: 6, max: 99 },
];

const WORK_MODE_LABELS = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

const EMPLOYMENT_TYPE_LABELS = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const CURRENCY_SYMBOLS = {
  INR: "\u20B9",
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
};

const formatLocation = (location, workMode) => {
  const parts = [location?.city, location?.state, location?.country].filter(
    Boolean,
  );

  if (parts.length > 0) return parts.join(", ");

  return WORK_MODE_LABELS[workMode] ?? "Location not specified";
};

const formatSalary = (salary) => {
  if (!salary?.isDisclosed || (!salary.min && !salary.max)) {
    return "Not disclosed";
  }

  const symbol =
    CURRENCY_SYMBOLS[salary.currency] ??
    (salary.currency ? `${salary.currency} ` : "");

  const format = (value) =>
    typeof value === "number" ? value.toLocaleString("en-IN") : null;

  const min = format(salary.min);
  const max = format(salary.max);
  const range = min && max ? `${min} - ${max}` : min || max;

  return `${symbol}${range}${salary.period ? ` / ${salary.period}` : ""}`;
};

const daysAgo = (dateValue) => {
  if (!dateValue) return 0;

  const posted = new Date(dateValue).getTime();

  if (Number.isNaN(posted)) return 0;

  return Math.max(0, Math.floor((Date.now() - posted) / (24 * 60 * 60 * 1000)));
};

/** Translates one job as GET /api/jobs returns it into the flat shape this
 * file's helpers and the job-board components share. */
export const mapApiJobToBoardJob = (apiJob) => ({
  id: apiJob._id,
  title: apiJob.title,
  company: apiJob.company?.name ?? "Unknown company",
  location: formatLocation(apiJob.location, apiJob.workMode),
  workMode: WORK_MODE_LABELS[apiJob.workMode] ?? apiJob.workMode ?? "",
  type:
    EMPLOYMENT_TYPE_LABELS[apiJob.employmentType] ??
    apiJob.employmentType ??
    "",
  category: apiJob.category ?? "",
  skills: apiJob.skills ?? [],
  minYears: apiJob.experience?.min ?? 0,
  maxYears: apiJob.experience?.max ?? apiJob.experience?.min ?? 0,
  salary: formatSalary(apiJob.salary),
  postedDaysAgo: daysAgo(apiJob.publishedAt ?? apiJob.createdAt),
  applicants: apiJob.applicantCount ?? 0,
  screeningQuestions: apiJob.screeningQuestions ?? [],
});

export const FEATURES = [
  {
    icon: "◈",
    title: "One profile, every application",
    body: "Fill it in once. Every role you apply to gets the same complete profile, so you are never retyping your work history at midnight.",
  },
  {
    icon: "⚡",
    title: "Filters that actually narrow",
    body: "Work mode, experience band and contract type combine, so a search for remote mid-level design work returns exactly that.",
  },
  {
    icon: "◎",
    title: "Know where you stand",
    body: "Every application keeps its status in one list, so you can tell a stalled process from a slow one without chasing recruiters.",
  },
  {
    icon: "⚑",
    title: "Save roles for later",
    body: "Bookmark anything that looks close. Saved roles stay put while you decide, and stay out of your applications list.",
  },
];

export const FAQS = [
  {
    q: "Does it cost anything to apply?",
    a: "No. WorkWise is free for job seekers -- creating a profile, searching and applying all cost nothing.",
  },
  {
    q: "Do I need an account to see the roles?",
    a: "Yes. The job board sits behind sign-in, so create a free account to search roles, save them and track applications.",
  },
  {
    q: "Are there any roles listed right now?",
    a: "Not yet. The board is live but no employer has posted a role, so it will stay empty until the first listings go up.",
  },
  {
    q: "Can I use it as a fresher?",
    a: "Yes. You pick fresher or experienced when you sign up, and the board has an entry-level filter for roles that expect under a year.",
  },
  {
    q: "How do I reset my password?",
    a: "Use the forgot-password link on the login screen. Reset links expire after 15 minutes, and resetting signs you out on every device.",
  },
];

const matchesExperience = (job, levelIds) => {
  if (levelIds.length === 0) return true;

  return EXPERIENCE_LEVELS.filter((level) => levelIds.includes(level.id)).some(
    // Overlap between the role's band and the selected band.
    (level) => job.minYears <= level.max && job.maxYears >= level.min,
  );
};

/**
 * Filters a job list. Every argument is optional; text matching is
 * case-insensitive across title, company, category and skills.
 */
export function filterJobs(
  jobs,
  { keyword = "", location = "", workModes = [], types = [], levels = [] } = {},
) {
  const q = keyword.trim().toLowerCase();
  const place = location.trim().toLowerCase();

  return jobs.filter((job) => {
    // Searching "remote" or "internship" should find those roles, so the
    // keyword also covers the facets, not just the title and skills.
    const matchesKeyword =
      !q ||
      [
        job.title,
        job.company,
        job.category,
        job.location,
        job.workMode,
        job.type,
        ...job.skills,
      ].some((value) => value.toLowerCase().includes(q));

    const matchesLocation =
      !place ||
      job.location.toLowerCase().includes(place) ||
      job.workMode.toLowerCase().includes(place);

    const matchesMode =
      workModes.length === 0 || workModes.includes(job.workMode);

    const matchesType = types.length === 0 || types.includes(job.type);

    return (
      matchesKeyword &&
      matchesLocation &&
      matchesMode &&
      matchesType &&
      matchesExperience(job, levels)
    );
  });
}

export const SORTS = {
  recent: {
    label: "Most recent",
    compare: (a, b) => a.postedDaysAgo - b.postedDaysAgo,
  },
  applicants: {
    label: "Fewest applicants",
    compare: (a, b) => a.applicants - b.applicants,
  },
  experience: {
    label: "Lowest experience",
    compare: (a, b) => a.minYears - b.minYears,
  },
};

export function sortJobs(jobs, sortKey) {
  const sort = SORTS[sortKey] ?? SORTS.recent;
  return [...jobs].sort(sort.compare);
}

export const experienceLabel = (job) =>
  job.minYears === 0 && job.maxYears <= 1
    ? "Entry level"
    : `${job.minYears}-${job.maxYears} yrs`;
