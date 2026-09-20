import { Link } from "react-router-dom";

import Logo, { BRAND_NAME } from "./Logo";

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <Logo />
          <p className="field-hint" style={{ maxWidth: "34ch" }}>
            A simpler way to find work you actually want.
          </p>
        </div>

        <div>
          <h4>For candidates</h4>
          <ul>
            <li>
              <Link to="/register">Create an account</Link>
            </li>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <a href="#how-it-works">How it works</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="#features">Why WorkWise</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#top">About</a>
            </li>
            <li>
              <a href="#top">Contact</a>
            </li>
          </ul>
        </div>
      </div>

      <p className="footer-note">
        {BRAND_NAME} is a demo project. No roles have been posted yet.
      </p>
    </div>
  </footer>
);

export default SiteFooter;
