# InsurTech App

A production-ready React Native TypeScript scaffold with NativeWind (Tailwind), responsive scaling, complete auth flows, and comprehensive component library.

## Features

- ✅ React Native CLI 0.82.0 with TypeScript (strict mode)
- ✅ NativeWind (Tailwind CSS for React Native)
- ✅ Responsive scaling utilities (react-native-size-matters pattern)
- ✅ React Hook Form + Zod validation
- ✅ Axios with interceptors (auth + refresh token)
- ✅ Zustand for state management (persisted)
- ✅ i18next for internationalization (EN + ES)
- ✅ Complete auth flows (Login, Register, Forgot Password, OTP, Reset)
- ✅ Mock server for development
- ✅ Figma token generator
- ✅ Comprehensive component library
- ✅ Full TypeScript support
- ✅ ESLint + Prettier configuration

## Quick Start

### Installation

```bash
npm install
# or
yarn install
```

### Environment Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** to configure mock server settings (see [ENV_CONFIG.md](./ENV_CONFIG.md) for details)

3. **For iOS**, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

   **Note:** After changing `.env` values, you must rebuild the app (not just reload).

### Run the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Generate Tokens from Figma

1. Export your Figma variables as JSON
2. Run the generator:

```bash
npm run generate-tokens
```

Or with custom input:

```bash
cat figma-variables.json | npm run generate-tokens
```

### Figma JSON Format

```json
{
  "colors": {
    "primary": "#0b69ff",
    "muted": "#f3f4f6"
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 16
  },
  "typeScale": {
    "h1": 32,
    "h2": 24,
    "body": 16
  }
}
```

The generator will:
- Create `src/styles/tokens.ts` with design tokens
- Update `tailwind.config.js` with extended theme

## Project Structure

```
src/
├── app/              # App providers
├── components/       # Reusable components
│   ├── primitives/   # Base UI components
│   └── form/         # Form components
├── features/         # Feature modules
│   └── auth/         # Auth feature
│       └── screens/  # Auth screens
├── navigation/       # Navigation setup
├── services/         # API services
├── stores/           # Zustand stores
├── styles/           # Design tokens
├── utils/            # Utility functions
└── i18n/            # Internationalization
```

## Usage Examples

### Components

```tsx
import { Text, Box, Button } from '@/components/primitives';

<Box p={16} className="bg-white rounded-lg">
  <Text variant="h1" className="text-primary">
    Hello World
  </Text>
  <Button variant="primary" onPress={handlePress}>
    Click Me
  </Button>
</Box>
```

### Scaling Utilities

```tsx
import { s, vs, ms, fs } from '@/utils/scale';

const width = s(100);      // Scale width
const height = vs(50);     // Scale height
const padding = ms(16);     // Scale padding
const fontSize = fs(16);    // Scale font size
```

### Forms

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/form';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});

<FormField
  control={control}
  name="email"
  label="Email"
  placeholder="Enter email"
/>
```

### Auth Store

```tsx
import { authStore } from '@/stores/authStore';

const user = authStore((state) => state.user);
const login = authStore((state) => state.login);
const logout = authStore((state) => state.logout);
```

### API Calls

```tsx
import api from '@/services/api';

const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});
```

## Mock Server

The app includes a mock server for development. Default test credentials:

- **Email:** user@example.com
- **Password:** password123

OTP codes are logged to console in development mode.

## Documentation

See the `docs/` folder for comprehensive documentation:

- [Components](docs/components.html)
- [Styling Guide](docs/styling.html)
- [Screens](docs/screens.html)
- [Project Structure](docs/structure.html)
- [Dependencies](docs/dependencies.html)
- [Hooks](docs/hooks.html)
- [Utils](docs/utils.html)
- [Services](docs/services.html)
- [Stores](docs/stores.html)

## CI/CD Pipeline

The project uses GitHub Actions to build APK and IPA files.

### Quick Start

1. **Generate keystore:** `./scripts/generate-keystore.sh`
2. **Add secrets to GitHub:** Repository Settings > Secrets > Actions
3. **Build via Actions:** Go to Actions tab > Select workflow > Run workflow

### Available Workflows

- **CI Pipeline** - Automatic on push/PR (lint, test, debug builds)
- **Build Android Release** - Manual trigger (builds release APK)
- **Build iOS Release** - Manual trigger (builds IPA)

See [README_BUILDS.md](README_BUILDS.md) for detailed instructions.

## Testing

```bash
npm test
```

## Linting & Formatting

```bash
# Lint
npm run lint

# Format (with Prettier)
npx prettier --write .
```

## TypeScript

The project uses TypeScript with strict mode enabled. Path aliases are configured:

- `@/*` → `src/*`

## License

Private - InsurTech App
