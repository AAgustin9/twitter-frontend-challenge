import styled, { css } from 'styled-components';
import type { InputProps, InputSize, InputVariant } from './types';

const variantStyles = {
  outlined: css`
    background: transparent;
    border: 1px solid ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.text};
    &:focus { border-color: ${p => p.theme.colors.main}; }
  `,
  fulfilled: css`
    background: ${p => p.theme.colors.inputBg};
    border: none;
    color: ${p => p.theme.colors.text};
    &:focus { background: ${p => p.theme.colors.inputBgFocus}; }
  `,
  ghost: css`
    background: transparent;
    border: none;
    color: ${p => p.theme.colors.text};
    &:focus { background: ${p => p.theme.colors.backgroundLight}; }
  `,
  white: css`
    background: ${p => p.theme.colors.white};
    border: 1px solid ${p => p.theme.colors.outline};
    color: ${p => p.theme.colors.text};
    &:focus { border-color: ${p => p.theme.colors.primary}; }
  `,
} as const;

const sizeStyles = {
  small:  css`padding: 4px 8px;   font-size: 12px;`,
  medium: css`padding: 8px 12px;  font-size: 14px;`,
  large:  css`padding: 12px 16px; font-size: 16px;`,
} as const;

export const StyledInput = styled.input<
  Pick<InputProps,'variant'|'error'> & { inputSize?: InputSize }
>`  
  width: 100%;
  border-radius: 8px;
  padding: 8px;
  transition: border-color 0.3s, background 0.3s;
  ${p => variantStyles[(p.variant   ?? 'outlined') as InputVariant]};
  ${p => sizeStyles   [(p.inputSize ?? 'medium')   as InputSize]};

  /* error state overrides */
  ${p => p.error && css`
    border-color: ${p.theme.colors.error} !important;
  `};

  /* disabled state */
  &:disabled {
    background: ${p => p.theme.colors.grayLight};
    cursor: not-allowed;
  }
`;