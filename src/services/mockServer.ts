/**
 * Mock Server
 * 
 * Simple mock server to simulate API endpoints for development.
 * Provides realistic responses with latency simulation.
 * 
 * In production, replace these with actual API calls.
 */

import api from './api';

// Mock data storage
const mockUsers: Record<string, { email: string; phoneNumber?: string; password: string; otp?: string }> = {
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
};

const mockTokens: Record<string, { token: string; refreshToken: string }> = {};

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
 * Mock register endpoint
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
 * Mock forgot password endpoint - sends OTP
 */
export const mockForgotPassword = async (email: string) => {
  await delay(800);

  if (!mockUsers[email]) {
    // Don't reveal if user exists (security best practice)
    return {
      success: true,
      message: 'If an account exists, an OTP has been sent to your email.',
    };
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  mockUsers[email].otp = otp;

  // In real app, send OTP via email/SMS
  console.log(`[MOCK] OTP for ${email}: ${otp}`);

  return {
    success: true,
    message: 'OTP sent to your email',
    otp, // Only for development - remove in production
  };
};

/**
 * Mock OTP verification endpoint
 */
export const mockVerifyOTP = async (email: string, otp: string) => {
  await delay(600);

  const user = mockUsers[email];
  if (!user || user.otp !== otp) {
    throw new Error('Invalid or expired OTP');
  }

  // Clear OTP after verification
  delete user.otp;

  return {
    success: true,
    message: 'OTP verified successfully',
    resetToken: `reset_token_${email}_${Date.now()}`,
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
  delete user.otp;

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

// Override axios methods for development
if (__DEV__) {
  // Intercept API calls and route to mock functions
  const originalPost = api.post;
  
  api.post = async (url: string, data?: any): Promise<any> => {
    if (url.includes('/auth/login')) {
      // Support both email and phoneNumber login
      const identifier = data.phoneNumber || data.email;
      return { data: await mockLogin(identifier, data.password) };
    }
    if (url.includes('/auth/register')) {
      return { data: await mockRegister(data.email, data.password, data.name) };
    }
    if (url.includes('/auth/forgot-password')) {
      return { data: await mockForgotPassword(data.email) };
    }
    if (url.includes('/auth/otp-verify')) {
      return { data: await mockVerifyOTP(data.email, data.otp) };
    }
    if (url.includes('/auth/reset-password')) {
      return { data: await mockResetPassword(data.email, data.resetToken, data.newPassword) };
    }
    if (url.includes('/auth/refresh')) {
      return { data: await mockRefreshToken(data.refreshToken) };
    }
    
    return originalPost(url, data);
  };
}

export default {
  mockLogin,
  mockRegister,
  mockForgotPassword,
  mockVerifyOTP,
  mockResetPassword,
  mockRefreshToken,
};

