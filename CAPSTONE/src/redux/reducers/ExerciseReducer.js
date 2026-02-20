import { FETCH_EXERCISES_REQUEST, FETCH_EXERCISES_SUCCESS, FETCH_EXERCISES_FAILURE } from "../action/ActionTypes";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const ExercisesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXERCISES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_EXERCISES_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case FETCH_EXERCISES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default ExercisesReducer;
