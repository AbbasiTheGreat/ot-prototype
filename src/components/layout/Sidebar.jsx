import { Users, FileText, Bell, LogOut, Activity, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { icon: Users, label: 'Patients', id: 'patients' },
  { icon: FileText, label: 'Notes', id: 'notes' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-16 lg:w-60 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <Activity size={16} className="text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-slate-800 font-bold text-sm leading-tight">OT Co-Pilot</p>
            <p className="text-slate-400 text-xs">Elite Platform</p>
          </div>
        </div>
      </div>

      {/* Therapist */}
      <div className="px-4 py-4 border-b border-slate-100 hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">SM</div>
          <div className="min-w-0">
            <p className="text-slate-700 text-xs font-medium truncate">Sarah Mitchell</p>
            <p className="text-slate-400 text-xs">OTR/L</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              activePage === id
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span className="hidden lg:block">{label}</span>
            {activePage === id && <ChevronRight size={14} className="ml-auto hidden lg:block text-blue-400" />}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 text-sm transition-all">
          <Bell size={18} className="shrink-0" />
          <span className="hidden lg:block">Notifications</span>
          <span className="ml-auto hidden lg:block bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 text-sm transition-all">
          <LogOut size={18} className="shrink-0" />
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
