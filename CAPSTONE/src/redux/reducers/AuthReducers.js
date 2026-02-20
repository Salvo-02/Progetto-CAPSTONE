// src/redux/reducers/authReducer.js
import {
  LOGIN_UPDATE_FIELD,
  LOGIN_SET_ERRORS,
  LOGIN_CLEAR_ERRORS,
  LOGIN_SUBMIT_REQUEST,
  LOGIN_SUBMIT_SUCCESS,
  LOGIN_SUBMIT_FAILURE,
  AUTH_LOGOUT,
} from "../action/ActionTypes";

const initialForm = {
  email: "",
  password: "",
};

const savedToken = localStorage.getItem("accessToken");
const savedRefreshToken = localStorage.getItem("refreshToken");
let savedUser = null;

try {
  const rawUser = localStorage.getItem("authUser");
  savedUser = rawUser ? JSON.parse(rawUser) : null;
} catch {
  savedUser = null;
}

const initialState = {
  form: initialForm,
  errors: {},
  loading: false,
  isAuthenticated: !!savedToken,
  token: savedToken || null,
  refreshToken: savedRefreshToken || null,
  user: savedUser,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_UPDATE_FIELD: {
      const { field, value } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          [field]: value,
        },
        errors: {
          ...state.errors,
          [field]: undefined,
          global: undefined,
        },
      };
    }

    case LOGIN_SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };

    case LOGIN_CLEAR_ERRORS:
      return {
        ...state,
        errors: {},
      };

    case LOGIN_SUBMIT_REQUEST:
      return {
        ...state,
        loading: true,
        errors: {
          ...state.errors,
          global: undefined,
        },
      };

    case LOGIN_SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token || null,
        refreshToken: action.payload.refreshToken || null,
        user: {
          email: action.payload.email,
          fullName: action.payload.fullName,
          role: action.payload.role,
        },
        form: initialForm,
        errors: {},
      };

    case LOGIN_SUBMIT_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        user: null,
        errors: {
          ...state.errors,
          global: action.payload,
        },
      };

    case AUTH_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        user: null,
        form: initialForm,
        errors: {},
      };

    default:
      return state;
  }
};
