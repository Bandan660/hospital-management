interface CardProps {
    children:   React.ReactNode;
    className?: string;
    padding?:   'sm' | 'md' | 'lg' | 'none';
  }
  
  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  };
  
  const Card = ({ children, className = '', padding = 'md' }: CardProps) => {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${paddings[padding]} ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Card;