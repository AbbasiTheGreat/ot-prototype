import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Calendar, FileText, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SOAPEditor from '../components/encounter/SOAPEditor';
import BillingSync from '../components/encounter/BillingSync';
import ComplianceGate from '../components/encounter/ComplianceGate';
import GoalsPanel from '../components/encounter/GoalsPanel';

const tabs = [
  { id: 'services', label: 'Services', icon: FileText },
  { id: 'soap', label: 'SOAP Note', icon: FileText },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
];

const encounterColors = {
  '97166': { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Initial Evaluation' },
  '96112': { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Standardised Assessment' },
  '97530': { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Follow-Up' },
};

export default function EncounterView({ patient, onBack, onNextPatient, nextPatient }) {
  const [activeTab, setActiveTab] = useState('services');
  const [finalized, setFinalized] = useState(false);
  const [complianceDone, setComplianceDone] = useState(
    !!(patient.compliance?.therapistSignoff)
  );
  const enc = encounterColors[patient.cptCode] || encounterColors['97530'];

  if (finalized) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Note Finalised</h2>
          <p className="text-slate-500 mb-1">{patient.name} · {patient.encounterType}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onBack} variant="secondary"><ArrowLeft size={15} /> Back to Dashboard</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm transition-colors shrink-0">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="w-px h-5 bg-slate-200 shrink-0" />

          {/* Encounter type banner */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${enc.light} border ${enc.border} shrink-0`}>
            <div className={`w-2 h-2 rounded-full ${enc.bg}`} />
            <span className={`text-xs font-semibold ${enc.text}`}>{enc.label}</span>
            <span className={`text-xs ${enc.text} opacity-70`}>CPT {patient.cptCode}</span>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-slate-800">{patient.name}</h2>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1"><User size={11} /> Age {patient.age}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> {patient.sessionDate}</span>
                <span className="truncate">{patient.therapist}</span>
              </p>
            </div>
          </div>

          {/* Compliance status pill — always visible */}
          {complianceDone ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg shrink-0">
              <CheckCircle2 size={13} className="text-blue-500" />
              <span className="text-xs font-medium text-blue-700">Compliance Complete</span>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('compliance')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg shrink-0 hover:bg-red-100 transition-colors"
            >
              <ShieldCheck size={13} className="text-red-500" />
              <span className="text-xs font-medium text-red-700">Compliance Pending</span>
            </button>
          )}
        </div>

        {/* Clickable tabs row */}
        <div className="flex gap-1 mt-3">
          {[
          { id: 'services', label: 'Services', icon: FileText },
            { id: 'soap', label: 'SOAP Note', icon: FileText },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="max-w-3xl mx-auto"
          >
            {activeTab === 'services' && <BillingSync patient={patient} />}
            {activeTab === 'soap' && <SOAPEditor patient={patient} onComplete={() => setActiveTab('goals')} />}
            {activeTab === 'goals' && <GoalsPanel patient={patient} onComplete={() => setActiveTab('compliance')} />}
            {activeTab === 'compliance' && <ComplianceGate patient={patient} onFinalize={() => setFinalized(true)} onAllComplete={() => setComplianceDone(true)} onIncomplete={() => setComplianceDone(false)} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
