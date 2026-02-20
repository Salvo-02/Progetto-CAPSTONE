export const RESET_WORKOUT_SELECTION = "RESET_WORKOUT_SELECTION";
export const RESET_PICKER = "RESET_PICKER";

export const SET_CURRENT_WORKOUT = "SET_CURRENT_WORKOUT";
export const SET_WORKOUT_STATUS = "SET_WORKOUT_STATUS";
export const SET_WORKOUT_NOTES = "SET_WORKOUT_NOTES";

export const SELECT_MUSCLE_GROUP = "SELECT_MUSCLE_GROUP";

export const ADD_EXERCISE_BLOCK = "ADD_EXERCISE_BLOCK";
export const SET_EXERCISE_BLOCKS = "SET_EXERCISE_BLOCKS";

export const ADD_SET_TO_EXERCISE = "ADD_SET_TO_EXERCISE";
export const REMOVE_SET_FROM_EXERCISE = "REMOVE_SET_FROM_EXERCISE";
export const UPDATE_EXERCISE_SET = "UPDATE_EXERCISE_SET";

export const resetWorkoutSelection = () => ({
  type: RESET_WORKOUT_SELECTION,
});

export const resetPicker = () => ({
  type: RESET_PICKER,
});

export const setCurrentWorkout = (workoutId) => ({
  type: SET_CURRENT_WORKOUT,
  payload: workoutId,
});

export const setWorkoutStatus = (status) => ({
  type: SET_WORKOUT_STATUS,
  payload: status,
});

export const setWorkoutNotes = (notes) => ({
  type: SET_WORKOUT_NOTES,
  payload: notes,
});

export const selectMuscleGroup = (muscleGroupId) => ({
  type: SELECT_MUSCLE_GROUP,
  payload: muscleGroupId,
});

export const addExerciseBlock = (exerciseId) => ({
  type: ADD_EXERCISE_BLOCK,
  payload: { exerciseId },
});

export const setExerciseBlocks = (blocks) => ({
  type: SET_EXERCISE_BLOCKS,
  payload: blocks,
});

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
