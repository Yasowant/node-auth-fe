import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { useFormSubmit } from "../hooks/useFormSubmit";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm({ email: "", password: "" });

  const redirectTo = location.state?.from || "/dashboard";
  const justRegistered = Boolean(location.state?.registered);

  const handleLogin = useCallback(async () => {
    await login(values.email.trim(), values.password);
    navigate(redirectTo, { replace: true });
  }, [login, navigate, redirectTo, values.email, values.password]);

  const { submitting, error, onSubmit } = useFormSubmit(handleLogin, {
    fallbackMessage: "Login failed. Please try again.",
  });

  return (
    <AuthLayout
      heading="Welcome back"
      blurb="Log in to pick up your applications where you left off."
    >
      <AuthCard
        title="Log in"
        subtitle="Enter your details to continue."
        onSubmit={onSubmit}
        error={error}
        success={justRegistered ? "Account created. Log in to continue." : ""}
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

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
        />

        <p className="auth-inline">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <SubmitButton loading={submitting} loadingLabel="Signing in...">
          Log in
        </SubmitButton>

        <p className="auth-alt">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
