/**
 * API Requests
 * 
 * Centralized API request functions with:
 * - Input validation and sanitization
 * - SQL injection prevention
 * - Type safety
 * - Error handling
 */

import api from './api';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Validates and sanitizes mobile number
 * Prevents SQL injection and ensures proper format
 */
export const validateMobileNumber = (mobileNumber: string): { isValid: boolean; error?: string; sanitized?: string } => {
  if (!mobileNumber || typeof mobileNumber !== 'string') {
    return { isValid: false, error: 'Mobile number is required' };
  }

  // Remove any whitespace
  const trimmed = mobileNumber.trim();

  // Check for SQL injection patterns
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/i,
    /(--|;|'|"|`|\*|%|_)/,
    /(\bOR\b|\bAND\b).*(\d+|=|'|")/i,
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Invalid mobile number format' };
    }
  }

  // Validate mobile number format (8-15 digits)
  const mobileRegex = /^[0-9]{8,15}$/;
  if (!mobileRegex.test(trimmed)) {
    return { isValid: false, error: 'Mobile number must be 8-15 digits' };
  }

  return { isValid: true, sanitized: trimmed };
};

/**
 * Validates and sanitizes string input
 * Prevents SQL injection and XSS
 */
export const sanitizeString = (input: string, maxLength?: number): { isValid: boolean; error?: string; sanitized?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required' };
  }

  const trimmed = input.trim();

  // Check length
  if (maxLength && trimmed.length > maxLength) {
    return { isValid: false, error: `Input must be less than ${maxLength} characters` };
  }

  // Check for SQL injection patterns
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/i,
    /(--|;|'|"|`|\*|%)/,
    /(\bOR\b|\bAND\b).*(\d+|=|'|")/i,
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Invalid input format' };
    }
  }

  // Remove potentially dangerous characters but keep basic punctuation
  const sanitized = trimmed.replace(/[<>]/g, '');

  return { isValid: true, sanitized };
};

/**
 * Generic API request function
 * Handles different HTTP methods with proper typing
 */
export const makeRequest = async <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const requestConfig: AxiosRequestConfig = {
    ...config,
    method,
    url: endpoint,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestConfig.data = data;
  } else if (data && method === 'GET') {
    requestConfig.params = data;
  }

  return api.request<T>(requestConfig);
};

/**
 * Login API
 * POST /customer/login
 * 
 * @param username - Mobile number (username)
 * @param password - User password
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id?: string;
    username?: string;
    mobile_number?: string;
    email?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const loginRequest = async (username: string, password: string): Promise<LoginResponse> => {
  // Validate mobile number (username)
  const mobileValidation = validateMobileNumber(username);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    throw new Error('Password is required');
  }

  // Sanitize password (basic check, don't modify it)
  const passwordValidation = sanitizeString(password, 100);
  if (!passwordValidation.isValid) {
    throw new Error('Invalid password format');
  }

  const response = await makeRequest<LoginResponse>(
    'POST',
    '/customer/login',
    {
      username: mobileValidation.sanitized,
      password: password.trim(),
    }
  );

  return response.data;
};

/**
 * Log Customer Step API
 * POST /customer/log-customer-step
 * 
 * @param mobileNumber - Customer mobile number
 * @param step - Step description (e.g., "User log out", "Login successful", etc.)
 */
export interface LogCustomerStepRequest {
  mobile_number: string;
  step: string;
}

export interface LogCustomerStepResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export const logCustomerStepRequest = async (
  mobileNumber: string,
  step: string
): Promise<LogCustomerStepResponse> => {
  // Validate mobile number
  const mobileValidation = validateMobileNumber(mobileNumber);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  // Validate and sanitize step
  const stepValidation = sanitizeString(step, 200);
  if (!stepValidation.isValid || !stepValidation.sanitized) {
    throw new Error(stepValidation.error || 'Invalid step description');
  }

  const response = await makeRequest<LogCustomerStepResponse>(
    'POST',
    '/customer/log-customer-step',
    {
      mobile_number: mobileValidation.sanitized,
      step: stepValidation.sanitized,
    }
  );

  return response.data;
};

