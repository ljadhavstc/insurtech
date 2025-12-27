# JUMIO Integration Implementation

## Overview
Complete JUMIO SDK integration with backend token authentication. The JUMIO verification screen appears automatically after the splash screen.

## Implementation Details

### 1. Files Created/Modified

#### Created Files:
- `src/services/jumioService.ts` - Complete JUMIO service with backend token integration
- `src/features/auth/screens/JumioVerificationScreen.tsx` - Screen that auto-starts JUMIO verification

#### Modified Files:
- `src/services/requests.tsx` - Added backend API functions:
  - `initiateJumioVerification()` - Gets JUMIO token from `/passport/verify`
  - `checkJumioVerificationStatus()` - Checks status via `/passport/verification-status`
- `src/features/splash/screens/SplashScreen.tsx` - Navigates to JUMIO screen after splash
- `src/navigation/RootNavigator.tsx` - Added JUMIO verification screen to navigation
- `src/i18n/locales/en.json` - Added translation keys for JUMIO screens

### 2. Features Implemented

#### Backend Token Integration
- Automatically fetches JUMIO SDK token from `/passport/verify` endpoint
- Uses token to initialize JUMIO SDK (no hardcoded credentials)
- Stores transaction details (transaction_id, account_id, workflow_id) for status checking

#### Document Scanning
- Automatic permission requests (camera + photo library)
- Supports multiple document types: Passport, Driver License, ID Card, Visa
- Handles user cancellation gracefully
- Error handling for permission denials and API failures

#### DL to CPR Mapping (Testing)
- Indian Driving License numbers are automatically mapped to CPR for testing
- Function: `mapDLNumberToCPR()` in `jumioService.ts`
- This is for testing only - can be removed/disabled in production

#### Verification Flow
1. Splash Screen → JUMIO Verification Screen (auto-starts)
2. Initializes SDK with backend token
3. Requests permissions
4. Opens JUMIO scanner
5. Processes document data
6. Extracts CPR/ID number (with DL mapping for testing)
7. Submits to backend `/customer/identity-verify`
8. Navigates to Verification Progress screen

### 3. API Integration

#### Backend Endpoints Used:
- `POST /passport/verify` - Get JUMIO token
  - Request: `{ msisdn?: string }`
  - Response: `{ token, api_secret, datacenter, transaction_id, account_id, workflow_id }`

- `POST /passport/verification-status` - Check verification status
  - Request: `{ transaction_id, msisdn, account_id, workflow_id }`
  - Response: `{ status, cpr, first_name, last_name, date_of_birth }`

- `POST /customer/identity-verify` - Submit verification data
  - Request: `{ mobile_number, cpr, first_name, last_name, gender, date_of_birth, cpr_expiry_date, nationality }`

### 4. Testing Notes

#### Indian DL Testing:
- When scanning an Indian Driving License, the DL number is treated as CPR
- This allows testing without actual CPR documents
- The mapping happens in `jumioService.extractCPR()`

#### Permission Testing:
- First launch will request camera permission
- Photo library permission may be requested when selecting from gallery
- If permissions are denied, user is prompted to open Settings

### 5. Error Handling

- **User Cancellation**: Shows info message and navigates back
- **Permission Denied**: Shows error with option to open Settings
- **API Failures**: Shows error toast with message
- **Missing Data**: Validates extracted data before proceeding

### 6. Navigation Flow

```
Splash Screen (2 seconds)
    ↓
JUMIO Verification Screen (auto-starts)
    ↓
[User scans document]
    ↓
Processing...
    ↓
Verification Progress Screen
    ↓
[If authenticated] → App
[If not authenticated] → Onboarding/Auth
```

### 7. Configuration

#### Environment Variables (Optional):
If you want to configure JUMIO directly (not using backend):
- `JUMIO_API_TOKEN`
- `JUMIO_API_SECRET`
- `JUMIO_DATACENTER`

**Note**: Current implementation uses backend token, so these are not needed.

### 8. Next Steps

1. **Test the Flow**:
   - Run the app: `npm run ios` or `npm run android`
   - Splash screen should show for 2 seconds
   - JUMIO verification should start automatically
   - Scan a test document (Indian DL for testing)

2. **Backend Integration**:
   - Ensure `/passport/verify` endpoint returns:
     - `token` or `api_token`
     - `api_secret`
     - `datacenter` (US, EU, or SG)
     - `transaction_id`, `account_id`, `workflow_id` (optional but recommended)

3. **Production Considerations**:
   - Remove or disable DL-to-CPR mapping
   - Add proper error logging
   - Configure JUMIO SDK customization (colors, branding)
   - Test with real CPR documents

### 9. Troubleshooting

#### JUMIO SDK Not Found:
- Ensure `react-native-jumio-mobilesdk` is installed: `npm install`
- For iOS: Run `cd ios && pod install`
- Rebuild the app

#### Permission Issues:
- Check `Info.plist` has camera/photo library permissions
- Check `AndroidManifest.xml` has required permissions
- Test on real device (simulator may not fully support permissions)

#### Backend API Errors:
- Verify backend endpoint URLs are correct
- Check network connectivity
- Ensure backend returns expected response format

### 10. Code Structure

```
src/
├── services/
│   ├── jumioService.ts          # Main JUMIO service
│   ├── permissionService.tsx    # Permission handling
│   └── requests.tsx             # Backend API calls
├── features/
│   └── auth/
│       └── screens/
│           └── JumioVerificationScreen.tsx  # Verification screen
└── navigation/
    └── RootNavigator.tsx        # Navigation setup
```

## Summary

The JUMIO integration is complete and ready for testing. The verification screen will appear automatically after the splash screen, request permissions, initialize with your backend token, and guide users through document scanning.

