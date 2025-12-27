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

/**
 * Generate OTP API
 * POST /customer/generate-otp
 * 
 * @param mobileNumber - Mobile number to send OTP to
 */
export interface GenerateOTPRequest {
  mobile_number: string;
}

export interface GenerateOTPResponse {
  success?: boolean;
  message?: string;
  otp?: string; // May be included in dev/staging
  [key: string]: any;
}

export const generateOTPRequest = async (mobileNumber: string): Promise<GenerateOTPResponse> => {
  // Validate mobile number
  const mobileValidation = validateMobileNumber(mobileNumber);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  const response = await makeRequest<GenerateOTPResponse>(
    'POST',
    '/customer/generate-otp',
    {
      mobile_number: mobileValidation.sanitized,
    }
  );

  return response.data;
};

/**
 * Verify OTP API
 * POST /customer/verify-otp
 * 
 * @param mobileNumber - Mobile number that received the OTP
 * @param pin - OTP code (4 digits)
 */
export interface VerifyOTPRequest {
  mobile_number: string;
  pin: string;
}

export interface VerifyOTPResponse {
  success?: boolean;
  message?: string;
  token?: string;
  resetToken?: string;
  verificationToken?: string;
  [key: string]: any;
}

export const verifyOTPRequest = async (mobileNumber: string, pin: string): Promise<VerifyOTPResponse> => {
  // Validate mobile number
  const mobileValidation = validateMobileNumber(mobileNumber);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  // Validate OTP (pin) - should be 4 digits
  if (!pin || typeof pin !== 'string') {
    throw new Error('OTP code is required');
  }

  const pinTrimmed = pin.trim();
  const pinRegex = /^[0-9]{4}$/;
  if (!pinRegex.test(pinTrimmed)) {
    throw new Error('OTP code must be 4 digits');
  }

  const response = await makeRequest<VerifyOTPResponse>(
    'POST',
    '/customer/verify-otp',
    {
      mobile_number: mobileValidation.sanitized,
      pin: pinTrimmed,
    }
  );

  return response.data;
};

/**
 * Resend OTP API
 * POST /customer/resend-otp
 * 
 * @param mobileNumber - Mobile number to resend OTP to
 */
export interface ResendOTPRequest {
  mobile_number: string;
}

export interface ResendOTPResponse {
  success?: boolean;
  message?: string;
  otp?: string; // May be included in dev/staging
  [key: string]: any;
}

export const resendOTPRequest = async (mobileNumber: string): Promise<ResendOTPResponse> => {
  // Validate mobile number
  const mobileValidation = validateMobileNumber(mobileNumber);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  const response = await makeRequest<ResendOTPResponse>(
    'POST',
    '/customer/resend-otp',
    {
      mobile_number: mobileValidation.sanitized,
    }
  );

  return response.data;
};

/**
 * Forgot Password API (Reset Password)
 * POST /customer/forgot-password
 * 
 * @param mobileNumber - Customer mobile number (username)
 * @param newPassword - New password to set
 */
export interface ForgotPasswordRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: {
    status?: string;
    message?: string;
  };
  [key: string]: any;
}

export const forgotPasswordRequest = async (
  mobileNumber: string,
  newPassword: string
): Promise<ForgotPasswordResponse> => {
  // Validate mobile number
  const mobileValidation = validateMobileNumber(mobileNumber);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  // Validate password
  if (!newPassword || typeof newPassword !== 'string') {
    throw new Error('Password is required');
  }

  const passwordTrimmed = newPassword.trim();
  if (passwordTrimmed.length < 1) {
    throw new Error('Password cannot be empty');
  }

  if (passwordTrimmed.length > 100) {
    throw new Error('Password is too long');
  }

  // Check for SQL injection patterns in password
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/i,
    /(--|;|'|"|`|\*|%)/,
    /(\bOR\b|\bAND\b).*(\d+|=|'|")/i,
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(passwordTrimmed)) {
      throw new Error('Invalid password format');
    }
  }

  const response = await makeRequest<ForgotPasswordResponse>(
    'POST',
    '/customer/forgot-password',
    {
      username: mobileValidation.sanitized,
      password: passwordTrimmed,
    }
  );

  const responseData = response.data;

  // Check if API returned error in response data (even with 200 status)
  if (responseData.status === 'error' || responseData.data?.status === 'error') {
    const errorMessage = responseData.message || responseData.data?.message || 'Customer not found';
    const error = new Error(errorMessage);
    (error as any).response = {
      data: {
        status: 'error',
        message: errorMessage,
        data: responseData.data,
      },
    };
    throw error;
  }

  return responseData;
};

/**
 * Register API
 * POST /customer/account-register
 * 
 * @param username - Mobile number (username)
 * @param password - User password
 * @param mobile - Mobile number
 * @param email - Email address
 * @param cpr - CPR number (hardcoded for now, will come from JUMIO later)
 */
export interface RegisterRequest {
  username: string;
  password: string;
  mobile: string;
  email: string;
  cpr: string;
}

export interface RegisterResponse {
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

export const registerRequest = async (
  username: string,
  password: string,
  mobile: string,
  email: string,
  cpr: string = '22347889' // Hardcoded for now, will come from JUMIO later
): Promise<RegisterResponse> => {
  // Validate mobile number (username)
  const mobileValidation = validateMobileNumber(username);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  // Validate mobile number (mobile field)
  const mobileFieldValidation = validateMobileNumber(mobile);
  if (!mobileFieldValidation.isValid || !mobileFieldValidation.sanitized) {
    throw new Error(mobileFieldValidation.error || 'Invalid mobile number');
  }

  // Validate email
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    throw new Error('Invalid email address');
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    throw new Error('Password is required');
  }

  const passwordTrimmed = password.trim();
  if (passwordTrimmed.length < 1) {
    throw new Error('Password cannot be empty');
  }

  if (passwordTrimmed.length > 100) {
    throw new Error('Password is too long');
  }

  // Validate CPR (basic validation - should be numeric, 8-15 digits)
  if (!cpr || typeof cpr !== 'string') {
    throw new Error('CPR is required');
  }

  const cprTrimmed = cpr.trim();
  const cprRegex = /^[0-9]{8,15}$/;
  if (!cprRegex.test(cprTrimmed)) {
    throw new Error('CPR must be 8-15 digits');
  }

  // Sanitize email
  const emailValidation = sanitizeString(email, 255);
  if (!emailValidation.isValid || !emailValidation.sanitized) {
    throw new Error('Invalid email format');
  }

  const response = await makeRequest<RegisterResponse>(
    'POST',
    '/customer/account-register',
    {
      username: mobileValidation.sanitized,
      password: passwordTrimmed,
      mobile: mobileFieldValidation.sanitized,
      email: emailValidation.sanitized,
      cpr: cprTrimmed,
    }
  );

  return response.data;
};

/**
 * Initiate JUMIO Verification API
 * POST /passport/verify
 * Returns JUMIO SDK token and configuration
 */
export interface InitiateJumioVerificationRequest {
  msisdn?: string; // Optional: mobile number
}

export interface InitiateJumioVerificationResponse {
  success?: boolean;
  error_code?: number;
  message?: string;
  data?: {
    token?: string; // JUMIO SDK token
    transactionId?: string;
    accountId?: string;
    workflowExecutionId?: string;
    [key: string]: any;
  };
  // Legacy fields (for backward compatibility)
  token?: string;
  api_token?: string;
  api_secret?: string;
  datacenter?: string;
  transaction_id?: string;
  account_id?: string;
  workflow_id?: string;
  [key: string]: any;
}

export const initiateJumioVerification = async (
  mobileNumber?: string
): Promise<InitiateJumioVerificationResponse> => {
  const requestData: InitiateJumioVerificationRequest = {};
  
  if (mobileNumber) {
    const mobileValidation = validateMobileNumber(mobileNumber);
    if (mobileValidation.isValid && mobileValidation.sanitized) {
      requestData.msisdn = mobileValidation.sanitized;
    }
  }

  console.log('📤 Calling backend /passport/verify:', requestData);

  const response = await makeRequest<InitiateJumioVerificationResponse>(
    'POST',
    '/passport/verify',
    requestData
  );

  console.log('📥 Backend /passport/verify response:', {
    status: response.status,
    data: response.data,
  });

  return response.data;
};

/**
 * Check JUMIO Verification Status API
 * POST /passport/verification-status
 */
export interface CheckJumioVerificationStatusRequest {
  transaction_id: string;
  msisdn: string;
  account_id: string;
  workflow_id: string;
}

export interface CheckJumioVerificationStatusResponse {
  success?: boolean;
  message?: string;
  status?: string; // e.g., "APPROVED_VERIFIED", "DENIED_FRAUD", etc.
  verification_status?: string;
  cpr?: string; // Extracted CPR from document
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  [key: string]: any;
}

export const checkJumioVerificationStatus = async (
  data: CheckJumioVerificationStatusRequest
): Promise<CheckJumioVerificationStatusResponse> => {
  // Validate mobile number
  const mobileValidation = validateMobileNumber(data.msisdn);
  if (!mobileValidation.isValid || !mobileValidation.sanitized) {
    throw new Error(mobileValidation.error || 'Invalid mobile number');
  }

  // Validate transaction_id
  if (!data.transaction_id || typeof data.transaction_id !== 'string') {
    throw new Error('Transaction ID is required');
  }

  // Validate account_id
  if (!data.account_id || typeof data.account_id !== 'string') {
    throw new Error('Account ID is required');
  }

  // Validate workflow_id
  if (!data.workflow_id || typeof data.workflow_id !== 'string') {
    throw new Error('Workflow ID is required');
  }

  const response = await makeRequest<CheckJumioVerificationStatusResponse>(
    'POST',
    '/passport/verification-status',
    {
      transaction_id: data.transaction_id,
      msisdn: mobileValidation.sanitized,
      account_id: data.account_id,
      workflow_id: data.workflow_id,
    }
  );

  return response.data;
};

