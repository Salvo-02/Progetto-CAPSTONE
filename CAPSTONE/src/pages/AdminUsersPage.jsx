import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import "../css/AdminUsersPage.css";

export default function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await apiFetch("/api/Admin/users");
      setItems(data || []);
    } catch (e) {
      setErr(e.message || "Errore caricamento utenti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin">
      <div className="admin__container">
        <h1 className="admin__title">Lista utenti</h1>

        {err && <div className="admin__msg admin__msg--error">{err}</div>}
        {loading && !err && <div className="admin__msg">Caricamento…</div>}

        {!loading && !err && items.length === 0 && <div className="admin__msg admin__msg--empty">Nessun utente.</div>}

        {!loading && !err && items.length > 0 && (
          <div className="admin__tableWrapper">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Full Name</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="admin__row">
                    <td>{u.fullName || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
