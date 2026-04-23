import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, CheckCircle2, Clock, AlertCircle, Eye, Edit3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { patients } from '../data/mockData';

const notes = [
  {
    id: 1, patientName: "Marcus Thompson", patientAvatar: "MT", avatarColor: "bg-blue-500",
    cptCode: "97530", encounterType: "Follow-Up", date: "2026-04-06",
    status: "Finalized", signedBy: "Sarah Mitchell, OTR/L", signedAt: "2026-04-06 12:45",
    preview: "Marcus demonstrates meaningful progress toward handwriting legibility goal, with a 58% improvement in writing speed since baseline...",
    qualityScore: 94,
  },
  {
    id: 2, patientName: "Aiden Carter", patientAvatar: "AC", avatarColor: "bg-blue-500",
    cptCode: "97166", encounterType: "Initial Evaluation", date: "2026-04-06",
    status: "In Progress", signedBy: null, signedAt: null,
    preview: "Mother reports Aiden has significant difficulty with fine motor tasks at home and school. BOT-2 Fine Motor Composite standard score: 68...",
    qualityScore: 81,
  },
  {
    id: 3, patientName: "Lily Nguyen", patientAvatar: "LN", avatarColor: "bg-blue-500",
    cptCode: "96112", encounterType: "Standardised Assessment", date: "2026-04-06",
    status: "Pending Review", signedBy: null, signedAt: null,
    preview: "Sensory Profile 2 results: Sensory Sensitivity — Much More Than Others. PDMS-2 Grasping Standard Score: 7 (16th percentile)...",
    qualityScore: 88,
  },
  {
    id: 4, patientName: "Marcus Thompson", patientAvatar: "MT", avatarColor: "bg-blue-500",
    cptCode: "97530", encounterType: "Follow-Up", date: "2026-03-30",
    status: "Finalized", signedBy: "Sarah Mitchell, OTR/L", signedAt: "2026-03-30 13:10",
    preview: "Patient demonstrates continued progress in handwriting speed. Timed copying task improved to 32 wpm with 78% legibility...",
    qualityScore: 91,
  },
  {
    id: 5, patientName: "Ethan Brooks", patientAvatar: "EB", avatarColor: "bg-blue-500",
    cptCode: "97530", encounterType: "Follow-Up", date: "2026-03-30",
    status: "Finalized", signedBy: "Sarah Mitchell, OTR/L", signedAt: "2026-03-30 15:20",
    preview: "Ethan tolerated dry rice bin for 3 minutes with no behavioral response. Wet sand tolerance emerging — new milestone this session...",
    qualityScore: 87,
  },
  {
    id: 6, patientName: "Zoe Patel", patientAvatar: "ZP", avatarColor: "bg-blue-500",
    cptCode: "97166", encounterType: "Initial Evaluation", date: "2026-04-06",
    status: "Draft", signedBy: null, signedAt: null,
    preview: "MABC-2 Total Test Score: 5th percentile. Balance: 2nd percentile. Significant postural sway during single-leg stance...",
    qualityScore: 76,
  },
];

const statusConfig = {
  'Finalized': { color: 'green', icon: CheckCircle2 },
  'In Progress': { color: 'blue', icon: Clock },
  'Pending Review': { color: 'yellow', icon: AlertCircle },
  'Draft': { color: 'gray', icon: Edit3 },
};

const cptColors = { '97166': 'blue', '96112': 'purple', '97530': 'green' };

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Finalized', 'In Progress', 'Pending Review', 'Draft'];

  const filtered = notes.filter(n => {
    const matchSearch = n.patientName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || n.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notes</h1>
          <p className="text-slate-500 text-sm mt-0.5">{notes.filter(n => n.status === 'Finalized').length} finalized · {notes.filter(n => n.status !== 'Finalized').length} pending</p>
        </div>
      </motion.div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name..."
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

      <div className="space-y-3">
        {filtered.map((note, i) => {
          const { color, icon: Icon } = statusConfig[note.status];
          return (
            <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${note.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {note.patientAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-slate-800">{note.patientName}</p>
                      <Badge variant={cptColors[note.cptCode] || 'gray'}>{note.cptCode}</Badge>
                      <Badge variant={cptColors[note.cptCode] || 'gray'}>{note.encounterType}</Badge>
                      <Badge variant={color}><Icon size={11} /> {note.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{note.date}{note.signedAt ? ` · Signed ${note.signedAt} by ${note.signedBy}` : ''}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{note.preview}</p>
                  </div>
                  <div className="shrink-0 text-right space-y-2">
                    <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                      <Eye size={12} /> View
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
