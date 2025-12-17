# SVG to React Component Converter Guide

## Quick Conversion Steps

1. **Copy SVG from Figma**
   - Select icon/component in Figma
   - Right-click → Copy/Paste as → Copy as SVG
   - Or export as SVG file

2. **Paste SVG code** and extract:
   - `viewBox` attribute (e.g., `viewBox="0 0 24 24"`)
   - `path` elements with `d` attribute
   - `fill` or `stroke` attributes

3. **Create React Component** using template below

## Template

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
      viewBox="0 0 24 24" // From Figma SVG
      fill="none"
      {...props}
    >
      {/* Convert fill="currentColor" to fill={color} */}
      {/* Convert stroke="currentColor" to stroke={color} */}
      <Path
        d="M..." // Path data from Figma
        fill={color} // or stroke={color}
        strokeWidth={1.5} // Adjust as needed
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default YourIconName;
```

## Common Conversions

### Filled Icon (uses fill)
```tsx
<Path
  d="M12 2L2 7L12 12L22 7L12 2Z"
  fill={color}
/>
```

### Outlined Icon (uses stroke)
```tsx
<Path
  d="M12 2L2 7L12 12L22 7L12 2Z"
  stroke={color}
  strokeWidth={1.5}
  fill="none"
/>
```

### Multiple Paths
```tsx
<Svg ...>
  <Path d="M..." fill={color} />
  <Path d="M..." stroke={color} strokeWidth={1.5} />
</Svg>
```

## Tips

1. **Remove hardcoded colors** - Replace `fill="#090D0F"` with `fill={color}`
2. **Set default color** - Use design token default color
3. **Optimize paths** - Use SVGO to minimize path data
4. **Test responsiveness** - Icons scale automatically with `ms()` function

