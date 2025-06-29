import React from 'react';
import { StyledButton } from './StyledButton';
import type { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
    variant = 'fulfilled',
    size    = 'medium',
    disabled = false,
    children,
    ...rest
}) => (
    <StyledButton
    variant={variant}
    size={size}
    disabled={disabled}
    {...rest}
    >
    {children}
    </StyledButton>
);