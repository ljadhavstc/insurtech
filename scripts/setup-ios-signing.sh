#!/bin/bash

# Quick script to open Xcode for signing setup
# After running this, follow the instructions below

echo "📱 Opening Xcode for signing setup..."
echo ""
echo "Once Xcode opens:"
echo "1. Select the 'insurtech' project in the left sidebar"
echo "2. Select the 'insurtech' target"
echo "3. Go to 'Signing & Capabilities' tab"
echo "4. Check 'Automatically manage signing'"
echo "5. Select your Team (your Apple ID)"
echo "6. Xcode will automatically create provisioning profiles"
echo ""
echo "Press Enter to open Xcode..."
read

open ios/insurtech.xcworkspace

