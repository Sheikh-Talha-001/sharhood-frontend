// ============================================================
// src/services/api.ts — Centralized Axios Instance
// ============================================================
//
// WHY A CENTRALIZED INSTANCE?
//   1. Base URL: Defined once via env variable. Change it for deployment.
//   2. Credentials: We use HttpOnly cookies for JWTs, so we MUST
//      send withCredentials: true on EVERY request to attach the cookie.
//   3. Interceptors: We catch 401 (Unauthorized) errors globally
//      so the app can react to expired sessions.
//
// IMPORTANT:
//   - We do NOT use localStorage for token storage.
//   - We do NOT add Authorization headers manually.
//   - The backend sets/clears HttpOnly cookies automatically.
// ============================================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial — sends HttpOnly cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// Response Interceptor
// ============================================================
// Intercepts all responses from the backend before they reach
// the component that made the request.
// ============================================================
api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just pass the response through
    return response;
  },
  (error) => {
    // If the request fails, check if it's a 401 Unauthorized.
    // This typically means the token expired or the user was suspended.
    if (error.response && error.response.status === 401) {
      console.warn('401 Unauthorized detected. Token may be expired.');
      // We do NOT force a redirect here — the AuthContext handles
      // clearing the user state, and ProtectedRoute handles the redirect.
      // This avoids circular dependencies and keeps responsibilities clear.
    }

    // Reject the promise so the calling component can catch the error
    return Promise.reject(error);
  }
);

export default api;
