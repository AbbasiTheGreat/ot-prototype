import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

function ConnectingAnimation({ onDone }) {
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('success'), 2000);
    const t2 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center gap-6">
          {/* OT Co-Pilot box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl px-6 py-5 flex flex-col items-center gap-2 shadow-xl w-36"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <p className="text-slate-800 font-bold text-sm">OT Co-Pilot</p>
          </motion.div>

          {/* Animated arrows */}
          <div className="flex items-center relative w-28 h-8">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: [0, 1, 0], x: [0, 8, 16] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                className="absolute"
                style={{ left: i * 24 }}
              >
                <ArrowRight size={22} className="text-blue-500" />
              </motion.div>
            ))}
          </div>

          {/* Elite Platform box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl px-6 py-5 flex flex-col items-center gap-2 shadow-xl w-36 transition-all duration-500 ${status === 'success' ? 'bg-blue-500' : 'bg-white'}`}
          >
            {status === 'success' ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <CheckCircle2 size={28} className="text-white" />
              </motion.div>
            ) : (
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs">EP</span>
              </div>
            )}
            <p className={`font-bold text-sm ${status === 'success' ? 'text-white' : 'text-slate-800'}`}>
              Elite Platform
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {status === 'connecting' ? (
            <motion.p key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-500 text-sm">
              Connecting to Elite Platform...
            </motion.p>
          ) : (
            <motion.p key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-blue-600 text-sm font-medium">
              Connected successfully
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ConnectPage({ onConnect }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setConnecting(true);
    } else {
              setError('Invalid credentials. Please try again.');
    }
  };

  if (connecting) {
    return <ConnectingAnimation onDone={onConnect} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-lg leading-tight">OT Co-Pilot</p>
            <p className="text-slate-400 text-xs">Elite Platform Integration</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h1>
        <p className="text-slate-500 text-sm mb-6">Enter your credentials to connect to Elite Platform.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <div className="w-4 h-4 bg-slate-800 rounded flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[9px]">EP</span>
            </div>
            Connect to Elite
          </button>
        </form>
      </motion.div>
    </div>
  );
}
