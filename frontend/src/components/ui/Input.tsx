import {type LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:      string;
  error?:      string;
  icon?:       LucideIcon;
  iconRight?:  React.ReactNode;
  hint?:       string;
}

const Input = ({
  label,
  error,
  icon: Icon,
  iconRight,
  hint,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {props.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={15} className="text-slate-400" />
          </div>
        )}

        <input
          className={`
            w-full py-2.5 text-sm text-slate-800 bg-slate-50
            border rounded-xl outline-none placeholder-slate-400
            transition-all duration-200
            focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200'}
            ${Icon     ? 'pl-10'  : 'pl-4'}
            ${iconRight ? 'pr-10' : 'pr-4'}
            ${className}
          `}
          {...props}
        />

        {iconRight && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {iconRight}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
};

export default Input;