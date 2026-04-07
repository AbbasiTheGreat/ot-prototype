import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, FileText, Palette, Save, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Mitchell',
    credential: 'OTR/L',
    email: 'sarah.mitchell@eliterehab.com',
    phone: '(555) 012-3456',
    facility: 'Elite Rehabilitation Center',
    npi: '1234567890',
  });

  const [notifications, setNotifications] = useState({
    complianceAlerts: true,
    sessionReminders: true,
    goalDueReminders: true,
    weeklyReport: false,
    emailDigest: true,
  });

  const [preferences, setPreferences] = useState({
    defaultLanding: 'services',
    autoSaveNotes: true,
    showAiTips: true,
    voiceToText: false,
    defaultGoalTimeframe: '6 months',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your profile, preferences, and notifications</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={17} className="text-blue-500" />
            <h2 className="font-semibold text-slate-800">Therapist Profile</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'name' },
              { label: 'Credential', key: 'credential' },
              { label: 'Email', key: 'email' },
              { label: 'Phone', key: 'phone' },
              { label: 'Facility', key: 'facility' },
              { label: 'NPI Number', key: 'npi' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{field.label}</label>
                <input
                  value={profile[field.key]}
                  onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={17} className="text-blue-500" />
            <h2 className="font-semibold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'complianceAlerts', label: 'Compliance Alerts', desc: 'Notify when Fall Risk or Outcome Measures are incomplete' },
              { key: 'sessionReminders', label: 'Session Reminders', desc: 'Remind 15 minutes before each scheduled session' },
              { key: 'goalDueReminders', label: 'Goal Due Reminders', desc: 'Alert when therapy goals are approaching their 6-month review date' },
              { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Receive a weekly email summary of notes and compliance' },
              { key: 'emailDigest', label: 'Daily Email Digest', desc: 'Morning summary of today\'s schedule and pending tasks' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={notifications[item.key]} onChange={v => setNotifications(prev => ({ ...prev, [item.key]: v }))} />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={17} className="text-blue-500" />
            <h2 className="font-semibold text-slate-800">Documentation Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'autoSaveNotes', label: 'Auto-Save Notes', desc: 'Automatically save note drafts every 2 minutes' },
              { key: 'showAiTips', label: 'Show AI Tips', desc: 'Display AI documentation suggestions in SOAP sections' },
              { key: 'voiceToText', label: 'Voice-to-Text', desc: 'Enable microphone input for hands-free documentation' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={preferences[item.key]} onChange={v => setPreferences(prev => ({ ...prev, [item.key]: v }))} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Default Goal Timeframe</label>
              <select
                value={preferences.defaultGoalTimeframe}
                onChange={e => setPreferences(prev => ({ ...prev, defaultGoalTimeframe: e.target.value }))}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option>3 months</option>
                <option>6 months</option>
                <option>12 months</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Compliance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={17} className="text-blue-500" />
            <h2 className="font-semibold text-slate-800">Compliance Rules</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Humpty Dumpty Fall Risk', desc: 'Required for CPT 97166 — Initial Evaluation', enforced: true },
              { label: 'Outcome Measure Completion', desc: 'Required for CPT 96112 / 96113 — Standardized Assessment', enforced: true },
              { label: 'Block finalization if incomplete', desc: 'Prevent note sign-off until all required items are checked', enforced: true },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 px-4 py-3 bg-slate-50 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <span className="ml-auto text-xs text-emerald-600 font-medium shrink-0">Enforced</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="flex justify-end pb-6">
        <Button variant={saved ? 'success' : 'primary'} onClick={handleSave} size="lg">
          {saved ? <><CheckCircle2 size={16} /> Saved</> : <><Save size={16} /> Save Changes</>}
        </Button>
      </div>
    </div>
  );
}
