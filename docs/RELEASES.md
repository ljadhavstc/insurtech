# 📦 Sharing Builds with GitHub Releases

This guide explains how to share APK and IPA files with your internal team using GitHub Releases.

## 🎯 Overview

GitHub Releases provide a secure, organized way to distribute builds to your team:

- ✅ **Private by default** - If your repository is private, releases are automatically private
- ✅ **Easy access** - Team members can download directly from the Releases page
- ✅ **Version tracking** - Tag releases with version numbers (e.g., `v1.0.0`)
- ✅ **Persistent storage** - Releases don't expire like artifacts (30-day limit)
- ✅ **Release notes** - Include changelog and installation instructions
- ✅ **Download-only** - Team members can view and download, but not modify

## 🚀 How to Create a Release

### Option 1: Automatic Release (Recommended)

When running a build workflow:

1. Go to **Actions** tab in GitHub
2. Select **Build Android Release** or **Build iOS Release**
3. Click **Run workflow**
4. Configure options:
   - **Create GitHub Release**: ✅ `true` (default)
   - **Release tag**: Optional (e.g., `v1.0.0`). Leave empty for auto-generated tag
   - Other build-specific options
5. Click **Run workflow**
6. Once build completes, the release will be created automatically

### Option 2: Manual Release

1. Go to your repository on GitHub
2. Click **Releases** → **Create a new release**
3. Choose a tag (or create new one)
4. Upload APK/IPA files
5. Add release notes
6. Click **Publish release**

## 📱 Accessing Releases

### For Team Members

1. Go to your repository on GitHub
2. Click **Releases** in the right sidebar
3. Find the release you need
4. Download the APK or IPA file
5. Install on device following instructions in release notes

### Direct Link Format

```
https://github.com/YOUR_ORG/YOUR_REPO/releases/tag/TAG_NAME
```

Example:
```
https://github.com/your-org/insurtech/releases/tag/v1.0.0
```

## 🔐 Security & Permissions

### Repository Visibility

- **Private Repository**: Releases are automatically private (only team members can access)
- **Public Repository**: Releases are public (consider using private repo for internal builds)

### Required Permissions

- **Create Release**: Requires write access to repository
- **View/Download**: Requires read access to repository

### Team Access

To give team members access:

1. Go to **Settings** → **Collaborators & teams**
2. Add team members or create a team
3. Grant **Read** access (minimum) or **Write** access (to create releases)

## 📋 Release Tag Naming

### Auto-Generated Tags

If you don't specify a tag, workflows auto-generate:
- **iOS**: `ios-ad-hoc-abc1234` (distribution method + commit SHA)
- **Android**: `android-release-abc1234` (build type + commit SHA)

### Custom Tags (Recommended)

Use semantic versioning:
- `v1.0.0` - Major release
- `v1.0.1` - Patch release
- `v1.1.0` - Minor release
- `v1.0.0-beta.1` - Pre-release/beta

### Best Practices

- Use consistent naming convention
- Include platform in tag: `v1.0.0-ios`, `v1.0.0-android`
- Or create separate releases per platform

## 🔄 Alternative: Separate Private Repository

If you want even more control, create a dedicated repository:

### Setup

1. Create a new private repository: `insurtech-builds` or `insurtech-releases`
2. Add team members with read access
3. Update workflows to push builds to this repo

### Workflow Example

```yaml
- name: Push to Builds Repository
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./builds
    destination_dir: releases
```

## 📊 Comparison: Releases vs Artifacts

| Feature | GitHub Releases | GitHub Artifacts |
|---------|----------------|------------------|
| **Access** | Easy download from Releases page | Requires Actions tab access |
| **Retention** | Permanent | 30 days (configurable) |
| **Versioning** | Tag-based | Run-based |
| **Visibility** | Public/Private (follows repo) | Always private |
| **Size Limit** | 2 GB per file | 10 GB total per workflow |
| **Best For** | Distribution to team | Temporary build outputs |

## 🎨 Release Notes Template

When creating releases, include:

```markdown
## 📱 iOS Build Release

**Distribution Method:** ad-hoc
**Build Type:** Release
**IPA Size:** 45.2 MB
**Commit:** abc1234
**Branch:** main

### 📦 Installation

Download the IPA file below and install using:
- **TestFlight** (for app-store builds)
- **Apple Configurator** or **Xcode** (for ad-hoc builds)
- **MDM** (for enterprise builds)

### ⚠️ Notes

- This IPA includes the JavaScript bundle
- Requires iOS 15.1 or later

### 🔗 Links

- [View Commit](link)
- [View Workflow Run](link)
```

## 🛠️ Troubleshooting

### "Permission denied" when creating release

- Ensure `GITHUB_TOKEN` has write permissions
- Check repository settings → Actions → Workflow permissions

### Release not appearing

- Check if workflow completed successfully
- Verify `create_release` input is set to `true`
- Check Actions logs for errors

### Team members can't see releases

- Verify repository is private (releases inherit visibility)
- Check team member has read access
- Ensure they're looking at the correct repository

## 📚 Additional Resources

- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [softprops/action-gh-release](https://github.com/softprops/action-gh-release)

