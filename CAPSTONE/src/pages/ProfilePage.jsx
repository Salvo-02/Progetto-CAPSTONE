import { useEffect, useState, useMemo } from "react";

import "../css/ProfilePage.css";
import { apiFetch } from "../utils/api";

export default function ProfilePage() {
  const [me, setMe] = useState(null);

  const [err, setErr] = useState("");

  // fallback locale se /users/me non c'è ancora
  const localUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [userRes, archivedRes] = await Promise.all([
          apiFetch("/api/users/me").catch(() => null), // se non c'è, uso local
          apiFetch("/api/Workout/archived"),
        ]);

        setMe(userRes ?? localUser);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = me ?? localUser;
  const initials = (user?.fullName || user?.email || "U").trim().slice(0, 1).toUpperCase();

  return (
    <div className="pp">
      <div className="pp__bg" />
      <div className="pp__container">
        {/* HEADER */}
        <div className="pp__header">
          <h1 className="pp__title">Profilo</h1>
          <p className="pp__subtitle">Ciao User</p>
        </div>

        {/* CARD UTENTE */}
        <div className="pp__card">
          <div className="pp__userRow">
            <div className="pp__avatar">{initials}</div>

            <div className="pp__userInfo">
              <div className="pp__name">{user?.fullName || "—"}</div>
              <div className="pp__email">{user?.email || "—"}</div>
            </div>
          </div>
        </div>

        {/* ERROR / LOADING */}
        {err && (
          <div className="pp__card">
            <div className="pp__error">{err}</div>
          </div>
        )}
      </div>
    </div>
  );
}
