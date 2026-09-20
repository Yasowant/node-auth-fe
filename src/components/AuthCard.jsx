import { Link } from "react-router-dom";

/** The form column of an auth screen: heading, feedback, fields. */
const AuthCard = ({ title, subtitle, onSubmit, error, success, children }) => (
  <form className="auth-form" onSubmit={onSubmit}>
    <Link className="auth-back" to="/">
      &larr; Back to home
    </Link>

    <div className="auth-form-head">
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>

    {error ? (
      <p className="alert alert-error" role="alert">
        {error}
      </p>
    ) : null}

    {success ? (
      <p className="alert alert-success" role="status">
        {success}
      </p>
    ) : null}

    {children}
  </form>
);

export default AuthCard;
