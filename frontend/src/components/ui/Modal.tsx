import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  title:     string;
  subtitle?: string;
  children:  React.ReactNode;
  size?:     'sm' | 'md' | 'lg';
}

const sizes = {
  sm:  'max-w-md',
  md:  'max-w-lg',
  lg:  'max-w-2xl',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
}: ModalProps) => {

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            {subtitle && (
              <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;