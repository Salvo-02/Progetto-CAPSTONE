import {
  REGISTER_UPDATE_FIELD,
  REGISTER_SET_ERRORS,
  REGISTER_CLEAR_ERRORS,
  REGISTER_SUBMIT_REQUEST,
  REGISTER_SUBMIT_SUCCESS,
  REGISTER_SUBMIT_FAILURE,
} from "./ActionTypes";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const updateRegisterField = (field, value) => ({
  type: REGISTER_UPDATE_FIELD,
  payload: { field, value },
});

export const setRegisterErrors = (errors) => ({
  type: REGISTER_SET_ERRORS,
  payload: errors,
});

export const clearRegisterErrors = () => ({
  type: REGISTER_CLEAR_ERRORS,
});

const registerSubmitRequest = () => ({ type: REGISTER_SUBMIT_REQUEST });
const registerSubmitSuccess = (data) => ({
  type: REGISTER_SUBMIT_SUCCESS,
  payload: data,
});
const registerSubmitFailure = (message) => ({
  type: REGISTER_SUBMIT_FAILURE,
  payload: message,
});

const validateRegisterForm = (form) => {
  const errors = {};
  const { email, username, fullName, password, confirmPassword } = form;

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!username.trim()) {
    errors.username = "Username is required";
  } else if (username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (!password) {
    errors.password = "Password is required";
  } else if (!hasMinLength || !hasUppercase || !hasLowercase || !hasDigit) {
    errors.password = "Password must have 6+ chars, 1 uppercase, 1 lowercase and 1 number";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

// thunk async
export const submitRegister = () => {
  return async (dispatch, getState) => {
    const { register } = getState();
    const { form } = register;

    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length > 0) {
      dispatch(setRegisterErrors(validationErrors));
      return;
    }

    dispatch(registerSubmitRequest());
    dispatch(clearRegisterErrors());

    try {
      const res = await fetch(`${baseUrl}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          username: form.username.trim(),
          fullName: form.fullName.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.message || "Registration failed. Please try again.";
        return dispatch(registerSubmitFailure(message));
      }

      dispatch(registerSubmitSuccess(data));
    } catch {
      dispatch(registerSubmitFailure("Network error. Please check your connection and try again."));
    }
  };
};
