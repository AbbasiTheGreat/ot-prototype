import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp, Users, FileText, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { patients } from '../data/mockData';

const weekData = [
  { day: 'Mon', notes: 8, completed: 7 },
  { day: 'Tue', notes: 6, completed: 6 },
  { day: 'Wed', notes: 9, completed: 8 },
  { day: 'Thu', notes: 7, completed: 5 },
  { day: 'Fri', notes: 5, completed: 5 },
];

const qualityData = [
  { week: 'W1', score: 72 },
  { week: 'W2', score: 78 },
  { week: 'W3', score: 81 },
  { week: 'W4', score: 88 },
  { week: 'W5', score: 91 },
];

const cptColors = { '97166': 'blue', '96112': 'purple', '97530': 'green' };
const statusColors = { 'Completed': 'green', 'In Progress': 'blue', 'Scheduled': 'gray' };

  const stats = [
    { label: "Today's Sessions", value: '5', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', onClick: null },
    { label: 'Notes Completed', value: '1', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', onClick: null },
    { label: 'Pending Review', value: '2', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', onClick: null },
    { label: 'Compliance Alerts', value: String(complianceAlertPatients.length), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', onClick: () => onSelectPatient(complianceAlertPatients[0]) },
  ];

export default function Dashboard({ onSelectPatient }) {
  const complianceAlertPatients = patients.filter(p => !p.compliance?.fallRisk || !p.compliance?.therapistSignoff);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
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

        {/* Charts */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <Card className="p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <TrendingUp size={15} className="text-emerald-500" /> Note Quality Score
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={qualityData}>
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 mt-1 text-center">Trending up 19pts this month</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Weekly Notes</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={weekData} barSize={10}>
                <Bar dataKey="completed" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="notes" fill="#e2e8f0" radius={[3, 3, 0, 0]} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Compliance Status</p>
            <div className="space-y-2">
              {[
                { label: 'Fall Risk Completed', count: 3, total: 5, color: 'bg-blue-500' },
                { label: 'Outcome Measures', count: 2, total: 5, color: 'bg-emerald-500' },
                { label: 'Goals Approved', count: 4, total: 6, color: 'bg-purple-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{item.label}</span>
                    <span>{item.count}/{item.total}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / item.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
