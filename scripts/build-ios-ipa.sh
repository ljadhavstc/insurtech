#!/bin/bash

# Build iOS IPA locally on macOS
# This script builds a shareable IPA without App Store credentials
# Uses ad-hoc distribution with automatic signing (free Apple Developer account)

set -e

echo "📱 Building iOS IPA for local distribution..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ Error: This script must be run on macOS${NC}"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}❌ Error: Xcode is not installed${NC}"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

echo -e "${GREEN}✅ Installing dependencies...${NC}"
npm ci

echo -e "${GREEN}✅ Installing CocoaPods dependencies...${NC}"
cd ios
pod install
cd ..

echo -e "${GREEN}✅ Bundling JavaScript...${NC}"
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios/ \
  --sourcemap-output ios/main.jsbundle.map \
  --minify true

if [ ! -f "ios/main.jsbundle" ]; then
    echo -e "${RED}❌ Error: JS bundle not created!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ JS bundle created successfully${NC}"

# Build archive
echo -e "${GREEN}✅ Building archive...${NC}"
cd ios

# Check if automatic signing is configured
echo -e "${YELLOW}📝 Checking code signing configuration...${NC}"

# Try to build with automatic signing first (recommended)
echo -e "${GREEN}✅ Attempting automatic signing...${NC}"
echo -e "${YELLOW}⚠️  If this fails, you'll need to configure signing in Xcode:${NC}"
echo -e "${YELLOW}   1. Open: open ios/insurtech.xcworkspace${NC}"
echo -e "${YELLOW}   2. Select project > target > Signing & Capabilities${NC}"
echo -e "${YELLOW}   3. Check 'Automatically manage signing'${NC}"
echo -e "${YELLOW}   4. Select your Team (Apple ID)${NC}"
echo ""

# Build with automatic signing
xcodebuild -workspace insurtech.xcworkspace \
  -scheme insurtech \
  -configuration Release \
  -archivePath build/insurtech.xcarchive \
  archive \
  -allowProvisioningUpdates \
  CODE_SIGN_STYLE="Automatic" \
  2>&1 | tee build.log

BUILD_RESULT=${PIPESTATUS[0]}

if [ $BUILD_RESULT -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Build failed. Checking error...${NC}"
    
    if grep -q "requires a development team" build.log; then
        echo ""
        echo -e "${YELLOW}⚠️  Signing not configured. Please set up automatic signing:${NC}"
        echo ""
        echo -e "${GREEN}Option 1: Use the setup script${NC}"
        echo "  ./scripts/setup-ios-signing.sh"
        echo ""
        echo -e "${GREEN}Option 2: Manual setup in Xcode${NC}"
        echo "  1. Run: open ios/insurtech.xcworkspace"
        echo "  2. In Xcode:"
        echo "     - Click 'insurtech' project (left sidebar)"
        echo "     - Select 'insurtech' target"
        echo "     - Go to 'Signing & Capabilities' tab"
        echo "     - Check 'Automatically manage signing'"
        echo "     - Select your Team (add Apple ID if needed)"
        echo "  3. Run this script again"
        echo ""
        echo -e "${GREEN}Option 3: Add Apple ID to Xcode first${NC}"
        echo "  1. Open Xcode"
        echo "  2. Xcode > Settings (or Preferences) > Accounts"
        echo "  3. Click '+' and add your Apple ID"
        echo "  4. Then run this script again"
        echo ""
        
        # Offer to open Xcode
        read -p "Open Xcode now to configure signing? (y/n): " OPEN_XCODE
        if [ "$OPEN_XCODE" == "y" ] || [ "$OPEN_XCODE" == "Y" ]; then
            open ios/insurtech.xcworkspace
            echo ""
            echo -e "${GREEN}✅ Xcode opened. Configure signing and run this script again.${NC}"
        fi
        
        exit 1
    else
        echo -e "${RED}❌ Build error (not signing related). Check build.log for details.${NC}"
        exit 1
    fi
fi

if [ ! -d "build/insurtech.xcarchive" ]; then
    echo -e "${RED}❌ Error: Archive not created!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archive created successfully${NC}"

# Export IPA
echo -e "${GREEN}✅ Exporting IPA...${NC}"

# Create ExportOptions.plist for ad-hoc distribution
cat > build/ExportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>compileBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

xcodebuild -exportArchive \
  -archivePath build/insurtech.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist build/ExportOptions.plist \
  -allowProvisioningUpdates

# Find the IPA file
IPA_PATH=$(find build/ipa -name "*.ipa" -type f | head -n 1)

if [ -z "$IPA_PATH" ]; then
    echo -e "${RED}❌ Error: IPA file not found!${NC}"
    exit 1
fi

IPA_SIZE=$(du -h "$IPA_PATH" | cut -f1)
IPA_NAME=$(basename "$IPA_PATH")

echo ""
echo -e "${GREEN}✅ IPA created successfully!${NC}"
echo -e "${GREEN}📦 IPA Path: $IPA_PATH${NC}"
echo -e "${GREEN}📦 IPA Size: $IPA_SIZE${NC}"
echo ""
echo -e "${YELLOW}📱 Installation Instructions:${NC}"
echo "1. Transfer the IPA to your iOS device"
echo "2. Install using one of these methods:"
echo "   - AirDrop the IPA file to your device and open it"
echo "   - Use Apple Configurator 2 (free from Mac App Store)"
echo "   - Use Xcode: Window > Devices and Simulators > drag IPA to device"
echo "   - Use 3uTools or similar tools"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "- Ad-hoc IPAs can only be installed on devices registered in your provisioning profile"
echo "- For automatic signing, devices are automatically registered when you build"
echo "- The IPA includes the mock server and will work offline"
echo ""

cd ..

