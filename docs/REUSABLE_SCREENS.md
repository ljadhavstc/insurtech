# Reusable Authentication Screens

This document explains the reusable and highly customizable authentication screens that can be used across different flows (registration, password reset, verification, etc.).

## Overview

The app now uses three main reusable screens that can be configured for different purposes:

1. **MobileNumberInputScreen** - Mobile number input with OTP sending
2. **OTPVerificationScreen** - OTP verification (already existed, enhanced for registration)
3. **PasswordSetupScreen** - Password creation/update with validation

## Screen Components

### 1. MobileNumberInputScreen

**Location:** `src/features/auth/screens/MobileNumberInputScreen.tsx`

**Purpose:** Reusable screen for mobile number input that can be customized for:
- Password reset
- Registration
- Account verification

**Configuration Options:**

```typescript
interface MobileNumberInputScreenConfig {
  purpose: 'password-reset' | 'registration' | 'verification';
  screenTitle?: string;           // Header title
  title?: string;                  // Main title
  subtitle?: string;               // Description text
  buttonText?: string;             // Primary button text
  secondaryButtonText?: string;    // Optional secondary button
  onSecondaryButtonPress?: () => void;
  apiEndpoint?: string;            // Custom API endpoint
  validationRules?: {              // Custom validation
    required?: string;
    pattern?: { value: RegExp; message: string };
  };
  onSuccess?: (mobileNumber: string, response: any) => void; // Custom success handler
  nextScreen?: string;              // Next screen name
  nextScreenParams?: Record<string, any>; // Params for next screen
}
```

**Usage Example:**

```typescript
// In navigation
navigation.navigate('MobileNumberInput', {
  config: {
    purpose: 'registration',
    screenTitle: 'account registration',
    title: 'enter your number',
    subtitle: 'enter your number to create account.',
    buttonText: 'continue',
  }
});
```

**Default Behavior:**
- **password-reset**: Uses `/auth/forgot-password`, navigates to `OTPVerification`
- **registration**: Uses `/auth/register/send-otp`, navigates to `OTPVerification` with `purpose: 'registration'`
- **verification**: Uses `/auth/verify/send-otp`, navigates to `OTPVerification`

### 2. OTPVerificationScreen

**Location:** `src/features/auth/screens/OTPVerificationScreen.tsx`

**Purpose:** OTP verification screen that handles:
- Password reset flow
- Registration flow
- General verification

**Navigation Params:**

```typescript
{
  mobileNumber?: string;
  email?: string;
  purpose?: 'password-reset' | 'verification' | 'registration';
}
```

**Flow Behavior:**
- **password-reset**: After verification → `ResetPassword` screen
- **registration**: After verification → `PasswordSetup` screen with registration config
- **verification**: After verification → `Login` or custom screen

**API Endpoints:**
- Resend OTP: Uses `/auth/forgot-password` for password-reset, `/auth/register/send-otp` for registration
- Verify OTP: Uses `/auth/otp-verify` with `purpose` parameter

### 3. PasswordSetupScreen

**Location:** `src/features/auth/screens/PasswordSetupScreen.tsx`

**Purpose:** Reusable password setup screen for:
- Password reset
- Registration (password creation)
- Password change

**Configuration Options:**

```typescript
interface PasswordSetupScreenConfig {
  purpose: 'password-reset' | 'registration' | 'password-change';
  screenTitle?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  mobileNumber?: string;           // For validation warnings
  email?: string;
  resetToken?: string;             // Required for password-reset
  apiEndpoint?: string;
  onSuccess?: (password: string, response: any) => void;
  nextScreen?: string;
  nextScreenParams?: Record<string, any>;
  showMobileWarning?: boolean;     // Default: true
  showValidationRules?: boolean;   // Default: true
}
```

**Usage Example:**

```typescript
// In navigation
navigation.navigate('PasswordSetup', {
  config: {
    purpose: 'registration',
    mobileNumber: '33011234',
    resetToken: verificationToken,
  }
});
```

**Default Behavior:**
- **password-reset**: Uses `/auth/reset-password`, navigates to `Success`
- **registration**: Uses `/auth/register/complete`, auto-logs in user, navigates to `Success`
- **password-change**: Uses `/auth/change-password`, navigates to `Success`

## Registration Flow

The registration flow now uses all three reusable screens:

```
Register Button Click
  ↓
RegisterScreen (immediately navigates)
  ↓
MobileNumberInputScreen (purpose: 'registration')
  ↓
OTPVerificationScreen (purpose: 'registration')
  ↓
PasswordSetupScreen (purpose: 'registration')
  ↓
SuccessScreen
```

### Implementation

1. **RegisterScreen** (`src/features/auth/screens/RegisterScreen.tsx`)
   - Entry point that immediately navigates to `MobileNumberInput` with registration config

2. **MobileNumberInputScreen** with `purpose: 'registration'`
   - Sends OTP via `/auth/register/send-otp`
   - Navigates to `OTPVerification` with `purpose: 'registration'`

3. **OTPVerificationScreen** with `purpose: 'registration'`
   - Verifies OTP via `/auth/otp-verify` with `purpose: 'registration'`
   - Navigates to `PasswordSetup` with registration config

4. **PasswordSetupScreen** with `purpose: 'registration'`
   - Completes registration via `/auth/register/complete`
   - Auto-logs in the user
   - Navigates to `Success` screen

## API Endpoints

### Registration Flow

1. **Send OTP for Registration**
   ```
   POST /auth/register/send-otp
   Body: { mobileNumber: string }
   Response: { success: true, message: string, otp?: string }
   ```

2. **Verify OTP for Registration**
   ```
   POST /auth/otp-verify
   Body: { mobileNumber: string, otp: string, purpose: 'registration' }
   Response: { success: true, resetToken: string, verificationToken: string }
   ```

3. **Complete Registration**
   ```
   POST /auth/register/complete
   Body: { mobileNumber: string, password: string, resetToken?: string }
   Response: { success: true, user: User, token: string, refreshToken: string }
   ```

## Customization Examples

### Custom Mobile Number Input

```typescript
const config: MobileNumberInputScreenConfig = {
  purpose: 'verification',
  screenTitle: 'Verify Your Account',
  title: 'Enter Mobile Number',
  subtitle: 'We need to verify your mobile number',
  buttonText: 'Send Verification Code',
  validationRules: {
    required: 'Mobile number is required',
    pattern: {
      value: /^[0-9]{10}$/,
      message: 'Please enter a 10-digit mobile number',
    },
  },
  onSuccess: (mobileNumber, response) => {
    // Custom handling
    console.log('OTP sent to:', mobileNumber);
  },
};
```

### Custom Password Setup

```typescript
const config: PasswordSetupScreenConfig = {
  purpose: 'password-change',
  screenTitle: 'Change Password',
  title: 'Enter New Password',
  subtitle: 'Choose a strong password',
  buttonText: 'Save Password',
  showMobileWarning: false, // Don't show mobile warning for password change
  onSuccess: (password, response) => {
    // Custom handling
    console.log('Password changed successfully');
  },
};
```

## Benefits

1. **Code Reusability**: Same screens used for multiple flows
2. **Consistency**: Uniform UI/UX across all authentication flows
3. **Maintainability**: Single source of truth for each screen type
4. **Customization**: Highly configurable without code duplication
5. **Type Safety**: Full TypeScript support with proper types

## Migration Notes

- **ForgotPasswordScreen**: Still exists and works as before, but can be migrated to use `MobileNumberInputScreen` if desired
- **ResetPasswordScreen**: Still exists and works as before, but can be migrated to use `PasswordSetupScreen` if desired
- **RegisterScreen**: Now uses the new reusable flow instead of the old single-screen form

## Testing

All screens support test IDs:
- `mobile-number-input`
- `submit-button`
- `secondary-button`
- `otp-input`
- `verify-otp-button`
- `password-setup-new-input`
- `password-setup-confirm-input`
- `password-setup-button`

Use these for E2E testing and component testing.

