import { useState } from "react";
import { Link } from "react-router-dom";

import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import AboutSection from "../components/profile/AboutSection";
import BasicsSection from "../components/profile/BasicsSection";
import EducationSection from "../components/profile/EducationSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import PreferencesSection from "../components/profile/PreferencesSection";
import ProfileNav from "../components/profile/ProfileNav";
import ResumeSection from "../components/profile/ResumeSection";
import {
  BriefcaseIcon,
  CapIcon,
  FileIcon,
  SlidersIcon,
  SparkIcon,
  UserIcon,
} from "../components/icons";
import { useAuth } from "../hooks/useAuth";
import { useProfileDraft } from "../hooks/useProfileDraft";

const filled = (...values) => values.filter(Boolean).length;

const SECTIONS = [
  {
    id: "basics",
    label: "Basics",
    icon: <UserIcon />,
    total: 4,
    done: (d) => filled(d.name, d.phone, d.location, d.headline),
  },
  {
    id: "about",
    label: "About and skills",
    icon: <SparkIcon />,
    total: 2,
    done: (d) => filled(d.bio, d.skills.length),
  },
  {
    id: "experience",
    label: "Experience",
    icon: <BriefcaseIcon />,
    total: 1,
    done: (d) => filled(d.experience.length),
  },
  {
    id: "education",
    label: "Education",
    icon: <CapIcon />,
    total: 1,
    done: (d) => filled(d.education.length),
  },
  {
    id: "resume",
    label: "Resume",
    icon: <FileIcon />,
    total: 1,
    done: (d) => filled(d.resume.fileName),
  },
  {
    id: "preferences",
    label: "Job preferences",
    icon: <SlidersIcon />,
    total: 4,
    done: (d) =>
      filled(
        d.preferredJobTitle,
        d.preferredLocation.length,
        d.expectedSalary.min || d.expectedSalary.max,
        d.noticePeriod,
      ),
  },
];

const TOTAL = SECTIONS.reduce((sum, section) => sum + section.total, 0);

const Profile = () => {
  const { user } = useAuth();
  const form = useProfileDraft(user);
  const [active, setActive] = useState("basics");

  const score = Math.round(
    (SECTIONS.reduce(
      (sum, section) => sum + Math.min(section.done(form.draft), section.total),
      0,
    ) /
      TOTAL) *
      100,
  );

  const panels = {
    basics: <BasicsSection email={user.email} form={form} />,
    about: <AboutSection form={form} />,
    experience: <ExperienceSection form={form} />,
    education: <EducationSection form={form} />,
    resume: <ResumeSection form={form} />,
    preferences: <PreferencesSection form={form} />,
  };

  return (
    <>
      <AppHeader>
        <Link className="btn btn-ghost" to="/dashboard">
          Job board
        </Link>

        <AccountMenu />
      </AppHeader>

      <main className="page">
        <div className="board-head">
          <div>
            <h1>Your profile</h1>
            <p className="field-hint">
              This is what a recruiter sees when you apply. Fill it in once.
            </p>
          </div>

          {form.dirty ? (
            <span className="tag tag-brand">Unsaved changes</span>
          ) : null}
        </div>

        <div className="mock-meter pf-meter">
          <div className="mock-meter-head">
            <span>Profile completeness</span>
            <strong>{score}%</strong>
          </div>
          <div className="mock-meter-track">
            <div className="mock-meter-fill" style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="pf-layout">
          <ProfileNav
            sections={SECTIONS}
            active={active}
            onSelect={setActive}
            draft={form.draft}
          />

          <div>{panels[active]}</div>
        </div>
      </main>
    </>
  );
};

export default Profile;
