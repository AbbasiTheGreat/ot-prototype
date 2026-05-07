import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Share2, Clock, Calendar,
  Search, Users, UserCheck, UserX, UserMinus, ChevronDown,
} from 'lucide-react';
import { patients as seedPatients } from '../data/mockData';
import ShareEncounterModal from '../components/encounter/ShareEncounterModal';

// ─── Base patients ────────────────────────────────────────────────────────────
const basePatients = [
  ...seedPatients,
  {
    id: 6, name: "Sofia Ramirez", age: 8, dob: "2017-06-12", cptCode: "97530",
    encounterType: "Follow-Up", sessionDate: "2026-04-08", sessionTime: "09:30",
    therapist: "Sarah Mitchell, OTR/L", status: "Scheduled",
    avatar: "SR", avatarColor: "bg-blue-500",
    diagnosis: "Fine Motor Delay", referralSource: "Dr. Chen, Pediatrics",
    lastVisit: "2026-03-30", totalSessions: 12,
    school: "Maplewood Academy", checkInStatus: "not-arrived",
  },
  {
    id: 7, name: "Noah Williams", age: 10, dob: "2015-11-20", cptCode: "97166",
    encounterType: "Initial Evaluation", sessionDate: "2026-04-09", sessionTime: "11:00",
    therapist: "Sarah Mitchell, OTR/L", status: "Scheduled",
    avatar: "NW", avatarColor: "bg-blue-500",
    diagnosis: "ADHD, Handwriting Difficulties", referralSource: "School Referral",
    lastVisit: null, totalSessions: 0,
    school: "Greenwood Elementary", checkInStatus: "not-arrived",
  },
  {
    id: 8, name: "Amara Johnson", age: 3, dob: "2022-09-05", cptCode: "97166",
    encounterType: "Initial Evaluation", sessionDate: "2026-04-10", sessionTime: "14:00",
    therapist: "Sarah Mitchell, OTR/L", status: "Scheduled",
    avatar: "AJ", avatarColor: "bg-blue-500",
    diagnosis: "Global Developmental Delay", referralSource: "Dr. Patel, Neurology",
    lastVisit: null, totalSessions: 0,
    school: "Sunrise Preschool", checkInStatus: "not-arrived",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const TODAY = "2026-04-06";

const statusBadge = {
  'Completed':      'bg-blue-50 text-blue-700 border border-blue-200',
  'In Progress':    'bg-slate-100 text-slate-600 border border-slate-200',
  'Scheduled':      'bg-slate-100 text-slate-600 border border-slate-200',
  'Pending Review': 'bg-red-50 text-red-700 border border-red-200',
  'Draft':          'bg-red-50 text-red-700 border border-red-200',
  'Finalized':      'bg-blue-50 text-blue-700 border border-blue-200',
};

// Check-in states — clear labels a clinician immediately understands
const checkInConfig = {
  'checked-in': {
    label: 'Checked In',
    nextLabel: 'Mark as Checked Out',
    icon: UserCheck,
    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500',
  },
  'checked-out': {
    label: 'Checked Out',
    nextLabel: 'Mark as Not Arrived',
    icon: UserX,
    bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600', dot: 'bg-slate-400',
  },
  'not-arrived': {
    label: 'Not Arrived',
    nextLabel: 'Mark as Checked In',
    icon: UserMinus,
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400',
  },
};

const CHECK_IN_CYCLE = ['not-arrived', 'checked-in', 'checked-out'];

const DATE_FILTERS = [
  { label: 'Today',     value: 'today'     },
  { label: 'This Week', value: 'this-week' },
  { label: 'All Dates', value: 'all'       },
];

const STATUS_FILTERS = ['All', 'Scheduled', 'In Progress', 'Completed'];

function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  return d >= new Date('2026-04-06') && d <= new Date('2026-04-12');
}

// ─── Check-in button — shows current state + tooltip of what clicking will do ─
function CheckInButton({ status, onToggle }) {
  const cfg = checkInConfig[status] || checkInConfig['not-arrived'];
  const Icon = cfg.icon;
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      title={cfg.nextLabel}           // tooltip tells clinician exactly what will happen
      aria-label={cfg.nextLabel}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:shadow-sm active:scale-95 ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <Icon size={13} />
      {cfg.label}
      {/* Small chevron hint that this is clickable / changeable */}
      <ChevronDown size={10} className="opacity-50" />
    </button>
  );
}

// ─── Today's encounter row ────────────────────────────────────────────────────
function DailyEncounterRow({ patient, index, onOpen, onShare, onCheckInToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50/30 transition-colors group border-b border-slate-100 last:border-0"
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full ${patient.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
        {patient.avatar}
      </div>

      {/* Patient info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
          {patient.name}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {patient.encounterType}
          {patient.school && <> · {patient.school}</>}
        </p>
      </div>

      {/* Session time */}
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-1 justify-end">
          <Clock size={12} className="text-slate-400" />
          {patient.sessionTime}
        </p>
        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge[patient.status] || statusBadge['Scheduled']}`}>
          {patient.status}
        </span>
      </div>

      {/* Check-in — labelled button, tooltip explains what clicking does */}
      <div className="shrink-0">
        <CheckInButton
          status={patient.checkInStatus || 'not-arrived'}
          onToggle={() => onCheckInToggle(patient.id)}
        />
      </div>

      {/* Actions — both labelled, no icon-only buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onShare(patient); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Share2 size={13} />
          Share
        </button>
        <button
          onClick={() => onOpen(patient)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <FileText size={13} />
          Open Note
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PatientsPage({ onSelectPatient, onNewSession, extraPatients }) {
  const [allPatients, setAllPatients] = useState([
    ...(extraPatients || []),
    ...basePatients,
  ]);

  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter]     = useState('all');
  const [shareTarget, setShareTarget]   = useState(null);

  // Today's encounters — always fixed to today, not affected by filters
  const todayEncounters = allPatients.filter(p => p.sessionDate === TODAY);

  // All encounters table — filtered
  // Search covers both patient name and school name
  const filteredAll = allPatients.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.school || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchDate =
      dateFilter === 'all'       ? true :
      dateFilter === 'today'     ? p.sessionDate === TODAY :
      dateFilter === 'this-week' ? isThisWeek(p.sessionDate) : true;
    return matchSearch && matchStatus && matchDate;
  });

  // Cycle check-in status on click
  const handleCheckInToggle = (patientId) => {
    setAllPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const current = p.checkInStatus || 'not-arrived';
      const idx = CHECK_IN_CYCLE.indexOf(current);
      const next = CHECK_IN_CYCLE[(idx + 1) % CHECK_IN_CYCLE.length];
      return { ...p, checkInStatus: next };
    }));
  };

  // Summary counts for today's header
  const checkedInCount  = todayEncounters.filter(p => p.checkInStatus === 'checked-in').length;
  const checkedOutCount = todayEncounters.filter(p => p.checkInStatus === 'checked-out').length;
  const notArrivedCount = todayEncounters.filter(p => p.checkInStatus === 'not-arrived').length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">OT CoPilot</h1>
        <button
          onClick={() => onNewSession && onNewSession()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          + Start New Session
        </button>
      </div>

      {/* ── Credit cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Allocated Credits</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">630</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Remaining Credits</p>
          <p className="text-3xl font-bold text-red-500 mt-1">7</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TODAY'S ENCOUNTERS
          — always shows today's sessions at the top of the page
          — check-in status and share are accessible directly from here
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Header with attendance summary */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              <h2 className="font-semibold text-slate-800">Today's Encounters</h2>
              <span className="text-xs text-slate-400">Monday, April 6, 2026</span>
            </div>

            {/* Attendance summary — full words so clinicians understand at a glance */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-green-50 border border-green-200 text-green-700">
                <UserCheck size={12} />
                {checkedInCount} Checked In
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 border border-slate-200 text-slate-600">
                <UserX size={12} />
                {checkedOutCount} Checked Out
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700">
                <UserMinus size={12} />
                {notArrivedCount} Not Yet Arrived
              </span>
            </div>
          </div>

          {/* Instruction hint — one line so clinicians know what to do */}
          <p className="text-xs text-slate-400 mt-2">
            Click a patient's check-in status to update it. Use <strong>Share</strong> to give a colleague access to a specific encounter.
          </p>
        </div>

        {/* Encounter rows */}
        {todayEncounters.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 text-sm">
            No encounters scheduled for today.
          </div>
        ) : (
          todayEncounters.map((p, i) => (
            <DailyEncounterRow
              key={p.id}
              patient={p}
              index={i}
              onOpen={onSelectPatient}
              onShare={setShareTarget}
              onCheckInToggle={handleCheckInToggle}
            />
          ))
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ALL ENCOUNTERS — searchable, filterable list
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">All Encounters</h2>
          </div>

          {/* Filter row — grouped logically with clear labels */}
          <div className="flex flex-wrap gap-3 items-center">

            {/* Search — covers patient name and school name */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by patient name or school..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              />
            </div>

            {/* Date filter — pill buttons, active state is obvious */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {DATE_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setDateFilter(f.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    dateFilter === f.value
                      ? 'bg-white text-blue-700 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === f
                      ? 'bg-white text-blue-700 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['#', 'Patient Name', 'Encounter Type', 'CPT Code', 'School', 'Visit Date', 'Check-In Status', 'Note Status', 'Actions'].map(col => (
                  <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAll.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-slate-400 text-sm">
                    No encounters match your filters. Try adjusting the date or status above.
                  </td>
                </tr>
              ) : (
                filteredAll.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-4 py-4 text-slate-400 text-xs font-mono">
                      {String(i + 1).padStart(3, '0')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {p.avatar}
                        </div>
                        <span className="font-semibold text-slate-800 whitespace-nowrap">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-xs whitespace-nowrap">{p.encounterType}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 font-mono">
                        {p.cptCode}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {p.school || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">{p.sessionDate}</td>
                    <td className="px-4 py-4">
                      <CheckInButton
                        status={p.checkInStatus || 'not-arrived'}
                        onToggle={() => handleCheckInToggle(p.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge[p.status] || statusBadge['Scheduled']}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShareTarget(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap"
                        >
                          <Share2 size={12} />
                          Share
                        </button>
                        <button
                          onClick={() => onSelectPatient && onSelectPatient(p)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors whitespace-nowrap"
                        >
                          <FileText size={13} />
                          Open Note
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {shareTarget && (
          <ShareEncounterModal
            patient={shareTarget}
            onClose={() => setShareTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
