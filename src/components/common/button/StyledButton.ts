import styled, { css } from 'styled-components';
import type { ButtonProps, ButtonVariant, ButtonSize } from './types';

const variantStyles = {
    outlined: css`
    background: transparent;
    border: 1px solid ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.primary};
    &:hover { background: ${p => p.theme.colors.primaryLight}; }
    `,
    fulfilled: css`
    background: ${p => p.theme.colors.primary};
    border: none;
    color: ${p => p.theme.colors.white};
    &:hover { background: ${p => p.theme.colors.primaryDark}; }
    `,
    ghost: css`
    background: transparent;
    border: none;
    color: ${p => p.theme.colors.primary};
    &:hover { background: ${p => p.theme.colors.backgroundLight}; }
    `,
    white: css`
    background: ${p => p.theme.colors.white};
    border: none;
    color: ${p => p.theme.colors.primary};
    &:hover { background: ${p => p.theme.colors.grayLight}; }
    `,
} as const;

const sizeStyles = {
    small:  css`padding: 4px 8px;  font-size: 12px;`,
    medium: css`padding: 8px 16px; font-size: 14px;`,
    large:  css`padding: 12px 24px; font-size: 16px;`,
} as const;

export const StyledButton = styled.button<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;

    ${p => variantStyles[p.variant ?? 'fulfilled']};
    ${p => sizeStyles[p.size    ?? 'medium']};

    &:active { transform: scale(0.97); }

    &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${p => p.theme.colors.grayLight};
    border-color: ${p => p.theme.colors.grayLight};
    }
`;