# Registration & OTP Guide

This document explains what identifiers and methods are used for user registration and OTP delivery, along with best practices.

## Current Implementation

### Registration Identifier
**Currently using: Mobile Number**

- **Primary Identifier**: Mobile number (8-15 digits)
- **Storage**: User is stored with mobile number as key
- **Auto-generated Email**: `${mobileNumber}@mobile.user` (for compatibility)
- **Validation**: `/^[0-9]{8,15}$/` pattern

### OTP Delivery
**Currently using: SMS to Mobile Number**

- **Method**: SMS (Short Message Service)
- **OTP Format**: 4-digit code
- **Delivery**: Sent to the mobile number provided during registration
- **Test Number**: `12345678` uses fixed OTP `1234` for development

## Options for Registration & OTP

### 1. Mobile Number (Current Implementation) ✅

**Pros:**
- ✅ Universal - almost everyone has a mobile phone
- ✅ Fast verification via SMS
- ✅ Good for regions where mobile is primary communication
- ✅ Less prone to typos than email
- ✅ Can be used for 2FA later

**Cons:**
- ❌ SMS costs money (per message)
- ❌ SMS can be delayed or fail
- ❌ Users may change numbers
- ❌ International format complexity
- ❌ Privacy concerns (phone number sharing)

**Best For:**
- Mobile-first apps
- Regions with reliable SMS infrastructure
- Apps requiring phone verification
- Quick registration flows

### 2. Email Address

**Pros:**
- ✅ Free to send
- ✅ More reliable delivery
- ✅ Users already have email
- ✅ Better for password resets
- ✅ Professional communication channel
- ✅ Can include rich content in emails

**Cons:**
- ❌ Users may not check email immediately
- ❌ Email can go to spam
- ❌ Users may forget which email they used
- ❌ Email validation complexity
- ❌ Multiple email addresses per user

**Best For:**
- Web-first applications
- Professional/business apps
- Apps requiring email communication
- International audiences

### 3. Both Mobile Number + Email

**Pros:**
- ✅ Maximum flexibility
- ✅ Multiple verification options
- ✅ Better user experience (choose preferred method)
- ✅ Backup verification method
- ✅ More complete user profile

**Cons:**
- ❌ More complex implementation
- ❌ More fields to validate
- ❌ Higher development cost
- ❌ More user friction (more fields)

**Best For:**
- Enterprise applications
- Financial services
- Apps requiring strong verification
- Premium services

## Recommended Approach

### For Your App (Insurance/Mobile App)

**Recommended: Mobile Number (Current) ✅**

**Reasoning:**
1. **Mobile-first**: Your app is mobile-native
2. **Quick verification**: SMS is faster than email
3. **User expectation**: Mobile apps typically use phone numbers
4. **Regional fit**: Middle East region (STC Bahrain) - mobile is primary
5. **Simpler UX**: One field vs two fields

### Implementation Recommendations

#### 1. Mobile Number Format
```typescript
// Current: 8-15 digits
/^[0-9]{8,15}$/

// Recommended: Add country code support
// Option A: With country code prefix
/^\+?[1-9]\d{1,14}$/  // E.164 format

// Option B: Bahrain-specific
/^(\+973|00973|973)?[0-9]{8}$/  // Bahrain format
```

#### 2. OTP Delivery
```typescript
// Current: SMS only
// Recommended: SMS with email fallback option

// Primary: SMS
POST /auth/register/send-otp
{ mobileNumber: "33011234" }

// Optional: Email fallback
POST /auth/register/send-otp-email
{ email: "user@example.com" }
```

#### 3. User Storage
```typescript
// Current structure (good)
{
  mobileNumber: "33011234",  // Primary identifier
  email: "33011234@mobile.user",  // Auto-generated
  password: "hashed_password",
  id: "33011234"
}

// Recommended: Add optional email field
{
  mobileNumber: "33011234",  // Primary identifier (required)
  email?: "user@example.com",  // Optional, can be added later
  password: "hashed_password",
  id: "33011234"
}
```

## Alternative: Hybrid Approach

If you want to support both, here's a recommended flow:

### Option 1: Mobile Number Primary, Email Optional
```
Registration Flow:
1. Enter mobile number (required)
2. Enter email (optional)
3. Send OTP to mobile number
4. Verify OTP
5. Set password
```

### Option 2: User Chooses Method
```
Registration Flow:
1. Choose: Mobile or Email
2. Enter chosen identifier
3. Send OTP to chosen method
4. Verify OTP
5. Set password
```

### Option 3: Both Required
```
Registration Flow:
1. Enter mobile number
2. Enter email
3. Choose OTP delivery: SMS or Email
4. Send OTP to chosen method
5. Verify OTP
6. Set password
```

## Code Examples

### Current Implementation (Mobile Number Only)

```typescript
// Registration
const config: MobileNumberInputScreenConfig = {
  purpose: 'registration',
  screenTitle: 'account registration',
  title: 'enter your number',
  subtitle: 'enter your number to create account.',
  buttonText: 'continue',
  apiEndpoint: '/auth/register/send-otp',  // Sends SMS
};

// API Call
POST /auth/register/send-otp
Body: { mobileNumber: "33011234" }
Response: { success: true, message: "OTP sent to mobile" }
```

### Enhanced Implementation (Mobile + Optional Email)

```typescript
// Enhanced MobileNumberInputScreen
interface EnhancedConfig {
  purpose: 'registration';
  requireEmail?: boolean;  // false by default
  allowEmailOption?: boolean;  // true to show email option
}

// Two-step input
1. Mobile number (required)
2. Email (optional, if allowEmailOption is true)
3. Choose OTP delivery: SMS or Email
```

## Best Practices

### 1. Mobile Number
- ✅ Validate format before sending OTP
- ✅ Check for existing users
- ✅ Support international formats
- ✅ Store in E.164 format internally
- ✅ Display in user-friendly format

### 2. OTP Delivery
- ✅ Set expiration (10 minutes recommended)
- ✅ Limit resend attempts (60 seconds cooldown)
- ✅ Rate limiting (max 3 attempts per hour)
- ✅ Clear error messages
- ✅ Log OTP in development only

### 3. Security
- ✅ Never expose OTP in API responses (dev only)
- ✅ Hash OTP in database
- ✅ Implement cooldown periods
- ✅ Lock account after failed attempts
- ✅ Use secure token for verification

## Migration Path

If you want to add email support later:

1. **Phase 1**: Keep mobile number primary
2. **Phase 2**: Add optional email field
3. **Phase 3**: Allow email as OTP delivery option
4. **Phase 4**: Make email optional but recommended

## Conclusion

**For your insurance mobile app, mobile number is the right choice** because:
- ✅ Mobile-first application
- ✅ Quick verification
- ✅ Regional preference (Middle East)
- ✅ Simpler user experience
- ✅ Industry standard for mobile apps

**Consider adding email later** as:
- Optional field for communication
- Backup verification method
- Password reset alternative
- Marketing/notifications channel

## Testing

Use these test numbers for development:

```typescript
// Test mobile number with fixed OTP
mobileNumber: "12345678"
OTP: "1234"

// Regular test
mobileNumber: "33011234"
OTP: Random 4-digit (check console logs)
```

