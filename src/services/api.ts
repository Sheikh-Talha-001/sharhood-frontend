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

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized detected. Token may be expired.');
    }

    if (error.response?.status === 403 && error.response?.data?.error?.toLowerCase().includes('suspended')) {
      console.warn('403 Suspended detected. Dispatching event to update context state.');
      window.dispatchEvent(new Event('user_suspended'));
    }

    if (error.response?.status === 429) {
      console.warn('429 Rate limit hit. Too many requests from this IP.');
      // Attach a user-friendly message so components can read it
      error.friendlyMessage = 'Too many requests. Please wait a moment and try again.';
    }

    if (error.response?.status === 404) {
      if (typeof error.response.data === 'string' && (error.response.data.includes('<!DOCTYPE') || error.response.data.includes('Cannot '))) {
         // Sanitize express default 404 HTML response which leaks routes
         error.response.data = { error: "Resource not found." };
      }
    }

    return Promise.reject(error);
  }
);

export default api;
