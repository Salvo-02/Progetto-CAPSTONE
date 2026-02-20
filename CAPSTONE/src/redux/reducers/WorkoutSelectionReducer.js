// src/redux/reducer/WorkoutSelectionReducer.js

import {
  RESET_WORKOUT_SELECTION,
  RESET_PICKER,
  SET_CURRENT_WORKOUT,
  SET_WORKOUT_STATUS,
  SET_WORKOUT_NOTES,
  SELECT_MUSCLE_GROUP,
  ADD_EXERCISE_BLOCK,
  SET_EXERCISE_BLOCKS,
  ADD_SET_TO_EXERCISE,
  REMOVE_SET_FROM_EXERCISE,
  UPDATE_EXERCISE_SET,
} from "../action/WorkoutSelectionActions";

const initialState = {
  currentWorkoutId: null,
  workoutStatus: null,
  notes: "",
  selectedMuscleGroup: null,

  exerciseBlocks: [],
};

export default function WorkoutSelectionReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_WORKOUT_SELECTION:
      return {
        ...initialState,
      };

    case RESET_PICKER:
      return {
        ...state,
        selectedMuscleGroup: null,
      };

    case SET_CURRENT_WORKOUT:
      return {
        ...state,
        currentWorkoutId: action.payload,
      };

    case SET_WORKOUT_STATUS:
      return {
        ...state,
        workoutStatus: action.payload,
      };

    case SET_WORKOUT_NOTES:
      return {
        ...state,
        notes: action.payload,
      };

    case SELECT_MUSCLE_GROUP:
      return {
        ...state,
        selectedMuscleGroup: action.payload,
      };

    case SET_EXERCISE_BLOCKS:
      return {
        ...state,
        exerciseBlocks: action.payload || [],
      };

    case ADD_EXERCISE_BLOCK: {
      const { exerciseId } = action.payload;

      if (state.exerciseBlocks.some((b) => b.exerciseId === exerciseId)) {
        return state;
      }

      return {
        ...state,
        exerciseBlocks: [
          ...state.exerciseBlocks,
          {
            exerciseId,
            sets: [
              {
                reps: 1,
                weight: 0,
              },
            ],
          },
        ],
      };
    }

    case ADD_SET_TO_EXERCISE: {
      const { exerciseId } = action.payload;
      const blocks = [...state.exerciseBlocks];
      const idx = blocks.findIndex((b) => b.exerciseId === exerciseId);

      if (idx === -1) {
        blocks.push({
          exerciseId,
          sets: [
            {
              reps: 1,
              weight: 0,
            },
          ],
        });
      } else {
        blocks[idx] = {
          ...blocks[idx],
          sets: [
            ...blocks[idx].sets,
            {
              reps: 1,
              weight: 0,
            },
          ],
        };
      }

      return {
        ...state,
        exerciseBlocks: blocks,
      };
    }

    case REMOVE_SET_FROM_EXERCISE: {
      const { exerciseId, index } = action.payload;
      const blocks = [...state.exerciseBlocks];
      const idx = blocks.findIndex((b) => b.exerciseId === exerciseId);
      if (idx === -1) return state;

      const sets = [...blocks[idx].sets];
      if (index < 0 || index >= sets.length) return state;

      sets.splice(index, 1);

      blocks[idx] = {
        ...blocks[idx],
        sets,
      };

      return {
        ...state,
        exerciseBlocks: blocks,
      };
    }

    case UPDATE_EXERCISE_SET: {
      const { exerciseId, index, field, value } = action.payload;
      const blocks = [...state.exerciseBlocks];
      const idx = blocks.findIndex((b) => b.exerciseId === exerciseId);
      if (idx === -1) return state;

      const sets = [...blocks[idx].sets];
      if (index < 0 || index >= sets.length) return state;

      sets[index] = {
        ...sets[index],
        [field]: value,
      };

      blocks[idx] = {
        ...blocks[idx],
        sets,
      };

      return {
        ...state,
        exerciseBlocks: blocks,
      };
    }

    default:
      return state;
  }
}
