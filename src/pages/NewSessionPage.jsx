import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

const encounterTypes = [
  { label: 'Initial Evaluation', cpt: '97166' },
  { label: 'Standardised Assessment', cpt: '96112' },
  { label: 'Follow-Up', cpt: '97530' },
];

export default function NewSessionPage({ onBack, onSessionCreated }) {
  const [form, setForm] = useState({
    name: '', dob: '', diagnosis: '', referralSource: '', encounterType: 'Initial Evaluation',
    startTime: '09:00', endTime: '09:45', visitDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const cpt = encounterTypes.find(e => e.label === form.encounterType)?.cpt || '97166';

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.dob) errs.dob = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const initials = form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const age = new Date().getFullYear() - new Date(form.dob).getFullYear();

    onSessionCreated({
      ...form,
      cptCode: cpt,
      avatar: initials,
      avatarColor: 'bg-blue-500',
      age,
      id: Date.now(),
      sessionDate: form.visitDate,
      sessionTime: form.startTime,
      soap: { subjective: '', objective: '', assessment: '', plan: '' },
      status: 'In Progress',
      therapist: 'Sarah Mitchell, OTR/L',
      goals: [],
      compliance: { fallRisk: false, outcomeMeasure: false, goalsReviewed: false, therapistSignoff: false },
    });
  };

  return (
    <div className="min-h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <div>
          <p className="font-bold text-slate-800">New Session</p>
          <p className="text-xs text-slate-400 mt-0.5">Patient Information</p>
        </div>
      </div>

      <div className="px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient Name *</label>
            <input
              value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Full name"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth *</label>
              <input
                type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.dob ? 'border-red-300' : 'border-slate-200'}`}
              />
              {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Encounter Type</label>
              <select
                value={form.encounterType} onChange={e => set('encounterType', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                {encounterTypes.map(t => <option key={t.cpt}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Diagnosis</label>
            <input
              value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)}
              placeholder="e.g. Developmental Coordination Disorder"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Referral Source</label>
            <input
              value={form.referralSource} onChange={e => set('referralSource', e.target.value)}
              placeholder="e.g. Dr. Smith, Pediatrics"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Visit Date</label>
            <input
              type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
              <input
                type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
              <input
                type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <Sparkles size={14} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">
              CPT code auto-detected: <strong>{cpt}</strong> based on <strong>{form.encounterType}</strong>
            </p>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
            Open SOAP Note Editor <ChevronRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
