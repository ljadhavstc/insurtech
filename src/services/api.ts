/**
 * API Service
 * 
 * Axios instance with interceptors for:
 * - Attaching auth token from store
 * - Handling 401 errors with token refresh
 * - Request/response logging
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStore } from '@/stores/authStore';

// Import Reactotron for network logging in development
let Reactotron: any = null;
if (__DEV__) {
  try {
    Reactotron = require('@/config/ReactotronConfig').default;
  } catch (e) {
    // Reactotron not available
  }
}

// Base URL - in production, this would come from env
const BASE_URL = 'https://insurancebackenduat.stc.com.bh';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request to Reactotron in development
    if (__DEV__ && Reactotron) {
      Reactotron.display({
        name: 'API Request',
        value: {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
          data: config.data,
        },
        preview: `${config.method?.toUpperCase()} ${config.url}`,
      });
    }
    
    return config;
  },
  (error) => {
    // Log error to Reactotron in development
    if (__DEV__ && Reactotron) {
      Reactotron.error('API Request Error', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 with refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Log successful response to Reactotron in development
    if (__DEV__ && Reactotron) {
      Reactotron.display({
        name: 'API Response',
        value: {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          data: response.data,
        },
        preview: `${response.status} ${response.config.url}`,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    // Log error response to Reactotron in development
    if (__DEV__ && Reactotron) {
      Reactotron.display({
        name: 'API Error',
        value: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        },
        preview: `Error ${error.response?.status || 'N/A'} ${error.config?.url || 'N/A'}`,
      });
    }
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        const refreshToken = authStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call mock refresh endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        // Update store
        authStore.getState().setTokens(newToken, newRefreshToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        
        // Clear auth and redirect to login
        authStore.getState().logout();
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

