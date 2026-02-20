import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercises } from "../redux/action/ExerciseAction";
import { selectMuscleGroup, resetPicker } from "../redux/action/WorkoutSelectionActions";
import { useNavigate } from "react-router-dom";
import "../css/MuscleGroupPage.css";

const MuscleGroupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useSelector((state) => state.exercises);

  useEffect(() => {
    dispatch(resetPicker());
    if (!items || items.length === 0) dispatch(fetchExercises());
  }, [dispatch]);

  const muscleGroups = useMemo(() => {
    if (!items) return [];
    return [...new Set(items.map((e) => e.muscleGroup))].sort();
  }, [items]);

  const handleSelectGroup = (group) => {
    dispatch(selectMuscleGroup(group));
    navigate("/pick-exercise");
  };

  return (
    <div className="cw">
      <div className="cw__bg" />
      <div className="cw__container">
        <div className="cw__head">
          <h1 className="cw__title">Scegli il gruppo muscolare</h1>
        </div>

        <div className="cw__card">
          {loading && <div className="cw__muted">Caricamento…</div>}
          {error && <div className="cw__err">{error}</div>}

          {!loading && !error && (
            <div className="mg__grid">
              {muscleGroups.map((g) => (
                <button key={g} className="mg__groupCard" onClick={() => handleSelectGroup(g)}>
                  <div className="mg__groupTitle">{g}</div>
                  <div className="cw__hint">Clicca per vedere gli esercizi</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuscleGroupPage;
