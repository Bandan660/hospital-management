import Button from './Button';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title:       string;
  subtitle?:   string;
  actionLabel?: string;
  actionIcon?:  LucideIcon;
  onAction?:   () => void;
}

const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          icon={ActionIcon ? <ActionIcon size={16} /> : undefined}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;