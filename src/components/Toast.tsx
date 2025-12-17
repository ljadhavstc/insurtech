/**
 * Toast Component
 * 
 * A toast notification component. Use with ToastProvider for global toasts.
 * 
 * @example
 * ```tsx
 * const { showToast } = useToast();
 * showToast({ type: 'success', message: 'Saved!' });
 * ```
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { View } from 'react-native';
import { ms } from '@/utils/scale';
import { Box } from './primitives/Box';
import { Text } from './primitives/Text';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id, duration: toast.duration || 3000 };
    
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View
        className="absolute bottom-12 left-0 right-0 items-center z-50"
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onHide: (id: string) => void }> = ({ toast, onHide }) => {
  const typeStyles: Record<ToastType, { bg: string; text: string }> = {
    success: { bg: 'bg-success', text: 'text-white' },
    error: { bg: 'bg-error', text: 'text-white' },
    warning: { bg: 'bg-warning', text: 'text-black' },
    info: { bg: 'bg-info', text: 'text-white' },
  };

  const styles = typeStyles[toast.type];

  return (
    <Box
      className={`${styles.bg} ${styles.text} mb-2`}
      px={16}
      py={12}
      style={{ borderRadius: ms(8), minWidth: ms(200) }}
    >
      <Text size={14} className={styles.text} style={{ fontWeight: '500' }}>
        {toast.message}
      </Text>
    </Box>
  );
};

export default ToastProvider;

