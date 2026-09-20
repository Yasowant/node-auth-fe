import RoleTag from "./RoleTag";
import { ChevronIcon } from "../icons";
import {
  WORK_STATUS_LABELS,
  formatRelative,
  initialsOf,
  profileScore,
} from "../../utils/adminUsers";

const ProfileBar = ({ score }) => (
  <span className="profile-score">
    <span className="profile-track">
      <span className="profile-fill" style={{ width: `${score}%` }} />
    </span>
    <span className="profile-value">{score}%</span>
  </span>
);

const NameCell = ({ user, currentUserId }) => (
  <span className="cell-user">
    <span className="header-avatar" aria-hidden="true">
      {initialsOf(user.name)}
    </span>

    <span className="cell-user-text">
      <strong>
        {user.name}
        {user._id === currentUserId ? (
          <span className="pill pill-brand">You</span>
        ) : null}
      </strong>
      <small>{user.email}</small>
    </span>
  </span>
);

const StatusFlag = ({ user }) => (
  <span className={`dot-flag${user.isActive === false ? " is-off" : ""}`}>
    {user.isActive === false ? "Deactivated" : "Active"}
  </span>
);

/** Narrow screens get the same rows as a stack of cards -- a seven column
 *  table only survives sideways scrolling, which nobody enjoys on a phone. */
const UserCards = ({ users, selectedId, onSelect, currentUserId }) => (
  <ul className="user-cards">
    {users.map((user) => (
      <li key={user._id}>
        <button
          type="button"
          className={`user-card${selectedId === user._id ? " is-selected" : ""}`}
          onClick={() => onSelect(user)}
        >
          <NameCell user={user} currentUserId={currentUserId} />

          <span className="tag-row">
            <RoleTag role={user.role} />
            {user.workStatus ? (
              <span className="tag">
                {WORK_STATUS_LABELS[user.workStatus] ?? user.workStatus}
              </span>
            ) : null}
            <StatusFlag user={user} />
          </span>

          <span className="user-card-foot">
            <ProfileBar score={profileScore(user)} />
            <span className="cell-muted">{formatRelative(user.createdAt)}</span>
          </span>
        </button>
      </li>
    ))}
  </ul>
);

const UserTable = ({ users, selectedId, onSelect, currentUserId }) => (
  <>
    <UserCards
      users={users}
      selectedId={selectedId}
      onSelect={onSelect}
      currentUserId={currentUserId}
    />

    <div className="table-scroll">
      <table className="admin-table">
        <caption className="visually-hidden">
          Registered users. Select a row to see the full profile.
        </caption>

        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Role</th>
            <th scope="col">Work status</th>
            <th scope="col">Profile</th>
            <th scope="col">Joined</th>
            <th scope="col">Account</th>
            <th scope="col">
              <span className="visually-hidden">Open profile</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className={`admin-row${selectedId === user._id ? " is-selected" : ""}`}
              onClick={() => onSelect(user)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(user);
                }
              }}
            >
              <td>
                <NameCell user={user} currentUserId={currentUserId} />
              </td>

              <td>
                <RoleTag role={user.role} />
              </td>

              <td>
                {user.workStatus ? (
                  <span className="tag">
                    {WORK_STATUS_LABELS[user.workStatus] ?? user.workStatus}
                  </span>
                ) : (
                  <span className="cell-empty">--</span>
                )}
              </td>

              <td>
                <ProfileBar score={profileScore(user)} />
              </td>

              <td>
                <span className="cell-muted">
                  {formatRelative(user.createdAt)}
                </span>
              </td>

              <td>
                <span className="cell-flags">
                  <StatusFlag user={user} />

                  {user.isEmailVerified ? null : (
                    <span className="cell-muted">Email unverified</span>
                  )}
                </span>
              </td>

              <td className="cell-action">
                <ChevronIcon />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default UserTable;
