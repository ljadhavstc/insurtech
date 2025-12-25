/**
 * Icons Index
 * 
 * Centralized icon exports for easy importing.
 * Icons are registered here for tree-shaking optimization.
 * 
 * @example
 * ```tsx
 * import { ChevronLeftIcon, EyeIcon } from '@/components/icons';
 * ```
 */

import { registerIcon } from './Icon';
import ChevronLeftIcon from './ChevronLeft';
import ChevronDownIcon from './ChevronDown';
import EyeIcon from './Eye';
import EyeOffIcon from './EyeOff';
import InfoIcon from './Info';
import CheckCircleIcon from './CheckCircle';
import FaceIDIcon from './FaceID';

// Register all icons
registerIcon('chevron-left', ChevronLeftIcon);
registerIcon('chevron-down', ChevronDownIcon);
registerIcon('eye', EyeIcon);
registerIcon('eye-off', EyeOffIcon);
registerIcon('info', InfoIcon);
registerIcon('check-circle', CheckCircleIcon);
registerIcon('face-id', FaceIDIcon);

// Export individual icons for direct use (better tree-shaking)
export { ChevronLeftIcon } from './ChevronLeft';
export { ChevronDownIcon } from './ChevronDown';
export { EyeIcon } from './Eye';
export { EyeOffIcon } from './EyeOff';
export { InfoIcon } from './Info';
export { CheckCircle } from './CheckCircle';
export { FaceID } from './FaceID';

// Export Icon component
export { Icon, registerIcon } from './Icon';
export type { IconProps } from './Icon';

// Icon names type for autocomplete
export type IconName = 
  | 'chevron-left'
  | 'chevron-down'
  | 'eye'
  | 'eye-off'
  | 'info'
  | 'check-circle'
  | 'face-id';

