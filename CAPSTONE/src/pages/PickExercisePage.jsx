import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercises } from "../redux/action/ExerciseAction";
import { addExerciseBlock } from "../redux/action/WorkoutSelectionActions";
import { useNavigate } from "react-router-dom";

import "../css/PickExercisePage.css";

const PickExercisePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useSelector((state) => state.exercises);
  const { selectedMuscleGroup } = useSelector((state) => state.workoutSelection);

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!items || items.length === 0) dispatch(fetchExercises());
  }, [dispatch, items]);

  useEffect(() => {
    if (!selectedMuscleGroup) navigate("/muscle-groups");
  }, [selectedMuscleGroup, navigate]);

  const filtered = useMemo(() => {
    if (!items || !selectedMuscleGroup) return [];
    return items
      .filter((e) => e.muscleGroup === selectedMuscleGroup)
      .filter((e) => e.name.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, selectedMuscleGroup, query]);

  const onPick = (exercise) => {
    dispatch(addExerciseBlock(exercise.id));
    navigate("/workouts/new");
  };

  return (
    <div className="cw">
      <div className="cw__bg" />
      <div className="cw__container">
        <div className="cw__head">
          <h1 className="cw__title">Scegli esercizio</h1>
          <p className="cw__subtitle">
            Gruppo selezionato: <b>{selectedMuscleGroup}</b>
          </p>
        </div>

        <div className="cw__card">
          <div className="cw__field">
            <label className="cw__label">Cerca</label>
            <input className="cw__input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Es: Bench, Row, Squat..." />
            <div className="cw__hint">Filtra gli esercizi del gruppo scelto.</div>
          </div>

          {loading && (
            <div className="cw__muted" style={{ marginTop: 12 }}>
              Caricamento…
            </div>
          )}
          {error && (
            <div className="cw__err" style={{ marginTop: 12 }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="pe__list">
              {filtered.map((e) => (
                <button key={e.id} className="pe__item" onClick={() => onPick(e)}>
                  <div className="pe__name">{e.name}</div>
                  <div className="cw__hint">{e.notes ?? "—"}</div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="cw__muted" style={{ marginTop: 12 }}>
                  Nessun esercizio trovato.
                </div>
              )}
            </div>
          )}
        </div>

        <button className="cw__btn cw__btn--ghost pe__back" onClick={() => navigate(-1)}>
          ← Indietro
        </button>
      </div>
    </div>
  );
};

export default PickExercisePage;
