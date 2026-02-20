import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  resetWorkoutSelection,
  resetPicker,
  setCurrentWorkout,
  setWorkoutStatus,
  setWorkoutNotes,
  setExerciseBlocks,
  addSetToExercise,
  removeSetFromExercise,
  updateExerciseSet,
} from "../redux/action/WorkoutSelectionActions";
import { apiFetch } from "../utils/api";

import "../css/WorkoutCreatePage.css";

// ENDPOINTS
const WORKOUT_CREATE = "/api/Workout"; // POST
const WORKOUT_UPDATE = (id) => `/api/Workout/${id}`; // PUT
const WORKOUT_STATUS = (id) => `/api/Workout/${id}/status`; // PATCH
const WORKOUT_SETS_LIST = (workoutId) => `/api/workouts/${workoutId}/sets`; // GET
const WORKOUT_SETS = (workoutId) => `/api/workouts/${workoutId}/sets`; // POST
const WORKOUT_SET_BY_ID = (workoutId, setId) => `/api/workouts/${workoutId}/sets/${setId}`; // DELETE

function buildBlocksFromSets(sets) {
  const byExercise = new Map();

  for (const raw of sets || []) {
    const exerciseId = raw.exerciseId ?? raw.ExerciseId;
    if (!exerciseId) continue;

    const setNumber = raw.setNumber ?? raw.SetNumber ?? 0;
    const reps = raw.reps ?? raw.Reps ?? 0;
    const weight = raw.weight ?? raw.Weight ?? 0;

    if (!byExercise.has(exerciseId)) {
      byExercise.set(exerciseId, []);
    }

    byExercise.get(exerciseId).push({ setNumber, reps, weight });
  }

  const blocks = [];
  for (const [exerciseId, arr] of byExercise.entries()) {
    arr.sort((a, b) => a.setNumber - b.setNumber);
    blocks.push({
      exerciseId,
      sets: arr.map((s) => ({
        reps: s.reps,
        weight: s.weight,
      })),
    });
  }

  return blocks;
}

export default function WorkoutCreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentWorkoutId, workoutStatus, exerciseBlocks, notes } = useSelector((s) => s.workoutSelection);
  const { items: exercises } = useSelector((s) => s.exercises);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [showComplete, setShowComplete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const canEdit = workoutStatus !== "Archived";
  const exName = (id) => exercises?.find((e) => e.id === id)?.name ?? id;

  useEffect(() => {
    const fromStateId = location.state && location.state.workoutId;
    if (!fromStateId) return;

    if (currentWorkoutId === fromStateId && exerciseBlocks.length > 0) {
      return;
    }

    let cancelled = false;

    const loadExistingWorkout = async () => {
      setBusy(true);
      setErr("");

      try {
        const w = await apiFetch(`/api/Workout/${fromStateId}`, {
          method: "GET",
        });

        const status = w.status ?? w.Status ?? "Draft";
        const notesSrv = w.notes ?? w.Notes ?? "";
        const dateSrv = w.date ?? w.Date;

        dispatch(setCurrentWorkout(fromStateId));
        dispatch(setWorkoutStatus(status));
        dispatch(setWorkoutNotes(notesSrv));

        if (dateSrv) {
          const d = new Date(dateSrv);
          if (!Number.isNaN(d.getTime())) {
            setDate(d.toISOString().slice(0, 10));
          }
        }

        const sets = await apiFetch(WORKOUT_SETS_LIST(fromStateId), {
          method: "GET",
        });

        if (!cancelled && Array.isArray(sets)) {
          const blocks = buildBlocksFromSets(sets);
          dispatch(setExerciseBlocks(blocks));
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e?.message || "Errore caricamento workout.");
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    };

    loadExistingWorkout();

    return () => {
      cancelled = true;
    };
  }, [location.state, currentWorkoutId, exerciseBlocks.length, dispatch]);

  useEffect(() => {
    if (!workoutStatus && exerciseBlocks.length > 0) {
      dispatch(setWorkoutStatus("Draft"));
    }
  }, [workoutStatus, exerciseBlocks.length, dispatch]);

  const saveWorkoutAndExit = async (forcedStatus) => {
    if (exerciseBlocks.length === 0) {
      setErr("Aggiungi almeno un esercizio prima di salvare.");
      return;
    }

    for (const block of exerciseBlocks) {
      for (const s of block.sets) {
        const repsNum = Number(s.reps);
        if (!Number.isFinite(repsNum) || repsNum <= 0) {
          setErr("Per salvare il workout inserisci un numero di reps (> 0) per tutti i set.");
          return;
        }
      }
    }

    setErr("");
    setBusy(true);

    try {
      const finalStatus = forcedStatus ?? workoutStatus ?? "Draft";

      let workoutId = currentWorkoutId || null;
      const isNewWorkout = !currentWorkoutId;

      const isoDate = new Date(date).toISOString();
      const notesPayload = notes?.trim() ? notes.trim() : null;

      if (!workoutId) {
        const created = await apiFetch(WORKOUT_CREATE, {
          method: "POST",
          body: JSON.stringify({
            date: isoDate,
            notes: notesPayload,
          }),
        });

        workoutId = created?.id ?? created?.Id;
        if (!workoutId) throw new Error("Impossibile creare il workout.");
      } else {
        await apiFetch(WORKOUT_UPDATE(workoutId), {
          method: "PUT",
          body: JSON.stringify({
            date: isoDate,
            notes: notesPayload,
          }),
        });
      }

      if (!isNewWorkout) {
        const existingSets = await apiFetch(WORKOUT_SETS_LIST(workoutId), {
          method: "GET",
        });

        if (Array.isArray(existingSets)) {
          for (const s of existingSets) {
            const sid = s.id ?? s.Id;
            if (!sid) continue;
            await apiFetch(WORKOUT_SET_BY_ID(workoutId, sid), {
              method: "DELETE",
            });
          }
        }
      }

      for (const block of exerciseBlocks) {
        for (let i = 0; i < block.sets.length; i++) {
          const s = block.sets[i];
          await apiFetch(WORKOUT_SETS(workoutId), {
            method: "POST",
            body: JSON.stringify({
              exerciseId: block.exerciseId,
              setNumber: i + 1,
              reps: Number(s.reps) || 0,
              weight: Number(s.weight) || 0,
            }),
          });
        }
      }

      if (finalStatus !== "Draft") {
        await apiFetch(WORKOUT_STATUS(workoutId), {
          method: "PATCH",
          body: JSON.stringify({ newStatus: finalStatus }),
        });
      }
      dispatch(setWorkoutStatus(finalStatus));

      dispatch(resetWorkoutSelection());
      setDate(new Date().toISOString().slice(0, 10));
      dispatch(setWorkoutNotes(""));

      navigate("/library");
    } catch (e) {
      setErr(e?.message || "Errore salvataggio workout.");
    } finally {
      setBusy(false);
    }
  };

  const onStartWorkout = () => {
    if (!workoutStatus) {
      dispatch(setWorkoutStatus("Draft"));
    }
  };

  const onAddExercise = () => {
    if (!canEdit) return;
    setErr("");
    dispatch(resetPicker());
    navigate("/muscle-groups");
  };

  const onAddSet = (exerciseId) => {
    if (!canEdit) return;
    setErr("");
    dispatch(addSetToExercise(exerciseId));
  };

  const onDeleteSet = (exerciseId, idx) => {
    if (!canEdit) return;
    setErr("");
    dispatch(removeSetFromExercise(exerciseId, idx));
  };

  const onConfirmComplete = () => {
    setShowComplete(false);
    dispatch(setWorkoutStatus("Completed"));
  };

  const onConfirmArchive = async () => {
    setShowArchive(false);
    await saveWorkoutAndExit("Archived");
  };

  const summary = useMemo(
    () => ({
      ex: exerciseBlocks.length,
      sets: exerciseBlocks.reduce((a, b) => a + b.sets.length, 0),
    }),
    [exerciseBlocks],
  );

  const hasActiveWorkout = !!currentWorkoutId || exerciseBlocks.length > 0 || !!workoutStatus;

  return (
    <div className="cw">
      <div className="cw__bg" />
      <div className="cw__container">
        <div className="cw__head">
          <h1 className="cw__title">Workout</h1>
          <p className="cw__subtitle">
            Stato: <b>{workoutStatus || "Draft"}</b> • Esercizi: <b>{summary.ex}</b> • Set: <b>{summary.sets}</b>
          </p>
        </div>

        <div className="cw__card" style={{ marginBottom: 14 }}>
          <div className="cw__topGrid">
            <div className="cw__field">
              <label className="cw__label">Data</label>
              <input className="cw__input" type="date" value={date} disabled={!canEdit} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="cw__field">
              <label className="cw__label">Note</label>
              <textarea className="cw__textarea" value={notes} disabled={!canEdit} onChange={(e) => dispatch(setWorkoutNotes(e.target.value))} />
            </div>
          </div>

          {!hasActiveWorkout ? (
            <button className="cw__btn cw__btn--primary" disabled={busy} onClick={onStartWorkout}>
              Inizia workout
            </button>
          ) : (
            <div className="cw__ok">Workout in corso ✅</div>
          )}

          {err && <div className="cw__err cw__err--global">{err}</div>}
        </div>

        {hasActiveWorkout && (
          <div className="cw__card">
            <div className="cw__setsHead">
              <h2 className="cw__h2">Esercizi</h2>
              {canEdit && (
                <button className="cw__btn cw__btn--ghost" disabled={busy} onClick={onAddExercise}>
                  + Aggiungi esercizio
                </button>
              )}
            </div>

            {exerciseBlocks.length === 0 ? (
              <div className="cw__muted" style={{ marginTop: 12 }}>
                Nessun esercizio. Clicca “+ Aggiungi esercizio”.
              </div>
            ) : (
              exerciseBlocks.map((block) => (
                <div className="cw__miniList" key={block.exerciseId} style={{ marginTop: 12 }}>
                  <div className="cw__miniTitle">{exName(block.exerciseId)}</div>

                  <div className="cw__setsHead" style={{ marginTop: 10 }}>
                    <div className="cw__muted" />
                    {canEdit && (
                      <button className="cw__btn cw__btn--ghost" disabled={busy} onClick={() => onAddSet(block.exerciseId)} type="button">
                        + Aggiungi set
                      </button>
                    )}
                  </div>

                  <div className="cw__setsFlex">
                    {block.sets.map((s, idx) => (
                      <div className="cw__setCard" key={idx}>
                        <div className="cw__setHeader">
                          <div className="cw__setNumber">Set #{idx + 1}</div>

                          <div className="cw__iconBtns">
                            {canEdit && block.sets.length > 1 && (
                              <button
                                className="cw__iconBtn cw__iconBtn--danger"
                                disabled={busy}
                                type="button"
                                title="Elimina"
                                onClick={() => onDeleteSet(block.exerciseId, idx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="cw__miniField">
                          <label className="cw__label">Reps</label>
                          <input
                            className="cw__miniInput"
                            type="number"
                            min={1}
                            value={s.reps}
                            disabled={!canEdit}
                            onChange={(e) => dispatch(updateExerciseSet(block.exerciseId, idx, "reps", e.target.value))}
                          />
                        </div>

                        <div className="cw__miniField">
                          <label className="cw__label">Peso</label>
                          <input
                            className="cw__miniInput"
                            type="number"
                            min={0}
                            max={1000}
                            step="0.5"
                            value={s.weight}
                            disabled={!canEdit}
                            onChange={(e) => dispatch(updateExerciseSet(block.exerciseId, idx, "weight", e.target.value))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* BOTTONI FINALI */}
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {workoutStatus !== "Archived" && (
                <button className="cw__btn cw__btn--primary" disabled={busy || summary.sets === 0} type="button" onClick={() => saveWorkoutAndExit()}>
                  {busy ? "Salvataggio..." : "Salva e torna alla libreria"}
                </button>
              )}

              {canEdit && workoutStatus === "Draft" && (
                <button className="cw__btn cw__btn--ghost" disabled={busy || summary.sets === 0} type="button" onClick={() => setShowComplete(true)}>
                  Imposta come completato
                </button>
              )}

              {canEdit && workoutStatus === "Completed" && (
                <button className="cw__btn cw__btn--danger" disabled={busy || summary.sets === 0} type="button" onClick={() => setShowArchive(true)}>
                  Archivia workout
                </button>
              )}
            </div>
          </div>
        )}

        {showComplete && (
          <div className="cw__modalOverlay" role="dialog" aria-modal="true">
            <div className="cw__modal">
              <h3 className="cw__modalTitle">Impostare come completato?</h3>
              <p className="cw__muted">
                Lo stato passerà a <b>Completed</b>. I dati verranno salvati nel DB quando clicchi “Salva e torna alla libreria”.
              </p>
              <div className="cw__modalRow">
                <button className="cw__btn cw__btn--ghost" onClick={() => setShowComplete(false)} disabled={busy}>
                  Annulla
                </button>
                <button className="cw__btn cw__btn--primary" onClick={onConfirmComplete} disabled={busy}>
                  Sì, imposta Completed
                </button>
              </div>
            </div>
          </div>
        )}

        {showArchive && (
          <div className="cw__modalOverlay" role="dialog" aria-modal="true">
            <div className="cw__modal">
              <h3 className="cw__modalTitle">Archiviare il workout?</h3>
              <p className="cw__muted">
                Lo stato passerà a <b>Archived</b> e verrai riportato alla libreria.
              </p>
              <div className="cw__modalRow">
                <button className="cw__btn cw__btn--ghost" onClick={() => setShowArchive(false)} disabled={busy}>
                  Annulla
                </button>
                <button className="cw__btn cw__btn--danger" onClick={onConfirmArchive} disabled={busy}>
                  Sì, archivia e chiudi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
