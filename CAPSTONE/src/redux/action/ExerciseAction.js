import { FETCH_EXERCISES_REQUEST, FETCH_EXERCISES_SUCCESS, FETCH_EXERCISES_FAILURE } from "./ActionTypes";

import { apiFetch } from "../../utils/api";

export const fetchExercises = () => async (dispatch) => {
  dispatch({ type: FETCH_EXERCISES_REQUEST });

  try {
    const data = await apiFetch("/api/exercises", { method: "GET" });

    dispatch({
      type: FETCH_EXERCISES_SUCCESS,
      payload: data ?? [],
    });
  } catch (error) {
    dispatch({
      type: FETCH_EXERCISES_FAILURE,
      payload: error.message,
    });
  }
};
