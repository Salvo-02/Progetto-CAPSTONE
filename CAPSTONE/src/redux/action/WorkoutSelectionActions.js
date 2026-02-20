// src/redux/action/WorkoutSelectionActions.js

// TIPI AZIONI
export const RESET_WORKOUT_SELECTION = "RESET_WORKOUT_SELECTION";
export const RESET_PICKER = "RESET_PICKER";

export const SET_CURRENT_WORKOUT = "SET_CURRENT_WORKOUT";
export const SET_WORKOUT_STATUS = "SET_WORKOUT_STATUS";
export const SET_WORKOUT_NOTES = "SET_WORKOUT_NOTES";

// MUSCLE GROUP (usato da MuscleGroupPage)
export const SELECT_MUSCLE_GROUP = "SELECT_MUSCLE_GROUP";

// BLOCCO ESERCIZIO (usato da PickExercisePage)
export const ADD_EXERCISE_BLOCK = "ADD_EXERCISE_BLOCK";
export const SET_EXERCISE_BLOCKS = "SET_EXERCISE_BLOCKS"; // 🔹 nuovo

export const ADD_SET_TO_EXERCISE = "ADD_SET_TO_EXERCISE";
export const REMOVE_SET_FROM_EXERCISE = "REMOVE_SET_FROM_EXERCISE";
export const UPDATE_EXERCISE_SET = "UPDATE_EXERCISE_SET";

// ACTION CREATORS

export const resetWorkoutSelection = () => ({
  type: RESET_WORKOUT_SELECTION,
});

export const resetPicker = () => ({
  type: RESET_PICKER,
});

// id del workout salvato nel DB (quando esiste)
export const setCurrentWorkout = (workoutId) => ({
  type: SET_CURRENT_WORKOUT,
  payload: workoutId,
});

export const setWorkoutStatus = (status) => ({
  type: SET_WORKOUT_STATUS,
  payload: status,
});

// nota del workout in Redux
export const setWorkoutNotes = (notes) => ({
  type: SET_WORKOUT_NOTES,
  payload: notes,
});

// selezione gruppo muscolare (MuscleGroupPage)
export const selectMuscleGroup = (muscleGroupId) => ({
  type: SELECT_MUSCLE_GROUP,
  payload: muscleGroupId,
});

// blocco esercizio (PickExercisePage -> quando scegli un esercizio)
export const addExerciseBlock = (exerciseId) => ({
  type: ADD_EXERCISE_BLOCK,
  payload: { exerciseId },
});

// 🔹 imposta TUTTI i blocchi esercizi (quando carichi un workout esistente dal DB)
export const setExerciseBlocks = (blocks) => ({
  type: SET_EXERCISE_BLOCKS,
  payload: blocks,
});

// aggiunge un set ad un esercizio esistente
export const addSetToExercise = (exerciseId) => ({
  type: ADD_SET_TO_EXERCISE,
  payload: { exerciseId },
});

export const removeSetFromExercise = (exerciseId, index) => ({
  type: REMOVE_SET_FROM_EXERCISE,
  payload: { exerciseId, index },
});

export const updateExerciseSet = (exerciseId, index, field, value) => ({
  type: UPDATE_EXERCISE_SET,
  payload: { exerciseId, index, field, value },
});
