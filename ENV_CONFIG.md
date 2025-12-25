# Environment Configuration

This app uses `react-native-config` to manage environment variables via `.env` files.

## Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your desired configuration:
   ```env
   ENABLE_MOCK_SERVER=false
   FORCE_MOCK_MODE=false
   ```

3. **For iOS**, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Rebuild the app** after changing `.env` values:
   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android
   ```

## Configuration Options

### `ENABLE_MOCK_SERVER`
- **Type**: `boolean` (true/false)
- **Default**: `false`
- **Description**: 
  - `false`: Use live APIs only (mock server disabled)
  - `true`: Enable mock server (can be used as fallback or primary)

### `FORCE_MOCK_MODE`
- **Type**: `boolean` (true/false)
- **Default**: `false`
- **Description**: Only applies when `ENABLE_MOCK_SERVER=true`
  - `false`: Try real API first, fallback to mock if unreachable
  - `true`: Use mock server immediately, skipping real API attempts

## Examples

### Use Live APIs Only (Default)
```env
ENABLE_MOCK_SERVER=false
FORCE_MOCK_MODE=false
```

### Use Mock Server as Fallback
```env
ENABLE_MOCK_SERVER=true
FORCE_MOCK_MODE=false
```
This will try the real API first, and only use mock if the API is unreachable.

### Use Mock Server Only (For Testing)
```env
ENABLE_MOCK_SERVER=true
FORCE_MOCK_MODE=true
```
This will use the mock server immediately, skipping real API attempts.

## Important Notes

- The `.env` file is gitignored and should not be committed
- Always use `.env.example` as a template
- After changing `.env`, you must rebuild the app (not just reload)
- `/customer/*` endpoints always use live APIs (mock is never used for these)

