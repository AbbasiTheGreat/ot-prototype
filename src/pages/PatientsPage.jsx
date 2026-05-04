import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Share2, LogIn, LogOut, Clock, Calendar,
  ChevronDown, Search, Users, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { patients as seedPatients } from '../data/mockData';
import ShareEncounterModal from '../components/encounter/ShareEncounterModal';

// ─── Static base patients (includes the extra ones from before) ───────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TODAY = "2026-04-06";

const statusBadge = {
  'Completed':      'bg-blue-50 text-blue-700 border border-blue-200',
  'In Progress':    'bg-slate-100 text-slate-600 border border-slate-200',
  'Scheduled':      'bg-slate-100 text-slate-600 border border-slate-200',
  'Pending Review': 'bg-red-50 text-red-700 border border-red-200',
  'Draft':          'bg-red-50 text-red-700 border border-red-200',
  'Finalized':      'bg-blue-50 text-blue-700 border border-blue-200',
};

const checkInConfig = {
  'checked-in':  { label: 'Checked In',  icon: LogIn,  bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  dot: 'bg-green-500'  },
  'checked-out': { label: 'Checked Out', icon: LogOut, bg: 'bg-slate-50',  border: 'border-slate-200', text: 'text-slate-600',  dot: 'bg-slate-400'  },
  'not-arrived': { label: 'Not Arrived', icon: Clock,  bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700',  dot: 'bg-amber-400'  },
};

const CHECK_IN_CYCLE = ['not-arrived', 'checked-in', 'checked-out'];

// Collect unique schools from all patients
function getSchools(patients) {
  const schools = [...new Set(patients.map(p => p.school).filter(Boolean))].sort();
  return ['All Schools', ...schools];
}

// Date filter options
const DATE_FILTERS = [
  { label: 'Today',     value: 'today'     },
  { label: 'This Week', value: 'this-week' },
  { label: 'All Dates', value: 'all'       },
];

function isThisWeek(dateStr) {
  // Week of TODAY (2026-04-06, Monday)
  const d = new Date(dateStr);
  const start = new Date('2026-04-06');
  const end   = new Date('2026-04-12');
  return d >= start && d <= end;
}

// ─── Check-in toggle button ───────────────────────────────────────────────────
function CheckInButton({ status, onToggle }) {
  const cfg = checkInConfig[status] || checkInConfig['not-arrived'];
  const Icon = cfg.icon;
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      title="Click to update check-in status"
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      <Icon size={11} />
      {cfg.label}
    </button>
  );
}

// ─── Daily Encounter Row ──────────────────────────────────────────────────────
function DailyEncounterRow({ patient, index, onOpen, onShare, onCheckInToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50/40 transition-colors group border-b border-slate-100 last:border-0"
    >
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full ${patient.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
        {patient.avatar}
      </div>

      {/* Patient info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
            {patient.name}
          </p>
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 font-mono">
            {patient.cptCode}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {patient.encounterType} · Age {patient.age}
          {patient.school && <> · <span className="text-slate-500">{patient.school}</span></>}
        </p>
      </div>

      {/* Session time */}
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-sm font-medium text-slate-600 flex items-center gap-1 justify-end">
          <Clock size={12} className="text-slate-400" />
          {patient.sessionTime}
        </p>
        <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge[patient.status] || statusBadge['Scheduled']}`}>
          {patient.status}
        </span>
      </div>

      {/* Check-in status */}
      <div className="shrink-0">
        <CheckInButton
          status={patient.checkInStatus || 'not-arrived'}
          onToggle={() => onCheckInToggle(patient.id)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onShare(patient); }}
          title="Share this encounter"
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Share2 size={15} />
        </button>
        <button
          onClick={() => onOpen(patient)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <FileText size={12} /> Open Note
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

  // Filters
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [schoolFilter, setSchoolFilter] = useState('All Schools');
  const [dateFilter, setDateFilter]   = useState('today');
  const [shareTarget, setShareTarget] = useState(null); // patient being shared

  const statusFilters = ['All', 'Scheduled', 'In Progress', 'Completed'];
  const schools = getSchools(allPatients);

  // ── Today's encounters (always today's date, unaffected by filters) ──────
  const todayEncounters = allPatients.filter(p => p.sessionDate === TODAY);

  // ── Full list with all filters applied ───────────────────────────────────
  const filteredAll = allPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchSchool = schoolFilter === 'All Schools' || p.school === schoolFilter;
    const matchDate =
      dateFilter === 'all'       ? true :
      dateFilter === 'today'     ? p.sessionDate === TODAY :
      dateFilter === 'this-week' ? isThisWeek(p.sessionDate) : true;
    return matchSearch && matchStatus && matchSchool && matchDate;
  });

  // ── Check-in toggle (cycles: not-arrived → checked-in → checked-out → not-arrived) ──
  const handleCheckInToggle = (patientId) => {
    setAllPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const current = p.checkInStatus || 'not-arrived';
      const idx = CHECK_IN_CYCLE.indexOf(current);
      const next = CHECK_IN_CYCLE[(idx + 1) % CHECK_IN_CYCLE.length];
      return { ...p, checkInStatus: next };
    }));
  };

  // ── Summary counts for today ──────────────────────────────────────────────
  const checkedInCount  = todayEncounters.filter(p => p.checkInStatus === 'checked-in').length;
  const checkedOutCount = todayEncounters.filter(p => p.checkInStatus === 'checked-out').length;
  const pendingCount    = todayEncounters.filter(p => p.checkInStatus === 'not-arrived').length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* ── Page title ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">OT CoPilot</h1>
        <button
          onClick={() => onNewSession && onNewSession()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          + Start New Session
        </button>
      </div>

      {/* ── Credit summary cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Allocated Credits</p>
          <p className="text-3xl font-bold text-blue-600">630</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Remaining Credits</p>
          <p className="text-3xl font-bold text-red-500">7</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — TODAY'S DAILY ENCOUNTERS
          (MoM: "Daily encounters should be displayed on the landing page")
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Section header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            <h2 className="font-semibold text-slate-800">Today's Encounters</h2>
            <span className="text-xs text-slate-400">— Monday, April 6, 2026</span>
          </div>
          {/* Check-in summary pills */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 border border-green-200 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {checkedInCount} In
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {checkedOutCount} Out
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {pendingCount} Pending
            </span>
          </div>
        </div>

        {/* Encounter rows */}
        {todayEncounters.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 text-sm">
            No encounters scheduled for today.
          </div>
        ) : (
          <div>
            {todayEncounters.map((p, i) => (
              <DailyEncounterRow
                key={p.id}
                patient={p}
                index={i}
                onOpen={onSelectPatient}
                onShare={setShareTarget}
                onCheckInToggle={handleCheckInToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — ALL ENCOUNTERS (with filters)
          (MoM: "Filters for schools, dates, and other relevant criteria")
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Section header */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">All Encounters</h2>
          </div>

          {/* ── Filter bar ─────────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by patient name..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              />
            </div>

            {/* Date filter */}
            <div className="flex gap-1">
              {DATE_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setDateFilter(f.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    dateFilter === f.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Calendar size={11} />
                  {f.label}
                </button>
              ))}
            </div>

            {/* School filter */}
            <div className="relative">
              <select
                value={schoolFilter}
                onChange={e => setSchoolFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
              >
                {schools.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Status filter */}
            <div className="flex gap-1">
              {statusFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['#', 'Patient Name', 'Encounter Type', 'CPT Code', 'School', 'Visit Date', 'Check-In', 'Status', 'Actions'].map(col => (
                <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAll.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-16 text-center text-slate-400 text-sm">
                  No encounters match the selected filters.
                </td>
              </tr>
            ) : (
              filteredAll.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  {/* Row number */}
                  <td className="px-4 py-4 text-slate-400 text-xs font-mono">
                    {String(i + 1).padStart(3, '0')}
                  </td>

                  {/* Name */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {p.avatar}
                      </div>
                      <span className="font-semibold text-slate-800">{p.name}</span>
                    </div>
                  </td>

                  {/* Encounter type */}
                  <td className="px-4 py-4 text-slate-600 text-xs">{p.encounterType}</td>

                  {/* CPT code */}
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 font-mono">
                      {p.cptCode}
                    </span>
                  </td>

                  {/* School */}
                  <td className="px-4 py-4 text-slate-500 text-xs">
                    {p.school || <span className="text-slate-300">—</span>}
                  </td>

                  {/* Visit date */}
                  <td className="px-4 py-4 text-slate-500 text-xs">{p.sessionDate}</td>

                  {/* Check-in status */}
                  <td className="px-4 py-4">
                    <CheckInButton
                      status={p.checkInStatus || 'not-arrived'}
                      onToggle={() => handleCheckInToggle(p.id)}
                    />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[p.status] || statusBadge['Scheduled']}`}>
                      {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {/* Share button */}
                      <button
                        onClick={() => setShareTarget(p)}
                        title="Share encounter"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                      {/* Open note */}
                      <button
                        onClick={() => onSelectPatient && onSelectPatient(p)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors group-hover:underline"
                      >
                        <FileText size={13} /> Open Note
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Share Modal ─────────────────────────────────────────────────────── */}
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
