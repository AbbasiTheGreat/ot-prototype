import { Activity } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', id: 'patients' },
];

export default function TopNav({ activePage, onNavigate }) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-0 flex items-center justify-between shrink-0 h-14">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
          <Activity size={14} className="text-white" />
        </div>
        <span className="font-bold text-slate-800 text-base">OT CoPilot</span>
      </div>

      <nav className="flex items-center gap-1">
        {navItems.map(({ label, id }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              activePage === id
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">SM</div>
        <span className="text-xs text-slate-500 hidden sm:block">Sarah Mitchell</span>
      </div>
    </header>
  );
}
