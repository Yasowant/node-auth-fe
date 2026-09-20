const SubmitButton = ({ loading = false, loadingLabel, children }) => (
  <button
    type="submit"
    className="btn btn-primary btn-block"
    disabled={loading}
  >
    {loading ? (loadingLabel ?? "Please wait...") : children}
  </button>
);

export default SubmitButton;
