import { Link } from "react-router-dom";

export const BRAND_NAME = "WorkWise";

const Logo = ({ to = "/" }) => (
  <Link className="brand" to={to}>
    <span className="brand-mark" aria-hidden="true">
      W
    </span>
    {BRAND_NAME}
  </Link>
);

export default Logo;
