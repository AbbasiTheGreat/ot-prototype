import clsx from 'clsx';

const variants = {
  blue: 'bg-blue-100 text-blue-700 border border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  green: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  orange: 'bg-orange-100 text-orange-700 border border-orange-200',
  red: 'bg-red-100 text-red-700 border border-red-200',
  gray: 'bg-slate-100 text-slate-600 border border-slate-200',
  yellow: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
};

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
