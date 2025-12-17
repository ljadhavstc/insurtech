/**
 * Alert Component
 * 
 * A reusable alert component for displaying messages.
 * 
 * @example
 * ```tsx
 * <Alert type="error" message="Something went wrong" />
 * ```
 */

import React from 'react';
import { Box } from './primitives/Box';
import { Text } from './primitives/Text';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  /**
   * Alert type
   */
  type: AlertType;
  
  /**
   * Alert message
   */
  message: string;
  
  /**
   * Alert title (optional)
   */
  title?: string;
  
  /**
   * Additional Tailwind classes
   */
  className?: string;
}

const typeStyles: Record<AlertType, { bg: string; text: string; border: string }> = {
  success: {
    bg: 'bg-green-50',
    text: 'text-success',
    border: 'border-success',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-error',
    border: 'border-error',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-warning',
    border: 'border-warning',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-info',
    border: 'border-info',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  title,
  className,
}) => {
  const styles = typeStyles[type];

  return (
    <Box
      className={`${styles.bg} border ${styles.border} rounded-md ${className || ''}`}
      p={12}
    >
      {title && (
        <Text
          variant="body"
          className={`${styles.text} font-semibold mb-xs`}
        >
          {title}
        </Text>
      )}
      <Text variant="bodySmall" className={styles.text}>
        {message}
      </Text>
    </Box>
  );
};

export default Alert;

