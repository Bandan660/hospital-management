import { ChevronDown, type LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
  icon?:    LucideIcon;
  options:  SelectOption[];
  placeholder?: string;
}

const Select = ({
  label,
  error,
  hint,
  icon: Icon,
  options,
  placeholder,
  className = '',
  ...props
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">

      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {props.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={15} className="text-slate-400" />
          </div>
        )}

        <select
          className={`
            w-full py-2.5 text-sm text-slate-800 bg-slate-50
            border rounded-xl outline-none appearance-none
            transition-all duration-200 cursor-pointer
            focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]
            ${error ? 'border-red-300' : 'border-slate-200'}
            ${Icon ? 'pl-10' : 'pl-4'}
            pr-10
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
};

export default Select;