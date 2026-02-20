import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../redux/action/AuthActions";
import "../css/Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const user = auth?.user || null;
  const isAuthenticated = !!auth?.token;
  const isAdmin = user?.role === "Admin";

  const handleLogoClick = () => {
    navigate("/");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDdOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const linkBaseClass = "gx-link";

  return (
    <header className="gx-nav">
      <div className="gx-nav__inner">
        <button className="gx-nav__brand" type="button" onClick={handleLogoClick}>
          <div className="gx-nav__brandMark" />
          <img></img>
          <div className="gx-nav__brandText">GymX</div>
        </button>

        <button className="gx-nav__burger" type="button" onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>

        <div className={`gx-nav__links ${menuOpen ? "is-open" : ""}`}>
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? `${linkBaseClass} active` : linkBaseClass)} onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>

              <NavLink to="/register" className={({ isActive }) => (isActive ? `${linkBaseClass} active` : linkBaseClass)} onClick={() => setMenuOpen(false)}>
                Register
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <>
              <NavLink to="/" end className={({ isActive }) => (isActive ? `${linkBaseClass} active` : linkBaseClass)} onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>

              <NavLink
                to="/workouts/new"
                className={({ isActive }) => (isActive ? `${linkBaseClass} active` : linkBaseClass)}
                onClick={() => setMenuOpen(false)}
              >
                Nuovo workout
              </NavLink>

              <NavLink to="/library" className={({ isActive }) => (isActive ? `${linkBaseClass} active` : linkBaseClass)} onClick={() => setMenuOpen(false)}>
                I miei workout
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => (isActive ? `${linkBaseClass} active` : linkBaseClass)}
                  onClick={() => setMenuOpen(false)}
                >
                  Utenti
                </NavLink>
              )}

              {user && (
                <div className="gx-dd">
                  <button type="button" className="gx-btn gx-btn--ghost" onClick={() => setDdOpen((v) => !v)}>
                    {user.fullName || user.FullName || user.userName || user.UserName || "Account"}
                  </button>

                  {ddOpen && (
                    <div className="gx-dd__panel">
                      <button
                        type="button"
                        className="gx-dd__item"
                        onClick={() => {
                          setDdOpen(false);
                          setMenuOpen(false);
                          navigate("/profile");
                        }}
                      >
                        Profilo
                      </button>

                      <div className="gx-dd__sep" />

                      <button type="button" className="gx-dd__item gx-dd__item--danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
