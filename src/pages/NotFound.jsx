import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="full-page-message">
    <h1 style={{ fontSize: "3rem" }}>404</h1>
    <p>That page does not exist.</p>
    <Link className="btn btn-primary" to="/">
      Back to home
    </Link>
  </div>
);

export default NotFound;
