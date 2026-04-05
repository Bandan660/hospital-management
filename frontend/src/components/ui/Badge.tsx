type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  variant?:  BadgeVariant;
  children:  React.ReactNode;
  dot?:      boolean;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  warning: 'bg-amber-50  text-amber-600  border border-amber-200',
  danger:  'bg-red-50    text-red-500    border border-red-200',
  info:    'bg-blue-50   text-blue-600   border border-blue-200',
  default: 'bg-slate-100 text-slate-600  border border-slate-200',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  default: 'bg-slate-400',
};

const Badge = ({ variant = 'default', children, dot = false }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${variants[variant]}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;