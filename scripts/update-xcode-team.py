#!/usr/bin/env python3
"""
Update Xcode project with DEVELOPMENT_TEAM and CODE_SIGN_STYLE settings.
This script is used by GitHub Actions workflow.
"""
import re
import os
import sys

team_id = os.environ.get('IOS_TEAM_ID', '')
project_file = 'insurtech.xcodeproj/project.pbxproj'
action = sys.argv[1] if len(sys.argv) > 1 else 'team'

if not os.path.exists(project_file):
    print(f"⚠️  Project file not found: {project_file}")
    sys.exit(1)

with open(project_file, 'r') as f:
    content = f.read()

if action == 'team':
    # Check if DEVELOPMENT_TEAM already exists in the Release target config
    release_pattern = r'13B07F951A680F5B00A75B9A /\* Release \*/ = \{[^}]*buildSettings = \{([^}]*)\}'
    release_match = re.search(release_pattern, content, re.DOTALL)
    
    if release_match and 'DEVELOPMENT_TEAM' in release_match.group(1):
        # Update existing DEVELOPMENT_TEAM
        content = re.sub(
            r'DEVELOPMENT_TEAM = [^;]*;',
            f'DEVELOPMENT_TEAM = {team_id};',
            content
        )
        print("✅ Updated DEVELOPMENT_TEAM in Release target configuration")
    else:
        # Add DEVELOPMENT_TEAM after IPHONEOS_DEPLOYMENT_TARGET in Release target config
        pattern = r'(13B07F951A680F5B00A75B9A /\* Release \*/ = \{[^}]*buildSettings = \{)([^}]*IPHONEOS_DEPLOYMENT_TARGET = 15\.1;)([^}]*)(\})'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            build_settings = match.group(3)
            if 'DEVELOPMENT_TEAM' not in build_settings:
                new_line = f'\t\t\t\tDEVELOPMENT_TEAM = {team_id};\n'
                content = content[:match.end(2)] + new_line + build_settings + content[match.end(3):]
                print("✅ Added DEVELOPMENT_TEAM to Release target configuration")
            else:
                print("✅ DEVELOPMENT_TEAM already exists")
        else:
            print("⚠️  Could not find Release target configuration")
            sys.exit(1)

elif action == 'code_sign':
    # Add CODE_SIGN_STYLE = Manual for Release target if not present
    escaped_team_id = re.escape(team_id)
    pattern = r'(13B07F951A680F5B00A75B9A /\* Release \*/ = \{[^}]*buildSettings = \{)([^}]*DEVELOPMENT_TEAM = ' + escaped_team_id + r';)([^}]*)(\})'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        build_settings = match.group(3)
        if 'CODE_SIGN_STYLE' not in build_settings:
            new_line = '\t\t\t\tCODE_SIGN_STYLE = Manual;\n'
            content = content[:match.end(2)] + new_line + build_settings + content[match.end(3):]
            print("✅ Added CODE_SIGN_STYLE = Manual to Release target configuration")
        else:
            print("✅ CODE_SIGN_STYLE already exists")
    else:
        print("⚠️  Could not find Release target configuration")
        sys.exit(1)

# Write the updated content
with open(project_file, 'w') as f:
    f.write(content)

