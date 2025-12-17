#!/bin/bash

# Quick script to generate all secrets and display them
# Usage: ./scripts/generate-secrets-quick.sh

set -e

echo "🚀 Quick GitHub Secrets Generator"
echo "=================================="
echo ""

# Generate random passwords if keystore doesn't exist
KEYSTORE_PATH="android/app/release.keystore"

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "Generating keystore with random passwords..."
    
    # Generate random passwords
    STORE_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    KEY_PASSWORD=$STORE_PASSWORD
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
    
    echo "✅ Keystore generated!"
else
    echo "⚠️  Keystore already exists. Using existing keystore."
    echo "Please run: ./scripts/setup-github-secrets.sh"
    exit 1
fi

# Encode keystore
KEYSTORE_BASE64=$(base64 -i "$KEYSTORE_PATH")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 GITHUB SECRETS - Copy these to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔑 Secret Name: ANDROID_KEYSTORE_BASE64"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$KEYSTORE_BASE64"
echo ""
echo ""
echo "🔑 Secret Name: ANDROID_KEYSTORE_PASSWORD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$STORE_PASSWORD"
echo ""
echo ""
echo "🔑 Secret Name: ANDROID_KEY_PASSWORD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$KEY_PASSWORD"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 How to add secrets to GitHub:"
echo "   1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "   2. Click 'New repository secret'"
echo "   3. Paste each secret name and value above"
echo ""
echo "📦 After adding secrets, build APK via GitHub Actions:"
echo "   Actions tab > Build Android Release > Run workflow"
echo ""
echo "⚠️  Save these passwords securely - you'll need them for future builds!"
echo ""

