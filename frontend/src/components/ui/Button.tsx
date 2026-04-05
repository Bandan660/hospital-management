import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  icon?:     React.ReactNode;
  iconRight?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:   'bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-sm shadow-teal-500/20',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
  danger:    'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/20',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-600',
};

const sizes: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md:  'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg:  'px-5 py-3 text-base rounded-xl gap-2',
};

const Button = ({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  icon,
  iconRight,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading
        ? <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin" />
        : icon
      }
      {children}
      {!loading && iconRight}
    </button>
  );
};

export default Button;