import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, AlertCircle, Users, FileText, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { patients } from '../data/mockData';

const cptColors = { '97166': 'blue', '96112': 'purple', '97530': 'green' };
const statusColors = { 'Completed': 'green', 'In Progress': 'blue', 'Scheduled': 'gray' };

export default function Dashboard({ onSelectPatient }) {
  const complianceAlertPatients = patients.filter(p => !p.compliance?.fallRisk || !p.compliance?.therapistSignoff);

  const stats = [
    { label: "Today's Sessions", value: '5', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', onClick: null },
    { label: 'Notes Completed', value: '1', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', onClick: null },
    { label: 'Pending Review', value: '2', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', onClick: null },
    { label: 'Compliance Alerts', value: String(complianceAlertPatients.length), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', onClick: () => onSelectPatient(complianceAlertPatients[0]) },
  ];
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good morning, Sarah</h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
            <Calendar size={14} /> Monday, April 6, 2026 · 5 sessions scheduled
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
          <Zap size={16} className="text-blue-600" />
          <span className="text-blue-700 text-sm font-medium">AI Co-Pilot Active</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`p-4 ${s.onClick ? 'cursor-pointer hover:shadow-md hover:border-red-200 transition-all' : ''}`} onClick={s.onClick}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-medium">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{s.value}</p>
                  {s.onClick && <p className="text-xs text-red-500 mt-0.5">Click to review →</p>}
                </div>
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon size={20} className={s.color} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Patient List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Today's Schedule
              </h2>
              <span className="text-xs text-slate-400">April 6, 2026</span>
            </div>
            <div className="divide-y divide-slate-50">
              {patients.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  onClick={() => onSelectPatient(p)}
                  className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{p.name}</p>
                      <Badge variant={cptColors[p.cptCode] || 'gray'}>{p.cptCode}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{p.encounterType} · Age {p.age}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-slate-600">{p.sessionTime}</p>
                    <Badge variant={statusColors[p.status]}>{p.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
