import { useState } from "react";
import { Link } from "react-router-dom";

import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import StatCard from "../components/admin/StatCard";
import UserDetail from "../components/admin/UserDetail";
import UserFilters from "../components/admin/UserFilters";
import UserTable from "../components/admin/UserTable";
import {
  ClockIcon,
  PulseIcon,
  RefreshIcon,
  ShieldIcon,
  UsersIcon,
} from "../components/icons";
import { useAuth } from "../hooks/useAuth";
import { useUserDirectory } from "../hooks/useUserDirectory";
import { summarise } from "../utils/adminUsers";

const Admin = () => {
  const { user, users, usersLoading, usersError, refetchUsers } = useAuth();

  const directory = useUserDirectory(users);
  const [selected, setSelected] = useState(null);

  const stats = summarise(users);

  return (
    <>
      <AppHeader>
        <Link className="btn btn-ghost" to="/dashboard">
          Job board
        </Link>

        <AccountMenu />
      </AppHeader>

      <main className="page">
        <div className="board-head">
          <div>
            <span className="eyebrow">Admin</span>
            <h1>User directory</h1>
            <p className="field-hint">
              Everyone registered on WorkWise. This view is read-only -- the API
              exposes no user write routes yet.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => refetchUsers()}
            disabled={usersLoading}
          >
            <RefreshIcon />
            {usersLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {usersError ? (
          <div className="alert alert-error">
            <strong>Could not load users.</strong> The directory needs an admin
            session -- try refreshing, or sign in again if the session expired.
          </div>
        ) : null}

        <div className="stat-grid">
          <StatCard
            icon={<UsersIcon />}
            label="Total users"
            value={stats.total}
            hint={
              stats.total
                ? `${stats.byRole.USER} candidates · ${stats.byRole.RECRUITER} recruiters · ${stats.byRole.ADMIN} admin${stats.byRole.ADMIN === 1 ? "" : "s"}`
                : "Nobody has registered yet"
            }
          />

          <StatCard
            icon={<ClockIcon />}
            label="Joined this week"
            value={stats.newThisWeek}
            hint="Accounts created in the last 7 days"
          />

          <StatCard
            icon={<ShieldIcon />}
            label="Active accounts"
            value={stats.active}
            hint={`${stats.inactive} deactivated account${stats.inactive === 1 ? "" : "s"}`}
          />

          <StatCard
            icon={<PulseIcon />}
            label="Avg. profile filled"
            value={`${stats.averageProfile}%`}
            hint={`${stats.verifiedPercent}% have verified their email`}
          />
        </div>

        <section className="panel admin-panel">
          <UserFilters directory={directory} />

          <div className="results-bar">
            <p>
              {directory.results.length === 0 ? (
                users.length === 0 ? (
                  "No users yet"
                ) : (
                  "No users match"
                )
              ) : (
                <>
                  Showing <strong>{directory.rangeStart}</strong>-
                  <strong>{directory.rangeEnd}</strong> of{" "}
                  {directory.results.length}
                  {directory.activeFilters > 0 ? " matching" : ""} users
                </>
              )}
            </p>

            {directory.activeFilters > 0 ? (
              <button
                type="button"
                className="link-button"
                onClick={directory.reset}
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {usersLoading && users.length === 0 ? (
            <div className="empty-state">
              <p>Loading users...</p>
            </div>
          ) : directory.visible.length > 0 ? (
            <>
              <UserTable
                users={directory.visible}
                selectedId={selected?._id}
                currentUserId={user.id ?? user._id}
                onSelect={setSelected}
              />

              {directory.pageCount > 1 ? (
                <nav className="pager" aria-label="Pagination">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => directory.setPage(directory.page - 1)}
                    disabled={directory.page === 1}
                  >
                    Previous
                  </button>

                  <span>
                    Page {directory.page} of {directory.pageCount}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => directory.setPage(directory.page + 1)}
                    disabled={directory.page === directory.pageCount}
                  >
                    Next
                  </button>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="empty-state">
              <p>
                {users.length === 0
                  ? "No users have registered yet."
                  : "No users match those filters."}
              </p>

              {directory.activeFilters > 0 ? (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={directory.reset}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          )}
        </section>
      </main>

      <UserDetail user={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default Admin;
