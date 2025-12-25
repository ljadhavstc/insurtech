# Reactotron Setup Guide

Reactotron is configured for both Android and iOS. This guide will help you get started.

## Prerequisites

1. **Download Reactotron Desktop App**
   - Download from: https://github.com/infinitered/reactotron/releases
   - Install the desktop application
   - Open Reactotron before running your app

## Configuration

### Android

- **Emulator**: Automatically configured to use `10.0.2.2` (maps to localhost)
- **Physical Device**: You'll need to use your computer's IP address
  - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Update `src/config/ReactotronConfig.ts` with your IP address

### iOS

- **Simulator**: Automatically configured to use `localhost`
- **Physical Device**: You'll need to use your computer's IP address
  - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Update `src/config/ReactotronConfig.ts` with your IP address

## Usage

1. **Start Reactotron Desktop App**
   - Open the Reactotron application on your computer

2. **Run Your App**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

3. **Connect**
   - Reactotron should automatically connect when the app starts
   - You'll see "InsurTech App" appear in the Reactotron sidebar

## Features Enabled

- ✅ **Network Logging**: All API requests/responses are logged
- ✅ **AsyncStorage Inspection**: View and manage AsyncStorage data
- ✅ **Custom Commands**: 
  - `clearAsyncStorage` - Clears all AsyncStorage data
- ✅ **Error Logging**: All errors are captured and displayed

## Custom Commands

Reactotron includes a custom command to clear AsyncStorage:

1. Open Reactotron
2. Go to "Custom Commands" tab
3. Click "Clear AsyncStorage"
4. All AsyncStorage data will be cleared

## Troubleshooting

### Android Emulator Not Connecting

1. Make sure Reactotron desktop app is running
2. Check that you're using `10.0.2.2` for Android emulator
3. Verify your Android emulator has internet access
4. Try restarting both the app and Reactotron

### iOS Simulator Not Connecting

1. Make sure Reactotron desktop app is running
2. Check that you're using `localhost` for iOS simulator
3. Verify your Mac's firewall isn't blocking the connection
4. Try restarting both the app and Reactotron

### Physical Device Not Connecting

1. Make sure your device and computer are on the same WiFi network
2. Find your computer's IP address:
   - Mac/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig` (look for IPv4 Address)
3. Update `src/config/ReactotronConfig.ts`:
   ```typescript
   const getHost = () => {
     if (Platform.OS === 'android') {
       return '10.0.2.2'; // Keep for emulator
       // return 'YOUR_COMPUTER_IP'; // Use for physical device
     }
     return 'localhost'; // Keep for simulator
     // return 'YOUR_COMPUTER_IP'; // Use for physical device
   };
   ```
4. Rebuild the app after changing the IP

## Network Request Logging

All API requests and responses are automatically logged to Reactotron. You can:
- View request method, URL, headers, and body
- View response status, headers, and data
- View error responses with full details

## Development Only

Reactotron is **only active in development mode** (`__DEV__ === true`). It's automatically disabled in production builds, so there's no performance impact on release builds.

