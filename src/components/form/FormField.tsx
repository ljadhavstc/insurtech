/**
 * FormField Component
 * 
 * React Hook Form Controller wrapper that renders Input and shows validation errors.
 * 
 * @example
 * ```tsx
 * <FormField
 *   control={control}
 *   name="email"
 *   label="Email"
 *   placeholder="Enter your email"
 * />
 * ```
 */

import React from 'react';
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
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          {...inputProps}
          value={value || ''}
          onChangeText={onChange}
          error={error?.message}
        />
      )}
    />
  );
}

export default FormField;

