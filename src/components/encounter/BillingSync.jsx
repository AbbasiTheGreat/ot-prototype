import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, CheckCircle2, AlertTriangle, DollarSign, User } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function BillingSync({ patient }) {
  const [startTime, setStartTime] = useState(patient.startTime || '09:00');
  const [endTime, setEndTime] = useState(patient.endTime || '09:45');
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const duration = () => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    return mins > 0 ? mins : 0;
  };

  const units = () => Math.floor(duration() / 15);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setSynced(true); }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Patient Info Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-slate-500" />
            <h3 className="font-semibold text-slate-800">Patient Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Patient', value: patient.name },
              { label: 'Date of Birth', value: patient.dob },
              { label: 'Age', value: `${patient.age} years` },
              { label: 'Therapist', value: patient.therapist },
              { label: 'Diagnosis', value: patient.diagnosis || '—' },
              { label: 'Referral Source', value: patient.referralSource || '—' },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 truncate" title={item.value}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Time Entry */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-blue-500" />
            <h3 className="font-semibold text-slate-800">Session Time Entry</h3>
            <Badge variant="blue">{patient.cptCode}</Badge>
            <Badge variant={patient.cptCode === '97166' ? 'blue' : patient.cptCode === '96112' ? 'purple' : 'green'}>
              {patient.encounterType}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => { setStartTime(e.target.value); setSynced(false); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => { setEndTime(e.target.value); setSynced(false); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Duration', value: `${duration()} min` },
              { label: 'CPT Code', value: patient.cptCode },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-lg px-3 py-2.5 text-center">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          <Button
            variant={synced ? 'success' : 'primary'}
            className="w-full justify-center"
            onClick={handleSync}
            disabled={syncing || synced}
          >
            {syncing ? (
              <><RefreshCw size={15} className="animate-spin" /> Syncing to Orders/Services...</>
            ) : synced ? (
              <><CheckCircle2 size={15} /> Synced to Orders/Services</>
            ) : (
              <><RefreshCw size={15} /> Sync to Orders/Services</>
            )}
          </Button>

          {synced && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-600 text-center mt-2">
              ✓ Time entry automatically updated — no duplicate entry needed
            </motion.p>
          )}
        </Card>
      </motion.div>

      {/* Orders/Services Preview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-emerald-500" />
            <h3 className="font-semibold text-slate-800">Orders / Services</h3>
            {synced && <Badge variant="green">Auto-Updated</Badge>}
          </div>
          <div className="space-y-2">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${synced ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{patient.cptCode} — {patient.encounterType}</p>
                <p className="text-xs text-slate-400 mt-0.5">{startTime} – {endTime}</p>
              </div>
              {synced
                ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                : <AlertTriangle size={16} className="text-orange-400 shrink-0" />
              }
            </div>
          </div>
          {!synced && (
            <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
              <AlertTriangle size={12} /> Times not yet synced — click Sync above to update billing
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
