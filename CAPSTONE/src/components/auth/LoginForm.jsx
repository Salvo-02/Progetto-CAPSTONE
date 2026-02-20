import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { submitLogin, updateLoginField } from "../../redux/action/AuthActions";

const initialState = { email: "", password: "" };

const LoginForm = ({ errors, loading }) => {
  const [form, setForm] = useState(initialState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  // ✅ redirect dopo login OK
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ aggiorno redux form (se la tua validazione usa state.auth.form)
    dispatch(updateLoginField("email", form.email));
    dispatch(updateLoginField("password", form.password));

    // ✅ login async
    dispatch(submitLogin());
  };

  const isEmailValid = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.trim().length > 0;
  const isFormValid = isEmailValid && isPasswordValid && !loading;

  return (
    <form className="gym-auth-card" onSubmit={handleSubmit}>
      <h2 className="gym-auth-title">Welcome Back</h2>
      <p className="gym-auth-subtitle">Sign in to continue your workout journey.</p>

      <input
        className="gym-auth-input"
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />
      {!isEmailValid && form.email && <div className="gym-auth-error">Invalid email format</div>}
      {errors?.email && <div className="gym-auth-error">{errors.email}</div>}

      <input
        className="gym-auth-input"
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />
      {errors?.password && <div className="gym-auth-error">{errors.password}</div>}

      {errors?.global && <div className="gym-auth-error gym-auth-error--global">{errors.global}</div>}

      <button className="gym-auth-button" type="submit" disabled={!isFormValid}>
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
