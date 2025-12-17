/**
 * Box Component
 * 
 * A View wrapper with optional padding/margin props that accept Figma px values
 * and apply scaled inline styles. Also accepts className for Tailwind classes.
 * 
 * @example
 * ```tsx
 * <Box p={16} m={8} className="bg-white rounded-lg">
 *   Content
 * </Box>
 * ```
 */

import React from 'react';
import { View, ViewProps } from 'react-native';
import { ms } from '@/utils/scale';

export interface BoxProps extends ViewProps {
  /**
   * Padding (all sides) in Figma px - will be scaled
   */
  p?: number;
  
  /**
   * Padding horizontal in Figma px - will be scaled
   */
  px?: number;
  
  /**
   * Padding vertical in Figma px - will be scaled
   */
  py?: number;
  
  /**
   * Padding top in Figma px - will be scaled
   */
  pt?: number;
  
  /**
   * Padding bottom in Figma px - will be scaled
   */
  pb?: number;
  
  /**
   * Padding left in Figma px - will be scaled
   */
  pl?: number;
  
  /**
   * Padding right in Figma px - will be scaled
   */
  pr?: number;
  
  /**
   * Margin (all sides) in Figma px - will be scaled
   */
  m?: number;
  
  /**
   * Margin horizontal in Figma px - will be scaled
   */
  mx?: number;
  
  /**
   * Margin vertical in Figma px - will be scaled
   */
  my?: number;
  
  /**
   * Margin top in Figma px - will be scaled
   */
  mt?: number;
  
  /**
   * Margin bottom in Figma px - will be scaled
   */
  mb?: number;
  
  /**
   * Margin left in Figma px - will be scaled
   */
  ml?: number;
  
  /**
   * Margin right in Figma px - will be scaled
   */
  mr?: number;
  
  /**
   * Tailwind className for styling
   */
  className?: string;
}

export const Box: React.FC<BoxProps> = ({
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  className,
  style,
  children,
  ...props
}) => {
  const scaledStyles = {
    padding: p ? ms(p) : undefined,
    paddingHorizontal: px ? ms(px) : undefined,
    paddingVertical: py ? ms(py) : undefined,
    paddingTop: pt ? ms(pt) : undefined,
    paddingBottom: pb ? ms(pb) : undefined,
    paddingLeft: pl ? ms(pl) : undefined,
    paddingRight: pr ? ms(pr) : undefined,
    margin: m ? ms(m) : undefined,
    marginHorizontal: mx ? ms(mx) : undefined,
    marginVertical: my ? ms(my) : undefined,
    marginTop: mt ? ms(mt) : undefined,
    marginBottom: mb ? ms(mb) : undefined,
    marginLeft: ml ? ms(ml) : undefined,
    marginRight: mr ? ms(mr) : undefined,
  };

  return (
    <View
      className={className}
      style={[scaledStyles, style]}
      {...props}
    >
      {children}
    </View>
  );
};

export default Box;

