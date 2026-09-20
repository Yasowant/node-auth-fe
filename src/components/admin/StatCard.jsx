/** One headline number, with an optional line of context under it. */
const StatCard = ({ icon, label, value, hint }) => (
  <article className="stat-card">
    <span className="stat-card-icon" aria-hidden="true">
      {icon}
    </span>

    <span className="stat-card-body">
      <span className="stat-card-label">{label}</span>
      <strong className="stat-card-value">{value}</strong>
      {hint ? <span className="stat-card-hint">{hint}</span> : null}
    </span>
  </article>
);

export default StatCard;
