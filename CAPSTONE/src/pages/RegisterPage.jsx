import RegisterForm from "../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <div className="gym-register-page">
      <div className="gym-bg-gradient" />
      <div className="gym-bg-shape gym-bg-shape--one" />
      <div className="gym-bg-shape gym-bg-shape--two" />

      <div className="gym-register-container">
        <div className="gym-register-left">
          <h1 className="gym-register-title">
            Build Your <span>Strongest</span> Version
          </h1>

          <p className="gym-register-subtitle">Join the elite training platform. Track workouts, monitor progress, and unlock your full potential.</p>

          <div className="gym-register-badges">
            <div className="gym-badge">✔ Personalized Training</div>
            <div className="gym-badge">✔ Progress Tracking</div>
            <div className="gym-badge">✔ Premium Experience</div>
          </div>
        </div>

        <div className="gym-register-card">
          <RegisterForm />
          <div className="gym-switch-auth">
            <p>Already registered?</p>
            <button className="gym-switch-button" onClick={() => navigate("/login")}>
              Login instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
