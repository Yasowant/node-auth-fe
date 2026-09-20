import { SORTS } from "../../hooks/useUserDirectory";
import { ROLE_LABELS, ROLES } from "../../utils/adminUsers";
import { SearchIcon } from "../icons";

const STATUSES = [
  { id: "all", label: "Any status" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Deactivated" },
  { id: "verified", label: "Email verified" },
  { id: "unverified", label: "Unverified" },
];

const UserFilters = ({ directory }) => (
  <div className="admin-toolbar">
    <div className="search-field admin-search">
      <SearchIcon />
      <label className="visually-hidden" htmlFor="admin-search">
        Search users by name, email or location
      </label>
      <input
        id="admin-search"
        className="input"
        type="search"
        placeholder="Search name, email or location"
        value={directory.query}
        onChange={(event) => directory.setQuery(event.target.value)}
      />
    </div>

    <div className="segmented" role="group" aria-label="Filter by role">
      <button
        type="button"
        className={`segment${directory.role === "all" ? " is-active" : ""}`}
        onClick={() => directory.setRole("all")}
      >
        All roles
      </button>

      {ROLES.map((role) => (
        <button
          type="button"
          key={role}
          className={`segment${directory.role === role ? " is-active" : ""}`}
          onClick={() => directory.setRole(role)}
        >
          {ROLE_LABELS[role]}
        </button>
      ))}
    </div>

    <label className="sort-control">
      <span className="visually-hidden">Status</span>
      <select
        className="input"
        value={directory.status}
        onChange={(event) => directory.setStatus(event.target.value)}
      >
        {STATUSES.map((option) => (
          <option value={option.id} key={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>

    <label className="sort-control">
      <span>Sort</span>
      <select
        className="input"
        value={directory.sort}
        onChange={(event) => directory.setSort(event.target.value)}
      >
        {Object.entries(SORTS).map(([key, option]) => (
          <option value={key} key={key}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  </div>
);

export default UserFilters;
