import { useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <div className="gym-login-page">
      <div className="gym-bg-gradient" />
      <div className="gym-bg-shape gym-bg-shape--one" />
      <div className="gym-bg-shape gym-bg-shape--two" />

      <div className="gym-login-container">
        <div className="gym-login-left">
          <h1 className="gym-login-title">
            Log Back <span>In</span>
          </h1>
          <p className="gym-login-subtitle">Access your dashboard, track your workouts and stay on top of your fitness goals.</p>
        </div>

        <div className="gym-login-right">
          <LoginForm />
          <div className="gym-switch-auth">
            <p>Don't have an account?</p>
            <button className="gym-switch-button" onClick={() => navigate("/register")}>
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
