import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, CheckCircle2, Circle, AlertTriangle, Lock, Unlock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function ComplianceGate({ patient, onFinalize, onAllComplete, onIncomplete }) {
  const needs97166 = patient.cptCode === '97166';
  const needs96112 = patient.cptCode === '96112' || patient.cptCode === '96113';

  const [checks, setChecks] = useState({
    fallRisk: patient.compliance?.fallRisk || false,
    outcomeMeasure: patient.compliance?.outcomeMeasure || false,
    goalsReviewed: patient.compliance?.goalsReviewed || false,
    therapistSignoff: patient.compliance?.therapistSignoff || false,
  });

  const toggle = (key) => {
    setChecks(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      const allDone = items.filter(i => i.required).every(i => updated[i.key]);
      if (allDone && onAllComplete) onAllComplete();
      if (!allDone && onIncomplete) onIncomplete();
      return updated;
    });
  };

  const items = [
    ...(needs97166 ? [{
      key: 'fallRisk',
      label: 'Humpty Dumpty Fall Risk Assessment',
      desc: 'Required for CPT 97166 — Initial Evaluation',      required: true,
    }] : []),
    ...(needs96112 ? [{
      key: 'outcomeMeasure',
      label: 'Outcome Measure Completion',
      desc: 'Required for CPT 96112/96113 — Standardised Assessment',
      required: true,
    }] : []),
    {
      key: 'goalsReviewed',
      label: 'Goals Reviewed & Approved',
      desc: 'Therapist has reviewed and approved all suggested goals',      required: true,
    },
    {
      key: 'therapistSignoff',
      label: 'Therapist Clinical Sign-Off',
      desc: 'I confirm this note reflects my clinical judgement and is accurate',
      required: true,
    },
  ];

  const requiredItems = items.filter(i => i.required);
  const allComplete = requiredItems.every(i => checks[i.key]);
  const completedCount = requiredItems.filter(i => checks[i.key]).length;

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${allComplete ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}
      >
        {allComplete
          ? <ShieldCheck size={20} className="text-blue-500 shrink-0" />
          : <ShieldAlert size={20} className="text-slate-400 shrink-0" />
        }
        <div className="flex-1">
          <p className={`text-sm font-semibold ${allComplete ? 'text-blue-700' : 'text-slate-700'}`}>
            {allComplete ? 'All compliance requirements met' : `${completedCount} of ${requiredItems.length} requirements complete`}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {allComplete ? 'Note is ready to finalise' : 'Complete all items below before finalising the note'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-700">{completedCount}<span className="text-sm text-slate-400">/{requiredItems.length}</span></p>
        </div>
      </motion.div>

      {/* Checklist */}
      <Card className="divide-y divide-slate-100 overflow-hidden">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => toggle(item.key)}
            className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="shrink-0">
              {checks[item.key]
                ? <CheckCircle2 size={22} className="text-green-500" />
                : <Circle size={22} className="text-slate-300" />
              }
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${checks[item.key] ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {item.label}
                </p>
                <Badge variant={checks[item.key] ? 'green' : 'red'}>{item.required ? 'Required' : 'Optional'}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </Card>

      {/* Block message */}
      <AnimatePresence>
        {!allComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <Lock size={15} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-600">Note finalisation is blocked until all required items are completed.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finalize */}
      <Button
        variant={allComplete ? 'success' : 'secondary'}
        disabled={!allComplete}
        className="w-full justify-center py-3"
        onClick={onFinalize}
      >
        {allComplete
          ? <><Unlock size={16} /> Finalise &amp; Sign Note</>
          : <><Lock size={16} /> Complete All Requirements to Finalise</>
        }
      </Button>
    </div>
  );
}
