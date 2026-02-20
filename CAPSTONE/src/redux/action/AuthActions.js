import {
  LOGIN_UPDATE_FIELD,
  LOGIN_SET_ERRORS,
  LOGIN_CLEAR_ERRORS,
  LOGIN_SUBMIT_REQUEST,
  LOGIN_SUBMIT_SUCCESS,
  LOGIN_SUBMIT_FAILURE,
  AUTH_LOGOUT,
} from "../action/ActionTypes";
import { jwtDecode } from "jwt-decode";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const updateLoginField = (field, value) => ({
  type: LOGIN_UPDATE_FIELD,
  payload: { field, value },
});

export const setLoginErrors = (errors) => ({
  type: LOGIN_SET_ERRORS,
  payload: errors,
});

export const clearLoginErrors = () => ({
  type: LOGIN_CLEAR_ERRORS,
});

const loginSubmitRequest = () => ({ type: LOGIN_SUBMIT_REQUEST });

const loginSubmitSuccess = (authData) => ({
  type: LOGIN_SUBMIT_SUCCESS,
  payload: authData,
});

const loginSubmitFailure = (message) => ({
  type: LOGIN_SUBMIT_FAILURE,
  payload: message,
});

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
  return { type: AUTH_LOGOUT };
};

const validateLoginForm = (form) => {
  const errors = {};
  const { email, password } = form;

  if (!email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";

  if (!password.trim()) errors.password = "Password is required";

  return errors;
};

export const submitLogin = () => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const { form } = auth;

    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      dispatch(setLoginErrors(validationErrors));
      return;
    }

    dispatch(loginSubmitRequest());
    dispatch(clearLoginErrors());

    try {
      const response = await fetch(`${baseUrl}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || "Invalid credentials. Please try again.";
        return dispatch(loginSubmitFailure(message));
      }

      const token = data?.accessToken ?? null;
      const refreshToken = data?.refreshToken ?? null;
      const expiration = data?.expiresAt ?? null;

      let fullNameFromJwt = null;
      let roleFromJwt = null;

      if (token) {
        try {
          const decoded = jwtDecode(token);

          fullNameFromJwt = decoded?.given_name || decoded?.fullName || null;

          roleFromJwt = decoded?.role || decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
        } catch (e) {
          console.error("JWT decode error:", e);
        }
      }

      const authData = {
        token,
        refreshToken,
        expiration,

        email: form.email.trim(),
        fullName: fullNameFromJwt,
        role: roleFromJwt,
      };

      if (authData.token) localStorage.setItem("accessToken", authData.token);
      if (authData.refreshToken) localStorage.setItem("refreshToken", authData.refreshToken);

      localStorage.setItem(
        "authUser",
        JSON.stringify({
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
        }),
      );

      dispatch(loginSubmitSuccess(authData));
    } catch {
      dispatch(loginSubmitFailure("Login failed. Please check your connection and try again."));
    }
  };
};
