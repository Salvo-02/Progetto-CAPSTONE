import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "../css/WorkoutCreatePage.css";

const mapStatus = (status) => {
  if (typeof status === "number") {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Completed";
      case 2:
        return "Archived";
      default:
        return String(status);
    }
  }
  return status || "-";
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const w = await apiFetch(`/api/Workout/${id}`);

        const s = await apiFetch(`/api/workouts/${id}/sets`);

        setWorkout(w);
        setSets(Array.isArray(s) ? s : []);
      } catch (e) {
        setErr(e.message || "Errore caricamento workout.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="cw">
        <div className="cw__bg" />
        <div className="cw__container">
          <div className="cw__card">
            <div className="cw__muted">Caricamento workout…</div>
          </div>
        </div>
      </div>
    );
  }

  if (err || !workout) {
    return (
      <div className="cw">
        <div className="cw__bg" />
        <div className="cw__container">
          <div className="cw__card">
            <div className="cw__err cw__err--global">{err || "Workout non trovato."}</div>
            <button className="cw__btn cw__btn--ghost" type="button" onClick={() => navigate(-1)}>
              ← Torna indietro
            </button>
          </div>
        </div>
      </div>
    );
  }

  const date = workout.date ?? workout.Date;
  const notes = workout.notes ?? workout.Notes;
  const status = workout.status ?? workout.Status;

  return (
    <div className="cw">
      <div className="cw__bg" />
      <div className="cw__container">
        <div className="cw__head">
          <h1 className="cw__title">Dettaglio workout</h1>
          <p className="cw__subtitle">
            Data: <b>{formatDate(date)}</b> • Stato: <b>{mapStatus(status)}</b>
          </p>
        </div>

        <div className="cw__card">
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <button className="cw__btn cw__btn--ghost" type="button" onClick={() => navigate("/library")}>
              ← Torna alla libreria
            </button>
            <button className="cw__btn cw__btn--ghost" type="button" onClick={() => navigate("/")}>
              Home
            </button>
          </div>

          <div className="cw__field" style={{ marginBottom: 18 }}>
            <label className="cw__label">Info allenamento</label>
            <div className="cw__miniList">{notes ? <div className="cw__muted">{notes}</div> : <div className="cw__muted">Nessuna nota.</div>}</div>
          </div>

          <div className="cw__field">
            <label className="cw__label">Esercizi e set</label>

            {sets.length === 0 ? (
              <div className="cw__muted" style={{ marginTop: 8 }}>
                Nessun set salvato per questo workout.
              </div>
            ) : (
              <div className="cw__miniList">
                {sets.map((s, idx) => (
                  <div key={s.id || idx} className="cw__miniRow">
                    <div>
                      <div className="cw__miniTitle">{s.exerciseName}</div>
                      <div className="cw__hint">Set #{s.setNumber}</div>
                    </div>
                    <div>
                      <div className="cw__muted">
                        <b>{s.reps}</b> reps
                      </div>
                      <div className="cw__hint">{s.weight} kg</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
