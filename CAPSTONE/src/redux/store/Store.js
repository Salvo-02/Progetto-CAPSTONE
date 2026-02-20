// src/redux/store/Store.js
import { legacy_createStore as createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "../reducers/AuthReducers";
import ExercisesReducer from "../reducers/ExerciseReducer";
import WorkoutSelectionReducer from "../reducers/WorkoutSelectionReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  exercises: ExercisesReducer,
  workoutSelection: WorkoutSelectionReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
