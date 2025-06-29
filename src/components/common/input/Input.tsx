import React, { forwardRef } from 'react';
import { StyledInput } from './StyledInput';
import type { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant   = 'outlined',
  inputSize = 'medium',
  error     = false,
  disabled  = false,
  ...rest
}, ref) => (
  <StyledInput
    variant={variant}
    inputSize={inputSize}
    error={error}
    disabled={disabled}
    {...rest}
    ref={ref}
  />
));

Input.displayName = 'Input';