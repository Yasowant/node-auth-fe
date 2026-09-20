import { Link } from "react-router-dom";

import HeroMock from "./HeroMock";
import { ArrowIcon } from "../icons";

const Hero = ({ user }) => (
  <section className="hero">
    <div className="container hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">Free for job seekers</span>

        <h1>
          Find the job that <span className="text-brand">fits your life</span>
        </h1>

        <p className="hero-sub">
          WorkWise keeps the whole search in one place: your profile, the roles
          you have saved and every application you have sent. Sign in to open
          the board.
        </p>

        <div className="hero-actions">
          {user ? (
            <Link className="btn btn-primary btn-lg" to="/dashboard">
              Open your job board
              <ArrowIcon />
            </Link>
          ) : (
            <>
              <Link className="btn btn-primary btn-lg" to="/register">
                Create a free account
                <ArrowIcon />
              </Link>
              <Link className="btn btn-outline btn-lg" to="/login">
                I already have one
              </Link>
            </>
          )}
        </div>

        <p className="hero-meta">
          No roles are posted yet -- set up your profile now and the board is
          ready the moment listings go up.
        </p>
      </div>

      <HeroMock />
    </div>
  </section>
);

export default Hero;
