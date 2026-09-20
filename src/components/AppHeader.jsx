import Logo from "./Logo";

const AppHeader = ({ children }) => (
  <header className="site-nav app-header">
    <div className="container">
      <Logo to="/" />
      <div className="nav-actions">{children}</div>
    </div>
  </header>
);

export default AppHeader;
