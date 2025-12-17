# Icon System

Optimized SVG icon system for React Native with minimal bundle size impact.

## Features

- ✅ **Tree-shakeable** - Only imported icons are included in bundle
- ✅ **Customizable** - Size, color, and styling props
- ✅ **Responsive** - Automatically scales with device size
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Minimal bundle size** - SVG components are tiny (~1-2KB each)

## Usage

### Basic Usage

```tsx
import { Icon } from '@/components/icons';

<Icon name="chevron-left" size={24} color="#090D0F" />
```

### Direct Icon Import (Recommended for better tree-shaking)

```tsx
import { ChevronLeftIcon } from '@/components/icons';

<ChevronLeftIcon width={24} height={24} color="#090D0F" />
```

### With Custom Styling

```tsx
import { Icon } from '@/components/icons';

<Icon 
  name="eye" 
  size={16} 
  color="#687078"
  style={{ marginRight: 8 }}
/>
```

## Adding New Icons from Figma

1. **Export SVG from Figma**
   - Select the icon/component
   - Right-click → Copy/Paste as → Copy as SVG
   - Or use Figma API to download SVG

2. **Convert SVG to React Component**
   - Create new file: `src/components/icons/YourIconName.tsx`
   - Use this template:

```tsx
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface YourIconNameProps extends SvgProps {
  color?: string;
}

export const YourIconName: React.FC<YourIconNameProps> = ({
  color = '#090D0F',
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24" // Update viewBox from Figma
      fill="none"
      {...props}
    >
      {/* Paste Path elements from Figma SVG */}
      <Path
        d="M..." // SVG path data
        stroke={color} // or fill={color} for filled icons
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default YourIconName;
```

3. **Register Icon**
   - Add to `src/components/icons/index.ts`:

```tsx
import YourIconName from './YourIconName';
registerIcon('your-icon-name', YourIconName);
export { YourIconName } from './YourIconName';
```

4. **Use Icon**

```tsx
import { Icon } from '@/components/icons';
<Icon name="your-icon-name" size={24} />
```

## Optimization Tips

1. **Use direct imports** for better tree-shaking:
   ```tsx
   // ✅ Better - tree-shakeable
   import { ChevronLeftIcon } from '@/components/icons';
   
   // ⚠️ Still works but less optimal
   import { Icon } from '@/components/icons';
   <Icon name="chevron-left" />
   ```

2. **Remove unused icons** - Delete icon files you don't use

3. **Optimize SVG paths** - Use tools like SVGO to minimize path data

4. **Group related icons** - Create subdirectories if you have many icons

## Icon Sizes

Standard sizes (in Figma pixels, will be scaled):
- `16` - Small icons (inline text, buttons)
- `24` - Medium icons (default, most common)
- `32` - Large icons (headers, prominent actions)
- `48` - Extra large icons (featured content)

## Colors

Icons use `currentColor` by default, which inherits the text color. You can override with:

```tsx
<Icon name="chevron-left" color="#FF375E" />
```

## Examples

### In Button

```tsx
import { Icon } from '@/components/icons';

<Button>
  <Icon name="chevron-left" size={16} color="#FFFFFF" />
  Login
</Button>
```

### In Input Field

```tsx
import { EyeIcon, EyeOffIcon } from '@/components/icons';

<Input
  rightIcon={
    isVisible ? (
      <EyeIcon width={20} height={20} color="#687078" />
    ) : (
      <EyeOffIcon width={20} height={20} color="#687078" />
    )
  }
/>
```

### Conditional Icon

```tsx
import { Icon } from '@/components/icons';

<Icon 
  name={isActive ? 'eye' : 'eye-off'} 
  size={24} 
  color={isActive ? '#090D0F' : '#687078'} 
/>
```

