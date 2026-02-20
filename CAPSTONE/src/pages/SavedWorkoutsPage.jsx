import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../css/savedWorkouts.css";

export default function SavedWorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await apiFetch("/api/workout/saved");
      setWorkouts(data || []);
    } catch (e) {
      setErr(e.message || "Errore caricamento workout.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onContinue = (id) => {
    navigate(`/workout/${id}`);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Eliminare definitivamente questo workout?")) return;

    try {
      await apiFetch(`/api/workout/${id}`, { method: "DELETE" });
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      alert(e.message || "Errore eliminazione workout.");
    }
  };

  return (
    <div className="lib-container">
      <h1 className="lib-title">Workout Salvati</h1>

      {err && <div className="lib-error">{err}</div>}
      {loading && <div className="lib-loading">Caricamento...</div>}

      {!loading && workouts.length === 0 && <div className="lib-empty">Nessun workout salvato.</div>}

      {!loading && workouts.length > 0 && (
        <table className="lib-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Note</th>
              <th>Stato</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id}>
                <td>{new Date(w.date).toLocaleDateString()}</td>
                <td>{w.notes || "—"}</td>
                <td>{w.status}</td>
                <td>
                  {w.status === "Draft" && (
                    <button className="lib-btn lib-btn--primary" onClick={() => onContinue(w.id)}>
                      Continua
                    </button>
                  )}

                  {(w.status === "Completed" || w.status === "Archived") && (
                    <button className="lib-btn lib-btn--danger" onClick={() => onDelete(w.id)}>
                      Elimina
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
