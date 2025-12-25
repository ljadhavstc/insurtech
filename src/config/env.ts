/**
 * Environment Configuration
 * 
 * Reads configuration from .env file using react-native-config
 * Falls back to defaults if not configured
 */

import Config from 'react-native-config';

// Mock Server Configuration
// Defaults to false (use live APIs)
export const ENABLE_MOCK_SERVER = Config.ENABLE_MOCK_SERVER === 'true' || false;

// Force Mock Mode (only applies when ENABLE_MOCK_SERVER is true)
// When true: Use mock server immediately, skipping real API attempts
// When false: Try real API first, then fallback to mock if unreachable
export const FORCE_MOCK_MODE = Config.FORCE_MOCK_MODE === 'true' || false;

// Determine if mock should be used first
// Only true if both ENABLE_MOCK_SERVER and FORCE_MOCK_MODE are true
export const USE_MOCK_FIRST = ENABLE_MOCK_SERVER && FORCE_MOCK_MODE;

// Determine if mock should be available as fallback
// True if ENABLE_MOCK_SERVER is true (regardless of FORCE_MOCK_MODE)
export const USE_MOCK_FALLBACK = ENABLE_MOCK_SERVER;

