import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// ─── Environment Config ───────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn(
    '[apiClient] VITE_API_URL is not defined. ' +
      'Create a .env file with VITE_API_URL=http://localhost:8000/api/v1'
  );
}

const BASE_URL = API_URL || 'http://localhost:8000/api/v1';

// ─── Token Helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'tn_access_token';
const ROLE_KEY  = 'tn_role';

export const getToken  = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getRole   = (): string | null => localStorage.getItem(ROLE_KEY);
export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

// ─── Axios Instance ───────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach JWT token if present
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set Content-Type + boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login?role=admin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;