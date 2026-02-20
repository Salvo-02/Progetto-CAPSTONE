import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "../css/LibraryPage.css";

export default function LibraryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await apiFetch("/api/Workout/saved");
      setItems(data || []);
    } catch (e) {
      setErr(e.message || "Errore caricamento workout.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onContinueDraft = (workout, e) => {
    e.stopPropagation();
    navigate("/workouts/new", {
      state: { workoutId: workout.id },
    });
  };

  const handleEdit = (workout, e) => {
    e.stopPropagation();
    navigate("/workouts/new", {
      state: { workoutId: workout.id },
    });
  };

  const handleRowClick = (id) => {
    navigate(`/workouts/${id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm("Eliminare definitivamente questo workout?")) return;

    try {
      await apiFetch(`/api/Workout/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert(err.message || "Errore durante l'eliminazione.");
    }
  };

  const prettyStatus = (s) => s || "-";

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString();
  };

  return (
    <div className="lib">
      <div className="lib__container">
        <div className="lib__header">
          <h1 className="lib__title">I miei workout</h1>
          <p className="lib__subtitle">Draft, Completed e Archived salvati per il tuo account.</p>
        </div>

        {err && <div className="lib__msg lib__msg--error">{err}</div>}
        {loading && !err && <div className="lib__msg">Caricamento…</div>}

        {!loading && !err && items.length === 0 && <div className="lib__msg lib__msg--empty">Non hai ancora nessun workout salvato.</div>}

        {!loading && !err && items.length > 0 && (
          <div className="lib__tableWrapper">
            <table className="lib__table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Info allenamento</th>
                  <th>Stato</th>
                  <th style={{ textAlign: "right" }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {items.map((w) => {
                  const status = prettyStatus(w.status);
                  const statusKey = String(status).toLowerCase();

                  return (
                    <tr key={w.id} className="lib__row" onClick={() => handleRowClick(w.id)}>
                      <td>{formatDate(w.date)}</td>
                      <td title={w.notes || ""}>{w.notes || "—"}</td>
                      <td>
                        <span className={`lib__badge lib__badge--${statusKey}`}>{status}</span>
                      </td>
                      <td className="lib__actionsCell">
                        {/* DRAFT → Continua + Cestino */}
                        {status === "Draft" && (
                          <>
                            <button type="button" className="lib__btn lib__btn--primary" onClick={(e) => onContinueDraft(w, e)}>
                              Continua
                            </button>
                            <button type="button" className="lib__iconBtn lib__iconBtn--danger" onClick={(e) => handleDelete(w.id, e)} title="Elimina workout">
                              🗑
                            </button>
                          </>
                        )}

                        {status === "Completed" && (
                          <>
                            <button type="button" className="lib__iconBtn lib__iconBtn--edit" onClick={(e) => handleEdit(w, e)} title="Modifica workout">
                              ✎
                            </button>
                            <button type="button" className="lib__iconBtn lib__iconBtn--danger" onClick={(e) => handleDelete(w.id, e)} title="Elimina workout">
                              🗑
                            </button>
                          </>
                        )}

                        {status === "Archived" && (
                          <button type="button" className="lib__iconBtn lib__iconBtn--danger" onClick={(e) => handleDelete(w.id, e)} title="Elimina workout">
                            🗑
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
