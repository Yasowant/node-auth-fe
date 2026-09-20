import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "./useAuth";

let keySeed = 0;
const nextKey = () => `row-${(keySeed += 1)}`;

const isoDay = (value) => (value ? String(value).slice(0, 10) : "");

/** Number inputs hand back strings -- the API wants numbers (or nothing). */
const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
};

/** `_key` is UI-only bookkeeping for list rows; it must never be persisted. */
const stripKey = (row) => {
  const copy = { ...row };

  delete copy._key;

  return copy;
};

export const blankExperience = () => ({
  _key: nextKey(),
  designation: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
});

export const blankEducation = () => ({
  _key: nextKey(),
  degree: "",
  fieldOfStudy: "",
  institution: "",
  startYear: "",
  endYear: "",
  grade: "",
});

/** Shapes the API user into the flat, always-defined form the inputs need. */
const fromUser = (user = {}) => ({
  name: user.name ?? "",
  phone: user.phone ?? "",
  location: user.location ?? "",
  headline: user.headline ?? "",
  bio: user.bio ?? "",
  workStatus: user.workStatus ?? "",
  skills: user.skills ?? [],
  totalExperience: {
    years: user.totalExperience?.years ?? 0,
    months: user.totalExperience?.months ?? 0,
  },
  experience: (user.experience ?? []).map((item) => ({
    ...blankExperience(),
    ...item,
    startDate: isoDay(item.startDate),
    endDate: isoDay(item.endDate),
  })),
  education: (user.education ?? []).map((item) => ({
    ...blankEducation(),
    ...item,
    startYear: item.startYear ?? "",
    endYear: item.endYear ?? "",
  })),
  resume: {
    url: user.resume?.url ?? "",
    fileName: user.resume?.fileName ?? "",
  },
  preferredJobTitle: user.preferredJobTitle ?? "",
  preferredLocation: user.preferredLocation ?? [],
  expectedSalary: {
    min: user.expectedSalary?.min ?? "",
    max: user.expectedSalary?.max ?? "",
  },
  noticePeriod: user.noticePeriod ?? "",
});

/**
 * Turns the draft back into the body `PUT /auth/profile` expects: no `_key`
 * rows, real numbers instead of input strings, empty dates as null. `email`
 * and `role` are deliberately never sent.
 */
const toPayload = (draft) => ({
  name: draft.name,
  phone: draft.phone,
  location: draft.location,
  headline: draft.headline,
  bio: draft.bio,
  workStatus: draft.workStatus,
  skills: draft.skills,
  totalExperience: {
    years: toNumber(draft.totalExperience.years) ?? 0,
    months: toNumber(draft.totalExperience.months) ?? 0,
  },
  experience: draft.experience.map((row) => {
    const { startDate, endDate, currentlyWorking, ...rest } = stripKey(row);

    return {
      ...rest,
      currentlyWorking,
      startDate: startDate || null,
      endDate: currentlyWorking ? null : endDate || null,
    };
  }),
  education: draft.education.map((row) => {
    const { startYear, endYear, ...rest } = stripKey(row);

    return {
      ...rest,
      startYear: toNumber(startYear),
      endYear: toNumber(endYear),
    };
  }),
  resume: { ...draft.resume },
  preferredJobTitle: draft.preferredJobTitle,
  preferredLocation: draft.preferredLocation,
  expectedSalary: {
    min: toNumber(draft.expectedSalary.min),
    max: toNumber(draft.expectedSalary.max),
  },
  noticePeriod: draft.noticePeriod,
});

/**
 * Local edit state for the profile screen, plus `save`, which sends the draft
 * to `PUT /auth/profile` through AuthContext's `updateProfile`.
 */
export function useProfileDraft(user) {
  const { updateProfile } = useAuth();

  const [draft, setDraft] = useState(() => fromUser(user));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // `useState` only reads its initialiser once, so re-seed the draft whenever
  // AuthContext swaps in a new user object (a save, or a session restore).
  const seededUser = useRef(user);

  useEffect(() => {
    if (seededUser.current === user) return;

    seededUser.current = user;
    setDraft(fromUser(user));
    setDirty(false);
  }, [user]);

  const touch = () => setDirty(true);

  const setField = useCallback((name, value) => {
    setDraft((current) => ({ ...current, [name]: value }));
    touch();
  }, []);

  const setGroupField = useCallback((group, name, value) => {
    setDraft((current) => ({
      ...current,
      [group]: { ...current[group], [name]: value },
    }));
    touch();
  }, []);

  const addRow = useCallback((list, blank) => {
    setDraft((current) => ({
      ...current,
      [list]: [...current[list], blank()],
    }));
    touch();
  }, []);

  const updateRow = useCallback((list, key, name, value) => {
    setDraft((current) => ({
      ...current,
      [list]: current[list].map((row) =>
        row._key === key ? { ...row, [name]: value } : row,
      ),
    }));
    touch();
  }, []);

  const removeRow = useCallback((list, key) => {
    setDraft((current) => ({
      ...current,
      [list]: current[list].filter((row) => row._key !== key),
    }));
    touch();
  }, []);

  const reset = useCallback(() => {
    setDraft(fromUser(user));
    setDirty(false);
    setError("");
  }, [user]);

  const save = useCallback(async () => {
    setSaving(true);
    setError("");

    try {
      const data = await updateProfile(toPayload(draft));

      setDirty(false);

      return data;
    } catch (err) {
      setError(
        err?.friendlyMessage ??
          err?.response?.data?.message ??
          "Could not save your profile. Please try again.",
      );

      throw err;
    } finally {
      setSaving(false);
    }
  }, [draft, updateProfile]);

  return {
    draft,
    dirty,
    saving,
    error,
    setField,
    setGroupField,
    addRow,
    updateRow,
    removeRow,
    reset,
    save,
    markSaved: () => setDirty(false),
  };
}

export default useProfileDraft;
