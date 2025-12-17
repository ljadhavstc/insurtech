/**
 * FormField Component
 * 
 * React Hook Form Controller wrapper that renders Input and shows validation errors.
 * Supports all Input customization props (styles, colors, typography).
 * 
 * @example
 * ```tsx
 * <FormField
 *   control={control}
 *   name="email"
 *   label="Email"
 *   placeholder="Enter your email"
 * />
 * 
 * // With custom styling
 * <FormField
 *   control={control}
 *   name="phoneNumber"
 *   label="phone number"
 *   placeholder="eg. 33011234"
 *   colors={{
 *     labelColor: '#687078',
 *     placeholderColor: '#9CA3AF',
 *     textColor: '#090D0F',
 *   }}
 *   styles={{
 *     inputContainer: { borderWidth: 2 },
 *   }}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { Controller, Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Input, InputProps } from '../primitives/Input';

export interface FormFieldProps<T extends FieldValues> extends Omit<InputProps, 'error' | 'value' | 'onChangeText'> {
  /**
   * React Hook Form control
   */
  control: Control<T>;
  
  /**
   * Field name (must match form schema)
   */
  name: FieldPath<T>;
  
  /**
   * Validation rules
   */
  rules?: RegisterOptions<T>;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  rules,
  ...inputProps
}: FormFieldProps<T>) {
  // Auto-generate rules based on variant if not provided
  const variant = (inputProps as any).variant;
  const finalRules = useMemo(() => {
    if (rules) return rules;
    
    // Auto-generate rules based on variant
    if (!variant) return undefined;
    
    switch (variant) {
      case 'mobile':
        return {
          required: 'Phone number is required',
          pattern: {
            value: /^[0-9]{8,15}$/,
            message: 'number is invalid',
          },
        };
      case 'mobile-with-country-code':
        return {
          required: 'Phone number is required',
          pattern: {
            value: /^(\+966|00966|966)?[0-9]{9}$/,
            message: 'number is invalid',
          },
        };
      case 'email':
        return {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'email is invalid',
          },
        };
      case 'password':
        return {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'password must be at least 8 characters',
          },
        };
      default:
        return undefined;
    }
  }, [rules, variant]);
  
  return (
    <Controller
      control={control}
      name={name}
      rules={finalRules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          {...inputProps}
          value={value || ''}
          onChangeText={onChange}
          error={error?.message}
          autoValidate={false} // Disable auto-validate when using react-hook-form
        />
      )}
    />
  );
}

export default FormField;

