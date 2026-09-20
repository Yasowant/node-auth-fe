import { Link } from "react-router-dom";

import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { ArrowIcon } from "../components/icons";
import Faq from "../components/landing/Faq";
import Hero from "../components/landing/Hero";
import { FEATURES } from "../data/jobs";
import { useAuth } from "../hooks/useAuth";

const STEPS = [
  {
    title: "Create your account",
    body: "Name, email and whether you are a fresher or experienced. That is the whole form.",
  },
  {
    title: "Open your board",
    body: "Signing in unlocks the job board, where you can filter by work mode, contract type and experience.",
  },
  {
    title: "Save and track",
    body: "Bookmark what looks close and keep every application in one list instead of a spreadsheet.",
  },
];

const Landing = () => {
  const { user } = useAuth();
  const primaryTo = user ? "/dashboard" : "/register";

  return (
    <>
      <SiteNav />

      <main id="top">
        <Hero user={user} />

        <section className="section" id="features">
          <div className="container">
            <div className="section-head">
              <h2>Built around the boring parts</h2>
              <p>
                The searching is the easy bit. Everything around it is what
                wears people down.
              </p>
            </div>

            <div className="feature-grid">
              {FEATURES.map((feature) => (
                <div className="feature-card" key={feature.title}>
                  <span className="feature-icon" aria-hidden="true">
                    {feature.icon}
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt" id="how-it-works">
          <div className="container">
            <div className="section-head">
              <h2>How it works</h2>
              <p>Three steps between you and your next role.</p>
            </div>

            <div className="steps">
              {STEPS.map((step, index) => (
                <div className="step" key={step.title}>
                  <div className="step-number" aria-hidden="true">
                    {index + 1}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container faq-layout">
            <div className="section-head">
              <h2>Questions</h2>
              <p>Short answers to the things people ask first.</p>
            </div>

            <Faq />
          </div>
        </section>

        <section className="section-tight">
          <div className="container">
            <div className="cta-band">
              <h2>{user ? "Pick up where you left off" : "Ready to start?"}</h2>
              <p>
                {user
                  ? "Your profile is set up. Open the board to keep going."
                  : "Create a free account so your profile is ready the moment roles go up."}
              </p>

              <Link className="btn btn-white btn-lg" to={primaryTo}>
                {user ? "Open your job board" : "Create a free account"}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
};

export default Landing;
