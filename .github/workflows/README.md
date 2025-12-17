# GitHub Actions Workflows

This directory contains CI/CD workflows for building APK and IPA files.

## Workflows

### 1. CI Pipeline (`ci.yml`)
- **Triggers:** Automatic on push/PR
- **Purpose:** Lint, test, and verify builds work
- **No secrets required**

### 2. Build Android Release (`build-android-release.yml`)
- **Triggers:** Manual (workflow_dispatch)
- **Purpose:** Build release APK for internal distribution
- **Requires:** Android keystore secrets
- **Output:** APK artifact

### 3. Build iOS Release (`build-ios-release.yml`)
- **Triggers:** Manual (workflow_dispatch)
- **Purpose:** Build IPA for internal distribution
- **Requires:** iOS certificate secrets
- **Output:** IPA artifact

## Setup

1. Generate keystore: `./scripts/generate-keystore.sh`
2. Add secrets to GitHub (see [README_BUILDS.md](../README_BUILDS.md))
3. Run workflows from Actions tab

## Secrets Required

### Android
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`

### iOS
- `IOS_TEAM_ID`
- `IOS_CERTIFICATE_BASE64`
- `IOS_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`
- `IOS_PROVISIONING_PROFILE_NAME`

See [README_BUILDS.md](../README_BUILDS.md) for detailed setup instructions.

