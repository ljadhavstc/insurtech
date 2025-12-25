/**
 * Reactotron Configuration
 * 
 * Development tool for inspecting React Native apps.
 * Only active in development mode.
 * 
 * Features:
 * - Network request/response logging
 * - AsyncStorage inspection
 * - State management (Zustand) tracking
 * - Custom commands
 */

import Reactotron from 'reactotron-react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Only configure Reactotron in development
if (__DEV__) {
  // Determine host based on platform
  // Android emulator uses 10.0.2.2 to access localhost
  // iOS simulator uses localhost
  // For physical devices, you'll need to use your computer's IP address
  const getHost = () => {
    if (Platform.OS === 'android') {
      // For Android emulator
      return '10.0.2.2';
    }
    // For iOS simulator or if you want to use IP for physical devices
    return 'localhost';
  };

  const reactotron = Reactotron
    .configure({
      name: 'InsurTech App',
      host: getHost(),
    })
    .setAsyncStorageHandler(AsyncStorage) // AsyncStorage integration
    .useReactNative({
      // AsyncStorage: true, // Already set above
      networking: {
        // Network request/response logging
        ignoreUrls: /symbolicate|127.0.0.1/,
      },
      editor: false, // Disable editor integration
      errors: { veto: (stackFrame) => false }, // Show all errors
      overlay: false, // Disable overlay
    })
    .connect();

  // Clear Reactotron on app start
  reactotron.clear?.();

  // Add custom commands
  reactotron.onCustomCommand({
    command: 'clearAsyncStorage',
    handler: () => {
      AsyncStorage.clear();
      reactotron.log('AsyncStorage cleared');
    },
    title: 'Clear AsyncStorage',
    description: 'Clears all AsyncStorage data',
  });

  // Log initial app state
  reactotron.log('Reactotron configured successfully');

  // Export for use in other files
  (global as any).reactotron = reactotron;
}

// Export a no-op for production or if not in dev mode
const noop = {
  log: () => {},
  warn: () => {},
  error: () => {},
  display: () => {},
  image: () => {},
  clear: () => {},
};

// Export Reactotron instance if available, otherwise no-op
export default (__DEV__ && (global as any).reactotron) ? (global as any).reactotron : noop;

