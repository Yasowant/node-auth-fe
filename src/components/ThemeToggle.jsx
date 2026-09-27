import { MoonIcon, SunIcon } from "./icons";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      <span className="visually-hidden">
        Switch to {theme === "dark" ? "light" : "dark"} mode
      </span>
    </button>
  );
};

export default ThemeToggle;
