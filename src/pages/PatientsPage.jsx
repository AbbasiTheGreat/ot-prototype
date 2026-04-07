import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, User, Calendar, FileText, ChevronRight, Phone, Mail } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { patients } from '../data/mockData';

const allPatients = [
  ...patients,
  {
    id: 6, name: "Sofia Ramirez", age: 8, dob: "2017-06-12", cptCode: "97530", encounterType: "Follow-Up",
    sessionDate: "2026-04-08", sessionTime: "09:30", therapist: "Sarah Mitchell, OTR/L",
    status: "Scheduled", avatar: "SR", avatarColor: "bg-pink-500",
    diagnosis: "Fine Motor Delay", referralSource: "Dr. Chen, Pediatrics",
    lastVisit: "2026-03-30", totalSessions: 12,
  },
  {
    id: 7, name: "Noah Williams", age: 10, dob: "2015-11-20", cptCode: "97166", encounterType: "Initial Evaluation",
    sessionDate: "2026-04-09", sessionTime: "11:00", therapist: "Sarah Mitchell, OTR/L",
    status: "Scheduled", avatar: "NW", avatarColor: "bg-indigo-500",
    diagnosis: "ADHD, Handwriting Difficulties", referralSource: "School Referral",
    lastVisit: null, totalSessions: 0,
  },
  {
    id: 8, name: "Amara Johnson", age: 3, dob: "2022-09-05", cptCode: "97166", encounterType: "Initial Evaluation",
    sessionDate: "2026-04-10", sessionTime: "14:00", therapist: "Sarah Mitchell, OTR/L",
    status: "Scheduled", avatar: "AJ", avatarColor: "bg-rose-500",
    diagnosis: "Global Developmental Delay", referralSource: "Dr. Patel, Neurology",
    lastVisit: null, totalSessions: 0,
  },
];

const cptColors = { '97166': 'blue', '96112': 'purple', '97530': 'green' };
const statusColors = { 'Completed': 'green', 'In Progress': 'blue', 'Scheduled': 'gray' };

export default function PatientsPage({ onSelectPatient }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Initial Evaluation', 'Follow-Up', 'Standardized Assessment'];

  const filtered = allPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.diagnosis || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.encounterType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
          <p className="text-slate-500 text-sm mt-0.5">{allPatients.length} patients on caseload</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Patient
        </button>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or diagnosis..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all" onClick={() => onSelectPatient && onSelectPatient(p)}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full ${p.avatarColor} flex items-center justify-center text-white font-bold shrink-0`}>
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">Age {p.age} · DOB {p.dob}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{p.diagnosis || 'No diagnosis on file'}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 shrink-0 mt-1" />
              </div>

              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> Next: {p.sessionDate} at {p.sessionTime}</span>
                  <Badge variant={statusColors[p.status]}>{p.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FileText size={12} /> {p.encounterType}</span>
                  <Badge variant={cptColors[p.cptCode] || 'gray'}>{p.cptCode}</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={12} /> {p.referralSource || 'No referral on file'}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{p.totalSessions ?? patients.find(x => x.id === p.id)?.goals?.length ?? 0} sessions total</span>
                <span>Last visit: {p.lastVisit || 'First visit'}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
