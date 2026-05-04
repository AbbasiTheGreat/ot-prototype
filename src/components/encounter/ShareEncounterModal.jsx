import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Mail, Copy, CheckCircle2, Share2 } from 'lucide-react';

/**
 * ShareEncounterModal
 * Allows a therapist to share or grant access to a specific encounter
 * directly from the landing page (as requested in MoM 29/04/2026).
 */
export default function ShareEncounterModal({ patient, onClose }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  // Simulated shareable link
  const shareLink = `https://otcopilot.app/encounter/${patient.id}?token=share-${patient.id}-${Date.now()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Simulated send
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(''); }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-blue-500" />
            <p className="font-bold text-slate-800">Share Encounter</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Patient info */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className={`w-9 h-9 rounded-full ${patient.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {patient.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{patient.name}</p>
              <p className="text-xs text-slate-400">{patient.encounterType} · {patient.sessionDate}</p>
            </div>
          </div>

          {/* Copy link */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <Link2 size={12} /> Shareable Link
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 truncate font-mono">
                {shareLink}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  copied
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? <><CheckCircle2 size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Anyone with this link can view this encounter (read-only).</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">or send via email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Email share */}
          <form onSubmit={handleSendEmail} className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Mail size={12} /> Grant Access by Email
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="colleague@clinic.com"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  sent
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {sent ? '✓ Sent!' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-slate-400">They'll receive a link to view this encounter.</p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
