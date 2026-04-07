import { motion } from 'framer-motion';
import { TrendingUp, Users, FileText, Clock, Award, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import Card from '../components/ui/Card';

const monthlyNotes = [
  { month: 'Nov', notes: 38, finalized: 35 },
  { month: 'Dec', notes: 29, finalized: 28 },
  { month: 'Jan', notes: 44, finalized: 41 },
  { month: 'Feb', notes: 41, finalized: 39 },
  { month: 'Mar', notes: 47, finalized: 45 },
  { month: 'Apr', notes: 18, finalized: 14 },
];

const qualityTrend = [
  { week: 'W1 Mar', score: 74 },
  { week: 'W2 Mar', score: 79 },
  { week: 'W3 Mar', score: 83 },
  { week: 'W4 Mar', score: 87 },
  { week: 'W1 Apr', score: 89 },
  { week: 'W2 Apr', score: 91 },
];

const encounterMix = [
  { name: 'Follow-Up', value: 58, color: '#10b981' },
  { name: 'Initial Eval', value: 27, color: '#3b82f6' },
  { name: 'Std. Assessment', value: 15, color: '#8b5cf6' },
];

const complianceData = [
  { name: 'Fall Risk', completed: 92, missed: 8 },
  { name: 'Outcome Measures', completed: 85, missed: 15 },
  { name: 'Goals Approved', completed: 78, missed: 22 },
  { name: 'Therapist Sign-Off', completed: 96, missed: 4 },
];

const stats = [
  { label: 'Total Sessions (Apr)', value: '18', sub: '+12% vs Mar', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Notes Finalized', value: '14', sub: '4 pending', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Avg Note Quality', value: '91', sub: '+17pts since Jan', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Avg Session Time', value: '47m', sub: 'Target: 45m', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">Practice analytics · April 2026</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-medium">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon size={20} className={s.color} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Notes */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-5">
            <p className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Monthly Notes Volume
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyNotes} barSize={14}>
                <Bar dataKey="finalized" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Finalized" />
                <Bar dataKey="notes" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Quality Trend */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5">
            <p className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={16} className="text-purple-500" /> Note Quality Score Trend
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={qualityTrend}>
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} name="Quality Score" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Encounter Mix */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-5">
            <p className="font-semibold text-slate-800 mb-4">Encounter Type Mix</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={encounterMix} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {encounterMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {encounterMix.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-700">{item.name}</p>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Compliance */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
          <Card className="p-5">
            <p className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-orange-500" /> Compliance Rates (Apr)
            </p>
            <div className="space-y-4">
              {complianceData.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <span className={`font-bold ${item.completed >= 90 ? 'text-emerald-600' : item.completed >= 80 ? 'text-blue-600' : 'text-orange-500'}`}>
                      {item.completed}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.completed >= 90 ? 'bg-emerald-500' : item.completed >= 80 ? 'bg-blue-500' : 'bg-orange-400'}`}
                      style={{ width: `${item.completed}%` }}
                    />
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
