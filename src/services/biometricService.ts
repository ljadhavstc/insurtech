/**
 * Biometric Service
 * 
 * Handles biometric authentication using react-native-keychain.
 * Supports Face ID, Touch ID, and fingerprint authentication on both iOS and Android.
 */

import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

export interface BiometricType {
  available: boolean;
  biometryType?: 'FaceID' | 'TouchID' | 'Fingerprint' | 'Biometric';
  error?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

const BIOMETRIC_KEY = 'biometric_enabled';
const CREDENTIALS_KEY = 'user_credentials';
const JWT_TOKEN_KEY = 'user_jwt_token';

/**
 * Check if biometric authentication is available on the device
 */
export const checkBiometricAvailability = async (): Promise<BiometricType> => {
  try {
    const biometryType = await Keychain.getSupportedBiometryType();
    
    if (!biometryType) {
      return {
        available: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    return {
      available: true,
      biometryType: biometryType as 'FaceID' | 'TouchID' | 'Fingerprint' | 'Biometric',
    };
  } catch (error: any) {
    return {
      available: false,
      error: error.message || 'Failed to check biometric availability',
    };
  }
};

/**
 * Check if biometric login is enabled for the user
 */
export const isBiometricEnabled = async (): Promise<boolean> => {
  try {
    const credentials = await Keychain.getInternetCredentials(BIOMETRIC_KEY);
    return credentials !== false;
  } catch (error) {
    return false;
  }
};

/**
 * Enable biometric login by storing JWT token securely
 * @param token - JWT token from successful login
 * @param refreshToken - Refresh token (optional)
 */
export const enableBiometric = async (
  token: string,
  refreshToken?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First check if biometric is available
    const biometricCheck = await checkBiometricAvailability();
    if (!biometricCheck.available) {
      return {
        success: false,
        error: biometricCheck.error || 'Biometric authentication is not available',
      };
    }

    // Store JWT token with biometric protection
    const tokenData = refreshToken ? `${token}::${refreshToken}` : token;
    const result = await Keychain.setInternetCredentials(
      JWT_TOKEN_KEY,
      'token',
      tokenData,
      {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }
    );

    if (result === false) {
      return {
        success: false,
        error: 'Failed to enable biometric login. Please try again.',
      };
    }

    // Store a flag that biometric is enabled
    await Keychain.setInternetCredentials(
      BIOMETRIC_KEY,
      'enabled',
      'true',
      {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }
    );

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to enable biometric login',
    };
  }
};

/**
 * Disable biometric login
 */
export const disableBiometric = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Remove stored JWT token and flag
    await Keychain.resetInternetCredentials({ server: JWT_TOKEN_KEY });
    await Keychain.resetInternetCredentials({ server: BIOMETRIC_KEY });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to disable biometric login',
    };
  }
};

/**
 * Authenticate using biometric and retrieve stored JWT token
 */
export const authenticateWithBiometric = async (): Promise<{
  success: boolean;
  token?: string;
  refreshToken?: string;
  error?: string;
}> => {
  try {
    // Check if biometric is enabled
    const isEnabled = await isBiometricEnabled();
    if (!isEnabled) {
      return {
        success: false,
        error: 'Biometric login is not enabled',
      };
    }

    // Retrieve JWT token with biometric authentication
    // The biometric prompt is automatically shown when token was stored with BIOMETRY_ANY
    const tokenData = await Keychain.getInternetCredentials(JWT_TOKEN_KEY);

    if (tokenData === false) {
      return {
        success: false,
        error: 'Failed to retrieve token',
      };
    }

    // Parse token data (format: "token::refreshToken" or just "token")
    const tokenParts = tokenData.password.split('::');
    const token = tokenParts[0];
    const refreshToken = tokenParts[1] || undefined;

    return {
      success: true,
      token,
      refreshToken,
    };
  } catch (error: any) {
    // Handle user cancellation
    if (error.message?.includes('cancel') || error.message?.includes('UserCancel')) {
      return {
        success: false,
        error: 'Biometric authentication was cancelled',
      };
    }

    return {
      success: false,
      error: error.message || 'Biometric authentication failed',
    };
  }
};

/**
 * Get the display name for the biometric type
 */
export const getBiometricName = (biometryType?: string): string => {
  if (!biometryType) return 'Biometric';
  
  switch (biometryType) {
    case 'FaceID':
      return 'Face ID';
    case 'TouchID':
      return 'Touch ID';
    case 'Fingerprint':
      return 'Fingerprint';
    default:
      return 'Biometric';
  }
};

/**
 * Update stored JWT token (e.g., after token refresh)
 */
export const updateBiometricToken = async (
  token: string,
  refreshToken?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const isEnabled = await isBiometricEnabled();
    if (!isEnabled) {
      return { success: false, error: 'Biometric login is not enabled' };
    }

    // Update token
    const tokenData = refreshToken ? `${token}::${refreshToken}` : token;
    const result = await Keychain.setInternetCredentials(
      JWT_TOKEN_KEY,
      'token',
      tokenData,
      {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }
    );

    if (result === false) {
      return {
        success: false,
        error: 'Failed to update biometric token',
      };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update biometric token',
    };
  }
};

