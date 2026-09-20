import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import ChoiceGroup from "../components/ChoiceGroup";
import FormField from "../components/FormField";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { useFormSubmit } from "../hooks/useFormSubmit";

// Mirrors the workStatus enum on the User model.
const WORK_STATUS_OPTIONS = [
  {
    value: "FRESHER",
    title: "Fresher",
    note: "Studying or less than a year in",
  },
  {
    value: "EXPERIENCED",
    title: "Experienced",
    note: "A year or more of work",
  },
];

// Matches the 6-character minimum enforced by the User schema.
const MIN_PASSWORD_LENGTH = 6;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    name: "",
    email: "",
    password: "",
    workStatus: "",
  });

  const handleRegister = useCallback(async () => {
    await register({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      workStatus: values.workStatus,
    });

    navigate("/login", { replace: true, state: { registered: true } });
  }, [
    navigate,
    register,
    values.email,
    values.name,
    values.password,
    values.workStatus,
  ]);

  const { submitting, error, onSubmit } = useFormSubmit(handleRegister, {
    fallbackMessage: "Registration failed. Please try again.",
  });

  return (
    <AuthLayout
      heading="Your next role starts here"
      blurb="Create a free account to apply faster and keep every application in one place."
    >
      <AuthCard
        title="Create your account"
        subtitle="It takes about a minute."
        onSubmit={onSubmit}
        error={error}
      >
        <FormField
          label="Full name"
          name="name"
          placeholder="Jane Doe"
          autoComplete="name"
          minLength={2}
          value={values.name}
          onChange={handleChange}
        />

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
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          value={values.password}
          onChange={handleChange}
        />

        <ChoiceGroup
          legend="Where are you in your career?"
          name="workStatus"
          value={values.workStatus}
          onChange={handleChange}
          options={WORK_STATUS_OPTIONS}
        />

        <SubmitButton loading={submitting} loadingLabel="Creating account...">
          Create account
        </SubmitButton>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default Register;
