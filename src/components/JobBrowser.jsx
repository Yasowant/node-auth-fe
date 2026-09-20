import { useState } from "react";

import FilterRail from "./landing/FilterRail";
import JobCard from "./JobCard";
import JobSearchBar from "./JobSearchBar";
import { SORTS } from "../data/jobs";
import { useJobSearch } from "../hooks/useJobSearch";
import ApplyModal from "./ApplyModal";

/** The signed-in job board: search, facets, sort and saved roles. */
const JobBrowser = () => {
  const search = useJobSearch();
  const [saved, setSaved] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [applyTarget, setApplyTarget] = useState(null);

  const toggleSave = (id) =>
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const handleApplySuccess = () => {
    setAppliedIds((current) => {
      new Set(current).add(applyTarget.id);
      setApplyTarget(null);
    });
  };

  if (search.loading) {
    return (
      <div className="empty-state">
        <h2>Loading jobs…</h2>
        <p>Fetching the latest active roles from the board.</p>
      </div>
    );
  }

  if (search.error) {
    return (
      <div className="empty-state">
        <h2>Couldn't load jobs</h2>
        <p>{search.error}</p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={search.refetch}
        >
          Try again
        </button>
      </div>
    );
  }

  // Nothing has been posted yet, so search and filters would only be controls
  // over an empty list. Show the empty board on its own instead.
  if (search.total === 0) {
    return (
      <div className="empty-state">
        <h2>No jobs posted yet</h2>
        <p>
          There are no roles on the board right now. New listings will show up
          here as soon as employers start posting.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="board-search">
        <JobSearchBar filters={search.filters} onChange={search.setText} />
      </div>

      <div className="jobs-layout">
        <FilterRail
          filters={search.filters}
          onToggle={search.toggleFacet}
          onClear={search.clearAll}
          activeCount={search.activeCount}
        />

        <div>
          <div className="results-bar">
            <p>
              <strong>{search.results.length}</strong> of {search.total} roles
              {search.activeCount > 0 ? " match your filters" : ""}
              {saved.length > 0 ? ` · ${saved.length} saved` : ""}
            </p>

            <label className="sort-control">
              <span>Sort by</span>
              <select
                className="input"
                value={search.sort}
                onChange={(event) => search.setSort(event.target.value)}
              >
                {Object.entries(SORTS).map(([key, option]) => (
                  <option value={key} key={key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {search.results.length > 0 ? (
            <div className="card-grid">
              {search.results.map((job) => (
                <JobCard
                  job={job}
                  key={job.id}
                  saved={saved.includes(job.id)}
                  onToggleSave={toggleSave}
                  applied={appliedIds.has(job.id)}
                  onApply={setApplyTarget}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No roles match those filters.</p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={search.clearAll}
              >
                Clear filters
              </button>
            </div>
          )}

          {applyTarget ? (
            <ApplyModal
              job={applyTarget}
              onClose={() => setApplyTarget(null)}
              onSuccess={handleApplySuccess}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default JobBrowser;
