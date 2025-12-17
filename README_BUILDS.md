# Building APK and IPA with GitHub Actions

This project uses GitHub Actions to build APK (Android) and IPA (iOS) files for internal distribution.

## 🚀 Quick Start

### Step 1: Generate Android Keystore (One-time)

```bash
./scripts/generate-keystore.sh
```

This will generate `android/app/release.keystore` and display the passwords.

### Step 2: Add Secrets to GitHub

Go to: **Repository Settings > Secrets and variables > Actions**

Add these secrets:

1. **ANDROID_KEYSTORE_BASE64**
   ```bash
   base64 -i android/app/release.keystore | pbcopy
   # Paste into GitHub secret
   ```

2. **ANDROID_KEYSTORE_PASSWORD** - Password from keystore generation

3. **ANDROID_KEY_PASSWORD** - Key password (usually same as keystore password)

### Step 3: Build APK/IPA

1. Go to **Actions** tab in GitHub
2. Select workflow:
   - **Build Android Release** - For APK
   - **Build iOS Release** - For IPA
3. Click **Run workflow**
4. Choose options and run
5. Download artifact when build completes

## 📋 Available Workflows

### 1. CI Pipeline (`ci.yml`)
**Triggers:** Automatic on push/PR

- Runs linting and tests
- Builds debug APK and iOS app
- No secrets required

### 2. Build Android Release (`build-android-release.yml`)
**Triggers:** Manual (workflow_dispatch)

**Options:**
- Build type: `release` or `debug`
- Upload to Play Store: `true` or `false` (future feature)

**Requires:** Android keystore secrets

**Output:** APK file in Artifacts

### 3. Build iOS Release (`build-ios-release.yml`)
**Triggers:** Manual (workflow_dispatch)

**Options:**
- Distribution method: `ad-hoc`, `app-store`, or `enterprise`

**Requires:** iOS certificate secrets

**Output:** IPA file in Artifacts

## 🔐 Required Secrets

### Android (Required for Release Builds)

| Secret Name | Description |
|------------|-------------|
| `ANDROID_KEYSTORE_BASE64` | Base64 encoded keystore file |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_PASSWORD` | Key password |

### iOS (Required for Release Builds)

| Secret Name | Description |
|------------|-------------|
| `IOS_TEAM_ID` | Apple Developer Team ID |
| `IOS_CERTIFICATE_BASE64` | Base64 encoded .p12 certificate |
| `IOS_CERTIFICATE_PASSWORD` | Certificate password |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64 encoded provisioning profile |
| `IOS_PROVISIONING_PROFILE_NAME` | Provisioning profile name |

## 📦 Downloading Artifacts

1. Go to **Actions** tab
2. Click on completed workflow run
3. Scroll to **Artifacts** section
4. Click artifact name to download
5. Extract ZIP file to get APK/IPA

## 🎯 Usage Examples

### Build Android Release APK

1. Actions > Build Android Release
2. Run workflow
3. Select `release` build type
4. Wait for completion
5. Download `android-release-apk` artifact

### Build iOS Ad Hoc IPA

1. Actions > Build iOS Release
2. Run workflow
3. Select `ad-hoc` distribution method
4. Wait for completion
5. Download `ios-ad-hoc-ipa` artifact

## 🔧 Troubleshooting

### Build Fails - "Secret not found"
- Verify secrets are added correctly
- Check secret names match exactly (case-sensitive)
- Ensure secrets are at repository level

### Android Build Fails - "Invalid keystore"
- Verify keystore base64 encoding is correct
- Check passwords match
- Regenerate keystore if needed

### iOS Build Fails - "Certificate expired"
- Check certificate expiration date
- Generate new certificate if expired
- Update secrets with new certificate

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Details](.github/workflows/README.md)

