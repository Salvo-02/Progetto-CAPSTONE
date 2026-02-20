// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, user } = auth;

  const isAdmin = user?.role === "Admin";

  let welcomeText = "";
  if (isAuthenticated && user) {
    if (isAdmin) {
      welcomeText = "Benvenuto Admin";
    } else if (user.fullName) {
      welcomeText = `Benvenuto User ${user.fullName}`;
    } else {
      welcomeText = "Benvenuto User";
    }
  }
  const goProtected = (path) => {
    if (!isAuthenticated) {
      alert("Devi fare login per creare un workout.");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <div className="hp">
      <div className="hp__bgGradient" />
      <div className="hp__bgOrb hp__bgOrb--one" />
      <div className="hp__bgOrb hp__bgOrb--two" />

      <main className="hp__container">
        <section className="hp__hero">
          <div className="hp__heroLeft">
            <p className="hp__kicker"> Fantasy Gym • Premium </p>

            {welcomeText && <p className="hp__welcome">{welcomeText}</p>}

            <h1 className="hp__title">
              Forgi il tuo <span>fisico</span>. Domina i tuoi <span>workout</span>.
            </h1>

            <p className="hp__subtitle">Crea schede, traccia progressi, resta costante. Tutto in una web app moderna.</p>

            <div className="hp__ctaRow">
              {isAuthenticated ? (
                <>
                  <button className="hp__btn hp__btn--primary" onClick={() => navigate("/library")}>
                    I miei workout
                  </button>
                  <button className="hp__btn hp__btn--ghost" onClick={() => goProtected("/workouts/new")}>
                    + Nuovo workout
                  </button>
                </>
              ) : (
                <>
                  <button className="hp__btn hp__btn--primary" onClick={() => navigate("/login")}>
                    Login
                  </button>
                  <button className="hp__btn hp__btn--ghost" onClick={() => navigate("/register")}>
                    Register
                  </button>
                </>
              )}
            </div>

            <div className="hp__stats">
              <div className="hp__stat">
                <div className="hp__statNum"></div>
                <div className="hp__statText">
                  <b>Fast</b>
                </div>
              </div>
              <div className="hp__stat">
                <div className="hp__statNum"></div>
                <div className="hp__statText">
                  <b>Secure</b>
                </div>
              </div>
              <div className="hp__stat">
                <div className="hp__statNum"></div>
                <div className="hp__statText">
                  <b>Progress</b>
                </div>
              </div>
            </div>
          </div>

          <div className="hp__heroRight">
            <div className="hp__card">
              <div className="hp__cardTop">
                <div className="hp__pill"> Today</div>
                <div className="hp__pill hp__pill--alt">Bull Mode</div>
              </div>

              <div className="hp__cardTitle">Workout di esempio</div>
              <div className="hp__list">
                <div className="hp__row">
                  <span>Panca Piana</span>
                  <span className="hp__muted">4x8</span>
                </div>
                <div className="hp__row">
                  <span>Squat</span>
                  <span className="hp__muted">5x5</span>
                </div>
                <div className="hp__row">
                  <span>Curl Manubri</span>
                  <span className="hp__muted">4x12</span>
                </div>
              </div>

              <div className="hp__cardBottom">
                <button className="hp__miniBtn" onClick={() => (isAuthenticated ? goProtected("/workouts/new") : navigate("/login"))}>
                  {isAuthenticated ? "Crea ora" : "Accedi per creare"}
                </button>
                <div className="hp__progress">
                  <div className="hp__bar">
                    <span style={{ width: "68%" }} />
                  </div>
                  <span className="hp__muted">68%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hp__grid">
          <div className="hp__feature">
            <h3>Libreria workout</h3>
            <p>Crea, modifica e riutilizza le tue schede quando vuoi.</p>
          </div>
          <div className="hp__feature">
            <h3>Focus & costanza</h3>
          </div>
          <div className="hp__feature">
            <h3>Progressi</h3>
            <p>Storico e tracking per vedere se stai davvero migliorando.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
