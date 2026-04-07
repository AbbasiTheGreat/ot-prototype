import clsx from 'clsx';

export default function Card({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl border border-slate-200 shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
