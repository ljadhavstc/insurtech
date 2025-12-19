# Orientation-Aware Responsive Design

This document explains how the app handles orientation changes (portrait/landscape) and applies responsive scaling to all components.

## Overview

The app automatically detects device orientation and adjusts component sizing accordingly:
- **Portrait Mode**: Normal scaling based on width/height
- **Landscape Mode**: Height-based scaling to prevent elements from becoming too wide

## How It Works

### 1. Orientation Detection

All scaling functions automatically detect current orientation:

```typescript
import { getOrientation, isLandscape, isPortrait } from '@/utils/scale';

const orientation = getOrientation(); // 'portrait' | 'landscape'
const isLandscape = isLandscape(); // boolean
```

### 2. Orientation-Aware Scaling Functions

#### `getOrientationAwareWidth(designWidth, breakpoint)`
**Used for**: Button widths, container widths, horizontal elements

```typescript
import { getOrientationAwareWidth } from '@/utils/scale';

// In portrait: Scales normally up to breakpoint
// In landscape: Uses height-based scaling to prevent elements from becoming too wide
const buttonWidth = getOrientationAwareWidth(343, 428);
```

**Behavior:**
- **Portrait**: Scales proportionally (343px → 376px → 428px)
- **Landscape**: Uses height as scale base (prevents buttons from becoming 600px+ wide)

#### `os(size, portraitSize?, landscapeSize?)`
**Used for**: Elements that need different sizes in portrait vs landscape

```typescript
import { os } from '@/utils/scale';

// Same size in both orientations
const padding = os(16);

// Different sizes per orientation
const spacing = os(16, 16, 12); // 16px portrait, 12px landscape
```

### 3. React Hook for Components

Use the hook in components that need to react to orientation changes:

```typescript
import { useScreenDimensions } from '@/utils/useScreenDimensions';

export const MyComponent = () => {
  const { width, height, orientation, isLandscape, isPortrait } = useScreenDimensions();
  
  // Component automatically re-renders on orientation change
  return (
    <View style={{ width: isLandscape ? 300 : 343 }}>
      {/* Content */}
    </View>
  );
};
```

## Applied Components

### ✅ Button Component
- Uses `getOrientationAwareWidth(343, 428)` for `fullWidth` buttons
- Automatically adjusts in landscape mode
- Maintains proper margins in both orientations

### ✅ Onboarding Screen
- Buttons use orientation-aware width
- Debug info shows current orientation
- All spacing scales appropriately

### ✅ Success Screen
- Uses `useScreenDimensions()` hook
- Icon sizes scale with orientation
- Button width adjusts automatically

### ✅ Input Components
- Already use `ms()` for all sizing (orientation-aware)
- Font sizes, padding, margins all scale correctly

## Common Breakpoints

| Breakpoint | Width | Device Examples |
|------------|-------|-----------------|
| `small` | 375px | iPhone SE |
| `medium` | 390px | iPhone 13/14 (base design) |
| `large` | 428px | iPhone 14 Pro Max |
| `tablet` | 768px | iPad Mini |
| `tabletLarge` | 1024px | iPad Pro |

## Orientation Behavior

### Portrait Mode (Default)
- Elements scale based on screen width
- Button: 343px → scales up to 428px
- Normal responsive behavior

### Landscape Mode
- Elements scale based on screen **height** (prevents excessive width)
- Button: Uses height-based scaling, capped at 428px
- Prevents UI from becoming too stretched horizontally

## Example: Button Width Calculation

**Portrait (390px width):**
```
Button Width = ms(343) = 343px
Margin = (390 - 343) / 2 = 23.5px each side
```

**Landscape (844px width, 390px height):**
```
Height Scale = 390 / 844 = 0.462
Button Width = 343 * 0.462 = 158px (too small!)
→ Actually uses: min(ms(343), 428) = 343px (capped)
Margin = (844 - 343) / 2 = 250.5px each side (centered)
```

**Landscape (428px width, 844px height):**
```
Height Scale = 844 / 844 = 1.0
Button Width = 343 * 1.0 = 343px
Margin = (428 - 343) / 2 = 42.5px each side
```

## Best Practices

1. **Use `getOrientationAwareWidth()` for horizontal elements**
   ```typescript
   const buttonWidth = getOrientationAwareWidth(343, 428);
   ```

2. **Use `useScreenDimensions()` hook in components**
   ```typescript
   const { isLandscape, orientation } = useScreenDimensions();
   ```

3. **Use `ms()` for padding/margins** (already orientation-aware)
   ```typescript
   const padding = ms(16); // Works in both orientations
   ```

4. **Use `os()` for orientation-specific sizes**
   ```typescript
   const spacing = os(16, 20, 12); // 20px portrait, 12px landscape
   ```

## Testing Orientation

1. **iOS Simulator**: Device → Rotate Left/Right
2. **Android Emulator**: Rotate button or Ctrl+F11/Ctrl+F12
3. **Physical Device**: Rotate device

The debug info on OnboardingScreen shows:
- Current orientation
- Screen dimensions
- Button width (scaled)
- Whether it's using landscape-adjusted scaling

## Summary

All components automatically:
- ✅ Detect orientation changes
- ✅ Adjust scaling in landscape mode
- ✅ Maintain proper proportions
- ✅ Use boxed layout on large screens
- ✅ Re-render on orientation change (when using hook)

No manual orientation handling needed - the scaling utilities handle it automatically!

