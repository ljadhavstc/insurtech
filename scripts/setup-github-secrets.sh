#!/bin/bash

# Script to generate and encode secrets for GitHub Actions
# Usage: ./scripts/setup-github-secrets.sh

set -e

echo "🔐 GitHub Secrets Generator"
echo "=========================="
echo ""
echo "This script will help you generate secrets for GitHub Actions."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if keystore exists
KEYSTORE_PATH="android/app/release.keystore"
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "📦 Generating Android release keystore..."
    echo ""
    read -p "Enter keystore password: " STORE_PASSWORD
    read -p "Enter key password (or press Enter to use same as keystore): " KEY_PASSWORD
    
    KEY_PASSWORD=${KEY_PASSWORD:-$STORE_PASSWORD}
    KEY_ALIAS="insurtech-key"
    
    keytool -genkeypair -v -storetype PKCS12 \
      -keystore "$KEYSTORE_PATH" \
      -alias "$KEY_ALIAS" \
      -keyalg RSA \
      -keysize 2048 \
      -validity 10000 \
      -storepass "$STORE_PASSWORD" \
      -keypass "$KEY_PASSWORD" \
      -dname "CN=Insurtech, OU=Mobile, O=Insurtech, L=City, ST=State, C=US"
    
    echo ""
    echo "✅ Keystore generated successfully!"
else
    echo "✅ Keystore already exists at $KEYSTORE_PATH"
    read -p "Enter keystore password: " STORE_PASSWORD
    read -p "Enter key password: " KEY_PASSWORD
    KEY_ALIAS="insurtech-key"
fi

echo ""
echo "📋 Generating GitHub Secrets..."
echo ""

# Generate keystore base64
echo "1️⃣  ANDROID_KEYSTORE_BASE64"
echo "─────────────────────────────────────────────────────────"
KEYSTORE_BASE64=$(base64 -i "$KEYSTORE_PATH")
echo "$KEYSTORE_BASE64"
echo ""
echo "📋 Copy the above value and add it to GitHub Secrets as: ANDROID_KEYSTORE_BASE64"
echo ""

# Store passwords
echo "2️⃣  ANDROID_KEYSTORE_PASSWORD"
echo "─────────────────────────────────────────────────────────"
echo "$STORE_PASSWORD"
echo ""
echo "📋 Copy the above value and add it to GitHub Secrets as: ANDROID_KEYSTORE_PASSWORD"
echo ""

echo "3️⃣  ANDROID_KEY_PASSWORD"
echo "─────────────────────────────────────────────────────────"
echo "$KEY_PASSWORD"
echo ""
echo "📋 Copy the above value and add it to GitHub Secrets as: ANDROID_KEY_PASSWORD"
echo ""

# Save to file (for reference, but warn about security)
SECRETS_FILE=".github-secrets-reference.txt"
cat > "$SECRETS_FILE" << EOF
# GitHub Secrets Reference
# ⚠️  WARNING: This file contains sensitive information!
# ⚠️  DO NOT commit this file to git!
# ⚠️  Delete this file after copying secrets to GitHub

## Android Secrets

ANDROID_KEYSTORE_BASE64:
$KEYSTORE_BASE64

ANDROID_KEYSTORE_PASSWORD:
$STORE_PASSWORD

ANDROID_KEY_PASSWORD:
$KEY_PASSWORD

## iOS Secrets (Fill these manually)

IOS_TEAM_ID:
[Your Apple Developer Team ID - Find at developer.apple.com]

IOS_CERTIFICATE_BASE64:
[Export certificate from Keychain Access as .p12, then: base64 -i certificate.p12 | pbcopy]

IOS_CERTIFICATE_PASSWORD:
[Password you set when exporting .p12 certificate]

IOS_PROVISIONING_PROFILE_BASE64:
[Download from developer.apple.com, then: base64 -i profile.mobileprovision | pbcopy]

IOS_PROVISIONING_PROFILE_NAME:
[Name of your provisioning profile]

IOS_CODE_SIGN_IDENTITY:
[Optional - Default: iPhone Developer]

IOS_KEYCHAIN_PASSWORD:
[Optional - Default: github-actions]

---
Generated: $(date)
EOF

echo "💾 Secrets reference saved to: $SECRETS_FILE"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - This file contains sensitive information"
echo "   - DO NOT commit it to git (already in .gitignore)"
echo "   - Delete it after copying secrets to GitHub"
echo ""

# Add to .gitignore if not already there
if ! grep -q ".github-secrets-reference.txt" .gitignore 2>/dev/null; then
    echo ".github-secrets-reference.txt" >> .gitignore
    echo "✅ Added to .gitignore"
fi

echo ""
echo "📝 Next Steps:"
echo "   1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "   2. Click 'New repository secret' for each secret above"
echo "   3. Copy and paste the values"
echo "   4. Delete $SECRETS_FILE after setup"
echo "   5. Build APK via GitHub Actions: Actions tab > Build Android Release"
echo ""
echo "✅ Done! Your secrets are ready to add to GitHub."

