import type { InputHTMLAttributes } from 'react';

export type InputVariant = 'outlined' | 'fulfilled' | 'ghost' | 'white';
export type InputSize    = 'small'    | 'medium'    | 'large';

/**
 * All normal <input> props plus:
 *  - variant: visual style
 *  - size: small/medium/large
 *  - error: red‐border state
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    variant?: InputVariant;
    inputSize?: InputSize;
    error?: boolean;
}