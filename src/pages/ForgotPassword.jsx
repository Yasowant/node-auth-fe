import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { useFormSubmit } from "../hooks/useFormSubmit";

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const { values, handleChange, reset } = useForm({ email: "" });
  const [sent, setSent] = useState("");

  const handleRequest = useCallback(async () => {
    const data = await requestPasswordReset(values.email.trim());

    // The API deliberately answers the same way whether or not the address
    // exists, so show its message as-is.
    setSent(
      data?.message || "If that email exists, a reset link will be sent.",
    );
    reset();
  }, [requestPasswordReset, reset, values.email]);

  const { submitting, error, onSubmit } = useFormSubmit(handleRequest, {
    fallbackMessage: "Could not send the reset link. Please try again.",
  });

  return (
    <AuthLayout
      heading="Happens to everyone"
      blurb="Tell us the email on your account and we will send reset instructions."
      points={[
        "Reset links expire after 15 minutes",
        "Resetting signs you out everywhere",
        "Your applications stay untouched",
      ]}
    >
      <AuthCard
        title="Forgot password"
        subtitle="We will email you a link to set a new one."
        onSubmit={onSubmit}
        error={error}
        success={sent}
      >
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
        />

        <SubmitButton loading={submitting} loadingLabel="Sending...">
          Send reset link
        </SubmitButton>

        <p className="auth-alt">
          Remembered it? <Link to="/login">Back to log in</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPassword;
