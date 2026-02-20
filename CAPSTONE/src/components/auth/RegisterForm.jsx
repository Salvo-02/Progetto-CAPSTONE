import { useState, useMemo } from "react";

const initialState = {
  email: "",
  username: "",
  fullName: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setGlobalError("");
  };

  // =========================
  // VALIDAZIONI PASSWORD
  // =========================

  const hasMinLength = form.password.length >= 6;
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasLowercase = /[a-z]/.test(form.password);
  const hasDigit = /[0-9]/.test(form.password);
  const passwordsMatch = form.password === form.confirmPassword;

  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasDigit && passwordsMatch;

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  }, [form.email]);

  const isFullNameValid = form.fullName.trim().length >= 3;
  const isUsernameValid = form.username.trim().length >= 3;

  const isFormValid = isEmailValid && isPasswordValid && isFullNameValid && isUsernameValid;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setGlobalError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${baseUrl}/api/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          username: form.username.trim(),
          fullName: form.fullName.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw data || { message: "Registration failed" };
      }

      setSuccessMessage("Account created successfully.");
      setForm(initialState);
    } catch (err) {
      setGlobalError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gym-register-container">
      <form className="gym-register-card" onSubmit={onSubmit}>
        <h2 className="gym-title">Join The Elite</h2>

        <input className="gym-input" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />

        <input className="gym-input" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />

        <input className="gym-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />

        <input className="gym-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

        <div className="password-rules">
          <span className={hasMinLength ? "valid" : "invalid"}>• Min 6 characters</span>
          <span className={hasUppercase ? "valid" : "invalid"}>• 1 uppercase</span>
          <span className={hasLowercase ? "valid" : "invalid"}>• 1 lowercase</span>
          <span className={hasDigit ? "valid" : "invalid"}>• 1 number</span>
        </div>

        <input
          className="gym-input"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {!passwordsMatch && form.confirmPassword && <div className="error-text">Passwords do not match</div>}

        {globalError && <div className="error-text global">{globalError}</div>}

        {successMessage && <div className="success-text">{successMessage}</div>}

        <button className="gym-button" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
