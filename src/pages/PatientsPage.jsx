import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { patients as seedPatients } from '../data/mockData';

const basePatients = [
  ...seedPatients,
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

const statusBadge = {
  'Completed':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'In Progress':   'bg-blue-50 text-blue-700 border border-blue-200',
  'Scheduled':     'bg-slate-100 text-slate-600 border border-slate-200',
  'Pending Review':'bg-amber-50 text-amber-700 border border-amber-200',
  'Draft':         'bg-orange-50 text-orange-600 border border-orange-200',
  'Finalized':     'bg-purple-50 text-purple-700 border border-purple-200',
};

export default function PatientsPage({ onSelectPatient, onNewSession, extraPatients }) {
  const [allPatients, setAllPatients] = useState([...(extraPatients || []), ...basePatients]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Scheduled', 'In Progress', 'Completed'];

  const filtered = allPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSessionCreated = (newPatient) => {
    setAllPatients(prev => [newPatient, ...prev]);
    onSelectPatient && onSelectPatient(newPatient);
  };
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">OT CoPilot</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Allocated Credits</p>
          <p className="text-3xl font-bold text-blue-600">630</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Remaining Credits</p>
          <p className="text-3xl font-bold text-red-500">7</p>
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div />
        <button
          onClick={() => onNewSession && onNewSession()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Start New Session
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </div>
        <div className="flex gap-1">
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

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Patient No.', 'Patient Name', 'Encounter Type', 'CPT Code', 'Visit Date', 'Status', 'Actions'].map(col => (
                <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-slate-400 text-sm">
                  No patients found.
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="px-5 py-4 text-slate-400 text-xs font-mono">{String(i + 1).padStart(3, '0')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {p.avatar}
                      </div>
                      <span className="font-semibold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p.encounterType}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 font-mono">{p.cptCode}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{p.sessionDate}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[p.status] || statusBadge['Scheduled']}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onSelectPatient && onSelectPatient(p)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors group-hover:underline"
                    >
                      <FileText size={13} /> Open Note
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
