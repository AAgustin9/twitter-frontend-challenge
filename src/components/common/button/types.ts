export type ButtonVariant  = 'outlined' | 'fulfilled' | 'ghost' | 'white';
export type ButtonSize     = 'small'    | 'medium'    | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;    // default: "fulfilled"
    size?: ButtonSize;          // default: "medium"
    disabled?: boolean;         // native disabled
}