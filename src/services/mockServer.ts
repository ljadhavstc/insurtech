/**
 * Mock Server
 * 
 * Simple mock server to simulate API endpoints for development.
 * Provides realistic responses with latency simulation.
 * 
 * In production, replace these with actual API calls.
 */

import api from './api';

// OTP and cooldown tracking
interface OTPData {
  otp: string;
  expiresAt: number; // Timestamp when OTP expires
  sentAt: number; // Timestamp when OTP was sent
  wrongAttempts: number; // Count of wrong OTP attempts
  cooldownUntil?: number; // Timestamp when cooldown ends
  lastResendAt?: number; // Timestamp of last resend
}

// Mock data storage
const mockUsers: Record<string, { email: string; phoneNumber?: string; password: string }> = {
  'user@example.com': {
    email: 'user@example.com',
    phoneNumber: '33011234',
    password: 'password123',
  },
  // Sample user for testing
  '33011234': {
    email: 'test@example.com',
    phoneNumber: '33011234',
    password: 'Password123',
  },
  // Test mobile number for OTP testing
  '12345678': {
    email: 'testmobile@example.com',
    phoneNumber: '12345678',
    password: 'Test1234',
  },
};

const mockTokens: Record<string, { token: string; refreshToken: string }> = {};

// OTP storage: key is mobile number or email
const otpData: Record<string, OTPData> = {};

// Constants
const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN = 60 * 1000; // 60 seconds
const MAX_WRONG_ATTEMPTS = 3;
const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes

// Generate mock token
const generateToken = (email: string): { token: string; refreshToken: string } => {
  const token = `mock_token_${email}_${Date.now()}`;
  const refreshToken = `mock_refresh_${email}_${Date.now()}`;
  mockTokens[email] = { token, refreshToken };
  return { token, refreshToken };
};

// Simulate network latency
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

/**
 * Mock login endpoint
 * Supports both email and phoneNumber login
 */
export const mockLogin = async (emailOrPhone: string, password: string) => {
  await delay(1000); // Simulate network delay

  // Try to find user by email or phoneNumber
  let user = mockUsers[emailOrPhone];
  if (!user) {
    // Search by phoneNumber
    const foundUser = Object.values(mockUsers).find(
      (u) => u.phoneNumber === emailOrPhone
    );
    if (foundUser) {
      user = foundUser;
    }
  }

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const identifier = user.email || emailOrPhone;
  const tokens = generateToken(identifier);
  return {
    success: true,
    user: {
      email: user.email,
      phoneNumber: user.phoneNumber,
      id: identifier,
    },
    ...tokens,
  };
};

/**
 * Mock register endpoint (legacy - for direct registration)
 */
export const mockRegister = async (email: string, password: string, name: string) => {
  await delay(1200);

  if (mockUsers[email]) {
    throw new Error('User already exists');
  }

  mockUsers[email] = { email, password };
  const tokens = generateToken(email);

  return {
    success: true,
    user: {
      email,
      name,
      id: email,
    },
    ...tokens,
  };
};

/**
 * Mock register send OTP endpoint - sends OTP for registration
 */
export const mockRegisterSendOTP = async (mobileNumber: string) => {
  await delay(800);

  const now = Date.now();
  const identifier = mobileNumber;

  // Check if user already exists
  // Allow test number 12341234 to request OTP multiple times for testing
  const isTestRegistrationNumber = mobileNumber === '12341234';
  if (!isTestRegistrationNumber) {
    const existingUser = Object.values(mockUsers).find(
      (u) => u.phoneNumber === mobileNumber
    );
    if (existingUser) {
      throw new Error('User with this mobile number already exists');
    }
  }

  // Check cooldown period
  const existingOTP = otpData[identifier];
  if (existingOTP?.cooldownUntil && now < existingOTP.cooldownUntil) {
    const remainingSeconds = Math.ceil((existingOTP.cooldownUntil - now) / 1000);
    throw new Error(`Please wait ${Math.ceil(remainingSeconds / 60)} minutes before requesting a new OTP`);
  }

  // Check resend cooldown (60 seconds)
  if (existingOTP?.lastResendAt && (now - existingOTP.lastResendAt) < RESEND_COOLDOWN) {
    const remainingSeconds = Math.ceil((RESEND_COOLDOWN - (now - existingOTP.lastResendAt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds} seconds before resending OTP`);
  }

  // Generate 4-digit OTP
  // Test numbers with fixed OTP for easy testing
  const testNumbers = ['12345678', '12341234']; // Registration test number: 12341234
  const isTestNumber = testNumbers.includes(identifier);
  const otp = isTestNumber ? '1234' : Math.floor(1000 + Math.random() * 9000).toString();
  
  // Store OTP data
  otpData[identifier] = {
    otp,
    expiresAt: now + OTP_EXPIRY_TIME,
    sentAt: now,
    wrongAttempts: existingOTP?.wrongAttempts || 0,
    lastResendAt: now,
  };

  // Reset cooldown if it was set
  if (existingOTP?.cooldownUntil) {
    delete otpData[identifier].cooldownUntil;
  }

  // In real app, send OTP via SMS
  if (isTestNumber) {
    console.log(`[MOCK] ✅ Registration OTP for ${identifier}: ${otp} (Use this code for testing)`);
    if (identifier === '12341234') {
      console.log(`[MOCK] 📱 Registration Test Number: 12341234 | OTP: 1234`);
    } else {
      console.log(`[MOCK] 📱 Test mobile number: 12345678 | OTP: 1234`);
    }
  } else {
    console.log(`[MOCK] Registration OTP for ${identifier}: ${otp}`);
  }

  return {
    success: true,
    message: 'OTP has been sent to your mobile number.',
    otp, // Only for development - remove in production
    resendCooldown: RESEND_COOLDOWN / 1000, // seconds
  };
};

/**
 * Mock register complete endpoint - completes registration with password and email
 */
export const mockRegisterComplete = async (mobileNumber: string, password: string, email?: string, verificationToken?: string) => {
  await delay(1000);

  // Verify that OTP was verified (check if verificationToken is valid)
  // In real app, verify the token properly
  if (verificationToken && !verificationToken.startsWith(`reset_token_${mobileNumber}`)) {
    throw new Error('Invalid verification token');
  }

  // Use provided email or generate one
  const userEmail = email || `${mobileNumber}@mobile.user`;

  // Check if user already exists by email
  if (mockUsers[userEmail] && userEmail !== `${mobileNumber}@mobile.user`) {
    throw new Error('User with this email already exists');
  }

  // Check if user already exists by mobile number
  // Allow test number 12341234 to be registered multiple times for testing
  const isTestRegistrationNumber = mobileNumber === '12341234';
  if (!isTestRegistrationNumber) {
    const existingUser = Object.values(mockUsers).find(
      (u) => u.phoneNumber === mobileNumber
    );
    if (existingUser) {
      throw new Error('User with this mobile number already exists');
    }
  } else {
    // For test number, remove existing user to allow re-registration
    const existingUser = Object.values(mockUsers).find(
      (u) => u.phoneNumber === mobileNumber
    );
    if (existingUser) {
      // Remove existing user to allow re-registration for testing
      delete mockUsers[mobileNumber];
      const oldEmail = existingUser.email;
      if (oldEmail && mockUsers[oldEmail]) {
        delete mockUsers[oldEmail];
      }
      console.log(`[MOCK] 🧪 Test number ${mobileNumber} - cleared existing user for re-registration`);
    }
  }

  // Create new user
  mockUsers[mobileNumber] = { 
    email: userEmail, 
    phoneNumber: mobileNumber, 
    password 
  };
  mockUsers[userEmail] = { 
    email: userEmail, 
    phoneNumber: mobileNumber, 
    password 
  };

  const tokens = generateToken(userEmail);

  // Clear OTP data
  if (otpData[mobileNumber]) {
    delete otpData[mobileNumber];
  }

  return {
    success: true,
    message: 'Registration completed successfully',
    user: {
      email: userEmail,
      phoneNumber: mobileNumber,
      id: mobileNumber,
    },
    ...tokens,
  };
};

/**
 * Mock forgot password endpoint - sends OTP
 * Supports both email and mobile number
 */
export const mockForgotPassword = async (emailOrMobile: string) => {
  await delay(800);

  const now = Date.now();
  const identifier = emailOrMobile;

  // Check if user exists (by email or phoneNumber)
  let user = mockUsers[emailOrMobile];
  if (!user) {
    // Search by phoneNumber
    const foundUser = Object.values(mockUsers).find(
      (u) => u.phoneNumber === emailOrMobile
    );
    if (foundUser) {
      user = foundUser;
    }
  }

  // Check cooldown period
  const existingOTP = otpData[identifier];
  if (existingOTP?.cooldownUntil && now < existingOTP.cooldownUntil) {
    const remainingSeconds = Math.ceil((existingOTP.cooldownUntil - now) / 1000);
    throw new Error(`Please wait ${Math.ceil(remainingSeconds / 60)} minutes before requesting a new OTP`);
  }

  // Check resend cooldown (60 seconds)
  if (existingOTP?.lastResendAt && (now - existingOTP.lastResendAt) < RESEND_COOLDOWN) {
    const remainingSeconds = Math.ceil((RESEND_COOLDOWN - (now - existingOTP.lastResendAt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds} seconds before resending OTP`);
  }

  // Generate 4-digit OTP
  // Test numbers with fixed OTP for easy testing
  const testNumbers = ['12345678', '12341234']; // Registration test number: 12341234
  const isTestNumber = testNumbers.includes(identifier);
  const otp = isTestNumber ? '1234' : Math.floor(1000 + Math.random() * 9000).toString();
  
  // Store OTP data
  otpData[identifier] = {
    otp,
    expiresAt: now + OTP_EXPIRY_TIME,
    sentAt: now,
    wrongAttempts: existingOTP?.wrongAttempts || 0,
    lastResendAt: now,
  };

  // Reset cooldown if it was set
  if (existingOTP?.cooldownUntil) {
    delete otpData[identifier].cooldownUntil;
  }

  // In real app, send OTP via email/SMS
  if (isTestNumber) {
    console.log(`[MOCK] ✅ Test OTP for ${identifier}: ${otp} (Use this code for testing)`);
    if (identifier === '12341234') {
      console.log(`[MOCK] 📱 Registration Test Number: 12341234 | OTP: 1234`);
    } else {
      console.log(`[MOCK] 📱 Test mobile number: 12345678 | OTP: 1234`);
    }
  } else {
    console.log(`[MOCK] OTP for ${identifier}: ${otp}`);
  }

  // Don't reveal if user exists (security best practice)
  return {
    success: true,
    message: 'If an account exists, an OTP has been sent.',
    otp, // Only for development - remove in production
    resendCooldown: RESEND_COOLDOWN / 1000, // seconds
  };
};

/**
 * Mock OTP verification endpoint
 * Supports both email and mobile number
 * Supports different purposes: password-reset, registration, verification
 */
export const mockVerifyOTP = async (emailOrMobile: string, otp: string, purpose?: string) => {
  await delay(600);

  const now = Date.now();
  const identifier = emailOrMobile;
  const otpInfo = otpData[identifier];

  // Check if OTP exists
  if (!otpInfo) {
    throw new Error('No OTP found. Please request a new OTP.');
  }

  // Check cooldown period
  if (otpInfo.cooldownUntil && now < otpInfo.cooldownUntil) {
    const remainingSeconds = Math.ceil((otpInfo.cooldownUntil - now) / 1000);
    throw new Error(`Too many failed attempts. Please wait ${Math.ceil(remainingSeconds / 60)} minutes before trying again.`);
  }

  // Check if OTP expired
  if (now > otpInfo.expiresAt) {
    delete otpData[identifier];
    throw new Error('OTP has expired. Please request a new OTP.');
  }

  // Verify OTP
  if (otpInfo.otp !== otp) {
    otpInfo.wrongAttempts += 1;

    // If wrong attempts exceed limit, set cooldown
    if (otpInfo.wrongAttempts >= MAX_WRONG_ATTEMPTS) {
      otpInfo.cooldownUntil = now + COOLDOWN_PERIOD;
      const remainingMinutes = Math.ceil(COOLDOWN_PERIOD / 60000);
      throw new Error(`Too many failed attempts. Please wait ${remainingMinutes} minutes before requesting a new OTP.`);
    }

    const remainingAttempts = MAX_WRONG_ATTEMPTS - otpInfo.wrongAttempts;
    throw new Error(`Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`);
  }

  // For registration, don't require existing user
  if (purpose === 'registration') {
    // Clear OTP after successful verification
    delete otpData[identifier];
    
    return {
      success: true,
      message: 'OTP verified successfully',
      resetToken: `reset_token_${identifier}_${Date.now()}`,
      verificationToken: `reset_token_${identifier}_${Date.now()}`, // Same token for registration
    };
  }

  // For password reset, find user by identifier
  let user = mockUsers[identifier];
  if (!user) {
    const foundUser = Object.values(mockUsers).find(
      (u) => u.phoneNumber === identifier
    );
    if (foundUser) {
      user = foundUser;
    }
  }

  // Clear OTP after successful verification
  delete otpData[identifier];

  return {
    success: true,
    message: 'OTP verified successfully',
    resetToken: `reset_token_${identifier}_${Date.now()}`,
  };
};

/**
 * Mock reset password endpoint
 */
export const mockResetPassword = async (email: string, resetToken: string, newPassword: string) => {
  await delay(800);

  const user = mockUsers[email];
  if (!user) {
    throw new Error('User not found');
  }

  // In real app, verify resetToken
  if (!resetToken.startsWith(`reset_token_${email}`)) {
    throw new Error('Invalid reset token');
  }

  user.password = newPassword;
  
  // Clear OTP data if exists
  if (otpData[email]) {
    delete otpData[email];
  }

  return {
    success: true,
    message: 'Password reset successfully',
  };
};

/**
 * Mock refresh token endpoint
 */
export const mockRefreshToken = async (refreshToken: string) => {
  await delay(500);

  // Find user by refresh token
  const email = Object.keys(mockTokens).find(
    (key) => mockTokens[key].refreshToken === refreshToken
  );

  if (!email) {
    throw new Error('Invalid refresh token');
  }

  const tokens = generateToken(email);
  return tokens;
};

// Verification status tracking
let verificationStartTime: number | null = null;
const VERIFICATION_STEP_DURATION = 3000; // 3 seconds per step

/**
 * Mock verification status endpoint
 * Returns which verification steps are completed
 * Simulates completion: step 1 at 3s, step 2 at 6s, step 3 at 9s
 */
export const mockGetVerificationStatus = async () => {
  await delay(100);

  // Initialize start time if not set
  if (verificationStartTime === null) {
    verificationStartTime = Date.now();
  }

  const elapsed = Date.now() - verificationStartTime;
  const completedSteps: string[] = [];

  // Step 1 (document) completes at 3s
  if (elapsed >= VERIFICATION_STEP_DURATION) {
    completedSteps.push('document');
  }

  // Step 2 (selfie) completes at 6s
  if (elapsed >= VERIFICATION_STEP_DURATION * 2) {
    completedSteps.push('selfie');
  }

  // Step 3 (data) completes at 9s
  if (elapsed >= VERIFICATION_STEP_DURATION * 3) {
    completedSteps.push('data');
  }

  return {
    success: true,
    completedSteps,
    isComplete: completedSteps.length === 3,
    progress: Math.min(completedSteps.length / 3, 1),
  };
};

/**
 * Mock start verification endpoint
 * Initializes verification process
 */
export const mockStartVerification = async () => {
  await delay(500);
  
  // Reset verification start time
  verificationStartTime = Date.now();

  return {
    success: true,
    message: 'Verification process started',
    verificationId: `verification_${Date.now()}`,
  };
};

// Enable mock server in development OR always enable with fallback
// In production, it will try real API first, then fallback to mock if unreachable
const ENABLE_MOCK = true; // Always enable mock server

// FORCE_MOCK_MODE: Set to true to always use mock server first (even in production builds)
// This is useful for testing APKs without a backend server
// When true: APK will use mock server immediately, skipping real API attempts
// When false: APK will try real API first, then fallback to mock if unreachable
const FORCE_MOCK_MODE = true; // ✅ Currently enabled - GitHub Actions builds will use mock server first

// USE_MOCK_FIRST: Determines if mock should be used before trying real API
// In dev mode (__DEV__ = true) OR when FORCE_MOCK_MODE = true, mock is used first
const USE_MOCK_FIRST = __DEV__ || FORCE_MOCK_MODE;

// Store original methods
const originalPost = api.post.bind(api);
const originalGet = api.get.bind(api);

// Helper function to detect if error is a network/connection error
const isNetworkError = (error: any): boolean => {
  // Check error codes
  const networkErrorCodes = [
    'NETWORK_ERROR',
    'ERR_NETWORK',
    'ECONNABORTED',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'EAI_AGAIN',
  ];
  
  if (error.code && networkErrorCodes.includes(error.code)) {
    return true;
  }
  
  // Check error message
  const errorMessage = error.message?.toLowerCase() || '';
  const networkKeywords = [
    'network',
    'timeout',
    'getaddrinfo',
    'econnrefused',
    'enotfound',
    'failed to connect',
    'connection refused',
    'no internet',
    'network request failed',
    'networkerror',
  ];
  
  if (networkKeywords.some(keyword => errorMessage.includes(keyword))) {
    return true;
  }
  
  // If no response and it's a request error, likely network issue
  if (!error.response && error.request) {
    return true;
  }
  
  // Check for DNS/connection errors in response status
  if (error.response?.status === 0 || error.response?.status >= 500) {
    return true;
  }
  
  // 404 on API base URL likely means API doesn't exist
  if (error.response?.status === 404 && error.config?.url?.includes('/auth/')) {
    return true;
  }
  
  return false;
};

// Helper function to get mock response
const getMockResponse = async (url: string, data?: any): Promise<any> => {
  let mockResponse;
  
  if (url.includes('/auth/login')) {
    const identifier = data?.phoneNumber || data?.email;
    mockResponse = await mockLogin(identifier, data?.password);
  } else if (url.includes('/auth/register/send-otp')) {
    const mobileNumber = data?.mobileNumber;
    if (!mobileNumber) {
      throw new Error('Mobile number is required');
    }
    mockResponse = await mockRegisterSendOTP(mobileNumber);
  } else if (url.includes('/auth/register/complete')) {
    const mobileNumber = data?.mobileNumber;
    const password = data?.password;
    const email = data?.email;
    if (!mobileNumber || !password) {
      throw new Error('Mobile number and password are required');
    }
    mockResponse = await mockRegisterComplete(mobileNumber, password, email, data?.resetToken || data?.verificationToken);
  } else if (url.includes('/auth/register')) {
    mockResponse = await mockRegister(data?.email, data?.password, data?.name);
  } else if (url.includes('/auth/forgot-password')) {
    const identifier = data?.mobileNumber || data?.email || data?.phoneNumber;
    if (!identifier) {
      throw new Error('Mobile number or email is required');
    }
    mockResponse = await mockForgotPassword(identifier);
  } else if (url.includes('/auth/otp-verify')) {
    const identifier = data?.mobileNumber || data?.email || data?.phoneNumber;
    if (!identifier || !data?.otp) {
      throw new Error('Mobile number/email and OTP are required');
    }
    mockResponse = await mockVerifyOTP(identifier, data.otp, data?.purpose);
  } else if (url.includes('/auth/reset-password')) {
    mockResponse = await mockResetPassword(data?.email || data?.mobileNumber, data?.resetToken, data?.newPassword);
  } else if (url.includes('/auth/refresh')) {
    mockResponse = await mockRefreshToken(data?.refreshToken);
  } else if (url.includes('/auth/verification/start')) {
    mockResponse = await mockStartVerification();
  } else {
    return null; // Not a mockable endpoint
  }
  
  return {
    data: mockResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
};

// Override axios post method
api.post = async function(url: string, data?: any, config?: any): Promise<any> {
  const isAuthEndpoint = url.includes('/auth/');
  
  // In development, use mock first
  if (USE_MOCK_FIRST && isAuthEndpoint) {
    try {
      const mockResponse = await getMockResponse(url, data);
      if (mockResponse) {
        return Promise.resolve({ ...mockResponse, config: config || {} });
      }
    } catch (error: any) {
      return Promise.reject({
        response: {
          data: { message: error.message },
          status: 400,
          statusText: 'Bad Request',
        },
        message: error.message,
      });
    }
  }
  
  // Try real API first (or if not an auth endpoint)
  return originalPost(url, data, config).catch(async (error: any) => {
    // If API fails and it's an auth endpoint, fallback to mock
    if (isAuthEndpoint && isNetworkError(error)) {
      console.log('[MOCK SERVER] API unreachable, using mock fallback for:', url, error.code || error.message);
      
      try {
        const mockResponse = await getMockResponse(url, data);
        if (mockResponse) {
          return Promise.resolve({ ...mockResponse, config: config || {} });
        }
      } catch (mockError: any) {
        return Promise.reject({
          response: {
            data: { message: mockError.message },
            status: 400,
            statusText: 'Bad Request',
          },
          message: mockError.message,
        });
      }
    }
    
    // Re-throw original error if not handled
    throw error;
  });
};

// Override axios get method for verification status
api.get = async function(url: string, config?: any): Promise<any> {
  const isAuthEndpoint = url.includes('/auth/');
  
  // Handle verification status endpoint
  if (url.includes('/auth/verification/status')) {
    try {
      const mockResponse = await mockGetVerificationStatus();
      return Promise.resolve({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {},
      });
    } catch (error: any) {
      return Promise.reject({
        response: {
          data: { message: error.message },
          status: 400,
          statusText: 'Bad Request',
        },
        message: error.message,
      });
    }
  }
  
  // For other GET requests, try real API first
  return originalGet(url, config).catch(async (error: any) => {
    // If API fails and it's an auth endpoint, fallback to mock
    if (isAuthEndpoint && isNetworkError(error)) {
      console.log('[MOCK SERVER] API unreachable, using mock fallback for GET:', url, error.code || error.message);
      // Could add more GET endpoint handling here if needed
    }
    
    // Re-throw original error if not handled
    throw error;
  });
};

if (USE_MOCK_FIRST) {
  if (FORCE_MOCK_MODE) {
    console.log('[MOCK SERVER] ✅ Initialized - FORCE_MOCK_MODE enabled - Auth endpoints will use mock server first (production build)');
  } else {
    console.log('[MOCK SERVER] ✅ Initialized - Auth endpoints are being mocked (dev mode)');
  }
} else {
  console.log('[MOCK SERVER] Fallback mode - Will use mock if API is unreachable');
}

export default {
  mockLogin,
  mockRegister,
  mockForgotPassword,
  mockVerifyOTP,
  mockResetPassword,
  mockRefreshToken,
};

