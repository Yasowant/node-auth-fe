import { PinIcon, SearchIcon } from "./icons";

/** Keyword + location inputs. Results update as you type, so there is no
 *  submit button -- the form only exists to keep Enter from reloading. */
const JobSearchBar = ({ filters, onChange }) => (
  <form
    className="search-bar"
    role="search"
    onSubmit={(event) => event.preventDefault()}
  >
    <div className="search-field">
      <SearchIcon />
      <label className="visually-hidden" htmlFor="search-keyword">
        Job title, company or skill
      </label>
      <input
        id="search-keyword"
        className="input"
        name="keyword"
        type="search"
        placeholder="Job title or skill"
        value={filters.keyword}
        onChange={onChange}
      />
    </div>

    <div className="search-field">
      <PinIcon />
      <label className="visually-hidden" htmlFor="search-location">
        Location
      </label>
      <input
        id="search-location"
        className="input"
        name="location"
        type="search"
        placeholder="City or remote"
        value={filters.location}
        onChange={onChange}
      />
    </div>
  </form>
);

export default JobSearchBar;
