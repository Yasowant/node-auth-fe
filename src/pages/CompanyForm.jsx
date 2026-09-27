import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import Field from "../components/profile/Field";
import TagInput from "../components/profile/TagInput";
import { createCompany, updateCompany } from "../api/company";
import { useCompany } from "../hooks/useCompany";
import { useFormSubmit } from "../hooks/useFormSubmit";
import NotificationBell from "../components/NotificationBell";

// Mirrors the size enum on the Company model.
const SIZE_OPTIONS = [
  { value: "", label: "Select a size" },
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const BLANK = {
  name: "",
  slug: "",
  website: "",
  industry: "",
  size: "",
  about: "",
  locations: [],
};

/** Create-or-edit: a recruiter with no company yet gets a create form; one
 *  who already has a company edits it here instead (POST vs PUT). */
const CompanyForm = () => {
  const navigate = useNavigate();
  const { company, loading, error: loadError } = useCompany();
  const [values, setValues] = useState(BLANK);
  const [slugTouched, setSlugTouched] = useState(false);

  // `useState` only reads its initialiser once, so re-seed the form the one
  // time useCompany's fetch resolves with an existing company (mirrors
  // useProfileDraft's seededUser pattern).
  const seededCompany = useRef(null);

  useEffect(() => {
    if (!company || seededCompany.current === company) return;

    seededCompany.current = company;

    setValues({
      name: company.name ?? "",
      slug: company.slug ?? "",
      website: company.website ?? "",
      industry: company.industry ?? "",
      size: company.size ?? "",
      about: company.about ?? "",
      locations: company.locations ?? [],
    });
    setSlugTouched(true);
  }, [company]);

  const setField = (name) => (event) => {
    const { value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
      // The slug tracks the name until the recruiter edits it directly.
      ...(name === "name" && !slugTouched ? { slug: slugify(value) } : {}),
    }));
  };

  const setSlug = (event) => {
    setSlugTouched(true);
    setValues((previous) => ({ ...previous, slug: event.target.value }));
  };

  const { submitting, error, onSubmit } = useFormSubmit(
    async () => {
      const payload = {
        name: values.name.trim(),
        slug: slugify(values.slug),
        website: values.website.trim() || undefined,
        industry: values.industry.trim() || undefined,
        size: values.size || undefined,
        about: values.about.trim() || undefined,
        locations: values.locations,
      };

      if (company) {
        await updateCompany(company._id, payload);
      } else {
        await createCompany(payload);
      }

      navigate("/recruiter", { replace: true });
    },
    { fallbackMessage: "Couldn't save your company. Please try again." },
  );

  if (loading) {
    return (
      <>
        <AppHeader>
          <NotificationBell />
          <AccountMenu />
        </AppHeader>
        <main className="page">
          <div className="empty-state">
            <h2>Loading…</h2>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader>
        <AccountMenu />
      </AppHeader>

      <main className="page">
        <div className="board-head">
          <div>
            <h1>{company ? "Edit your company" : "Create your company"}</h1>
            <p className="field-hint">
              {company
                ? "This is what candidates see on every job you post."
                : "You need a company before you can post a job."}
            </p>
          </div>
        </div>

        {loadError ? (
          <p className="alert alert-error" role="alert">
            {loadError}
          </p>
        ) : null}

        <form className="pf-panel" onSubmit={onSubmit}>
          <div className="pf-panel-head">
            <h2>Company details</h2>
            <p>Name and slug are required; everything else is optional.</p>
          </div>

          <div className="pf-grid">
            <Field
              label="Company name"
              value={values.name}
              onChange={setField("name")}
              placeholder="Acme Inc."
              required
            />

            <Field
              label="Slug"
              value={values.slug}
              onChange={setSlug}
              placeholder="acme-inc"
              hint="Used in the company's URL. Letters, numbers and hyphens only."
              required
            />

            <Field
              label="Website"
              type="url"
              value={values.website}
              onChange={setField("website")}
              placeholder="https://acme.com"
            />

            <Field
              label="Industry"
              value={values.industry}
              onChange={setField("industry")}
              placeholder="Software"
            />

            <Field
              label="Company size"
              as="select"
              options={SIZE_OPTIONS}
              value={values.size}
              onChange={setField("size")}
            />

            <TagInput
              label="Locations"
              values={values.locations}
              onChange={(locations) =>
                setValues((previous) => ({ ...previous, locations }))
              }
              placeholder="Bengaluru, then Enter"
              hint="Cities you hire from. Enter or comma adds one."
            />

            <Field
              label="About"
              as="textarea"
              span={2}
              maxLength={2000}
              value={values.about}
              onChange={setField("about")}
              placeholder="What the company does, and what it's like to work there."
              hint={`${values.about.length}/2000`}
            />
          </div>

          <footer className="pf-panel-foot">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Saving…"
                : company
                  ? "Save changes"
                  : "Create company"}
            </button>

            {error ? (
              <span className="pf-note pf-note-error" role="alert">
                {error}
              </span>
            ) : null}
          </footer>
        </form>
      </main>
    </>
  );
};

export default CompanyForm;
