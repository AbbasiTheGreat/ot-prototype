import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Copy, CheckCircle2, Share2, UserCheck, Edit3, Eye } from 'lucide-react';

/**
 * ShareEncounterModal
 * Lets a therapist give another therapist access to a specific encounter.
 * Access level: Can Edit & Complete (full access — they can write notes, update goals, finalise).
 */

const ACCESS_LEVELS = [
  {
    value: 'edit',
    icon: Edit3,
    label: 'Can Edit & Complete',
    desc: 'They can write SOAP notes, update goals, and finalise this encounter.',
  },
  {
    value: 'view',
    icon: Eye,
    label: 'Can View Only',
    desc: 'They can read the encounter but cannot make any changes.',
  },
];

export default function ShareEncounterModal({ patient, onClose }) {
  const [accessLevel, setAccessLevel] = useState('edit');
  const [email, setEmail]             = useState('');
  const [emailError, setEmailError]   = useState('');
  const [sent, setSent]               = useState(false);
  const [copied, setCopied]           = useState(false);

  const shareLink = `https://otcopilot.app/encounter/${patient.id}?access=${accessLevel}&token=share-${patient.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Please enter an email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(''); }, 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-blue-500" />
            <p className="font-bold text-slate-800">Give Access to This Encounter</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Which encounter */}
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className={`w-10 h-10 rounded-full ${patient.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
              {patient.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{patient.name}</p>
              <p className="text-xs text-slate-500">{patient.encounterType} · {patient.sessionDate}</p>
            </div>
          </div>

          {/* Step 1 — Choose access level */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              Step 1 — What should they be able to do?
            </p>
            <div className="space-y-2">
              {ACCESS_LEVELS.map(level => {
                const Icon = level.icon;
                const selected = accessLevel === level.value;
                return (
                  <button
                    key={level.value}
                    onClick={() => setAccessLevel(level.value)}
                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${selected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${selected ? 'text-blue-700' : 'text-slate-700'}`}>
                        {level.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{level.desc}</p>
                    </div>
                    {selected && <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — Send by email */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              Step 2 — Enter the therapist's email address
            </p>
            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); setSent(false); }}
                  placeholder="therapist@clinic.com"
                  className={`flex-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${
                    emailError ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                    sent
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {sent
                    ? <><CheckCircle2 size={14} /> Sent!</>
                    : <><Mail size={14} /> Send</>
                  }
                </button>
              </div>
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
              {sent && (
                <p className="text-xs text-green-600 flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  Access link sent to <strong>{email}</strong>. They can now {accessLevel === 'edit' ? 'edit and complete' : 'view'} this encounter.
                </p>
              )}
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">or copy the link manually</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Copy link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-400 truncate font-mono">
              {shareLink}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                copied
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {copied ? <><CheckCircle2 size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
            </button>
          </div>

          {/* Done */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Done
          </button>

        </div>
      </motion.div>
    </div>
  );
}
