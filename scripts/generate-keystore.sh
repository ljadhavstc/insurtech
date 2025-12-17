#!/bin/bash

# Script to generate Android release keystore
# Usage: ./scripts/generate-keystore.sh

set -e

echo "🔐 Android Release Keystore Generator"
echo "======================================"
echo ""

# Check if keystore already exists
if [ -f "android/app/release.keystore" ]; then
    echo "⚠️  Release keystore already exists at android/app/release.keystore"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
    rm android/app/release.keystore
fi

# Prompt for keystore details
echo "Enter keystore details (press Enter for defaults):"
read -p "Keystore password: " STORE_PASSWORD
read -p "Key password (or same as keystore): " KEY_PASSWORD
read -p "Key alias [insurtech-key]: " KEY_ALIAS
read -p "Validity in days [10000]: " VALIDITY

# Set defaults
KEY_ALIAS=${KEY_ALIAS:-insurtech-key}
VALIDITY=${VALIDITY:-10000}
KEY_PASSWORD=${KEY_PASSWORD:-$STORE_PASSWORD}

if [ -z "$STORE_PASSWORD" ]; then
    echo "❌ Keystore password is required!"
    exit 1
fi

# Generate keystore
echo ""
echo "Generating keystore..."
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/release.keystore \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity "$VALIDITY" \
  -storepass "$STORE_PASSWORD" \
  -keypass "$KEY_PASSWORD" \
  -dname "CN=Insurtech, OU=Mobile, O=Insurtech, L=City, ST=State, C=US"

echo ""
echo "✅ Keystore generated successfully!"
echo ""
echo "📝 IMPORTANT: Save these credentials securely:"
echo "   Keystore file: android/app/release.keystore"
echo "   Keystore password: $STORE_PASSWORD"
echo "   Key alias: $KEY_ALIAS"
echo "   Key password: $KEY_PASSWORD"
echo ""
echo "Next steps:"
echo "1. Encode keystore for GitHub: base64 -i android/app/release.keystore | pbcopy"
echo "2. Add secrets to GitHub: Repository Settings > Secrets > Actions"
echo "3. Build APK via GitHub Actions: Actions tab > Build Android Release"
echo "4. Never commit the keystore file to version control!"

