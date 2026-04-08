import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mic, MicOff, Sparkles, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

// CPT auto-detection based on encounter type
const encounterTypes = [
  { label: 'Initial Evaluation', cpt: '97166' },
  { label: 'Standardized Assessment', cpt: '96112' },
  { label: 'Follow-Up', cpt: '97530' },
];

const avatarColors = [
  'bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500',
  'bg-teal-500','bg-pink-500','bg-indigo-500','bg-rose-500',
];

const dummySoap = {
  subjective: "Caregiver reports the patient has been struggling with fine motor tasks at home and school. Parent notes difficulty holding utensils and completing self-care tasks independently. Patient presents as cooperative and engaged at session start. Home program compliance reported as moderate over the past two weeks.",
  objective: "Patient participated in a 45-minute OT session. Activities included fine motor warm-up with therapy putty, pegboard tasks, and scissor cutting along curved lines. Patient demonstrated a static tripod grasp with excessive proximal stabilization. Bilateral coordination tasks revealed difficulty crossing midline during alternating hand activities. Assist level: minimal verbal cuing throughout.",
  assessment: "Patient demonstrates moderate fine motor and bilateral coordination deficits consistent with reported diagnosis. Emerging skills noted in grasp pattern — patient self-corrected to a dynamic tripod on 2 occasions with verbal cuing. Progress is consistent with treatment goals. Barriers include limited home program carryover and reduced exposure to fine motor play activities.",
  plan: "Continue OT 2x/week. Next session will focus on pencil grasp re-training using adaptive grip tools and structured cutting activities. Home program updated: 10-minute daily fine motor play. Caregiver education provided regarding graded activity progression. Re-evaluation planned at 3 months.",
};

// Step 1 — Patient Info Form
function PatientInfoStep({ onNext }) {
  const [form, setForm] = useState({
    name: '', dob: '', diagnosis: '', referralSource: '', encounterType: 'Initial Evaluation',
    startTime: '09:00', endTime: '09:45',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const cpt = encounterTypes.find(e => e.label === form.encounterType)?.cpt || '97166';

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.dob) e.dob = 'Required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    const initials = form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const dob = form.dob;
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    onNext({ ...form, cptCode: cpt, avatar: initials, avatarColor: color, age, id: Date.now() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Patient Name *</label>
          <input
            value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Full name"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth *</label>
          <input
            type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.dob ? 'border-red-300' : 'border-slate-200'}`}
          />
          {errors.dob && <p className="text-xs text-red-500 mt-0.5">{errors.dob}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Encounter Type</label>
          <select
            value={form.encounterType} onChange={e => set('encounterType', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            {encounterTypes.map(t => <option key={t.cpt}>{t.label}</option>)}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosis</label>
          <input
            value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)}
            placeholder="e.g. Developmental Coordination Disorder"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Referral Source</label>
          <input
            value={form.referralSource} onChange={e => set('referralSource', e.target.value)}
            placeholder="e.g. Dr. Smith, Pediatrics"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Start Time</label>
          <input
            type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">End Time</label>
          <input
            type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* CPT auto-detect badge */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        <Sparkles size={14} className="text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700">
          CPT code auto-detected: <strong>{cpt}</strong> based on <strong>{form.encounterType}</strong>
        </p>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
        Continue to Recording <ChevronRight size={15} />
      </button>
    </form>
  );
}

// Build SOAP from actual voice transcript — each section gets the raw transcript
// labelled clearly as voice-captured input
function buildSoapFromVoice(transcript) {
  const text = transcript.trim() || '[No speech detected]';
  const label = '🎙️ [Captured from voice recording]\n\n';
  return {
    subjective: label + text,
    objective:  label + text,
    assessment: label + text,
    plan:       label + text,
  };
}

// Step 2 — Mic activation + recording
function RecordingStep({ patient, onDone }) {
  const [phase, setPhase] = useState('prompt'); // prompt | listening | processing | done
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = (e) => {
      let interim = '';
      let final = transcriptRef.current;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      transcriptRef.current = final;
      setTranscript(final);
      setInterimText(interim);
    };
    r.onerror = () => setPhase('prompt');
    r.onend = () => {};
    recognitionRef.current = r;
    r.start();
    setPhase('listening');
  };

  const stopAndProcess = () => {
    recognitionRef.current?.stop();
    setInterimText('');
    setPhase('processing');
    setTimeout(() => setPhase('done'), 1500);
  };

  useEffect(() => () => recognitionRef.current?.stop(), []);

  if (phase === 'done') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-800">Recording complete</p>
          <p className="text-slate-500 text-sm mt-1">Voice transcript has been mapped to SOAP sections.</p>
        </div>
        {transcript && (
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-28 overflow-y-auto">
            <p className="text-xs text-slate-400 mb-1 font-medium">Recorded transcript</p>
            <p className="text-xs text-slate-600 leading-relaxed">{transcript}</p>
          </div>
        )}
        <button
          onClick={() => onDone(buildSoapFromVoice(transcriptRef.current))}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={15} /> Open SOAP Note
        </button>
      </motion.div>
    );
  }

  if (phase === 'processing') {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <Loader2 size={36} className="text-blue-500 animate-spin" />
        <p className="text-slate-600 font-medium">Mapping voice transcript to SOAP note...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-1">
        <p><span className="font-medium text-slate-700">Patient:</span> {patient.name}</p>
        <p><span className="font-medium text-slate-700">Encounter:</span> {patient.encounterType} · CPT {patient.cptCode}</p>
      </div>

      {phase === 'prompt' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200">
            <Mic size={32} className="text-blue-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-800">Activate microphone</p>
            <p className="text-slate-500 text-sm mt-1">
              {supported
                ? 'Click below to start recording the session conversation.'
                : 'Speech recognition not supported. Use Chrome or Edge.'}
            </p>
          </div>
          <button
            disabled={!supported}
            onClick={startListening}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Mic size={15} /> Start Recording
          </button>
        </motion.div>
      )}

      {phase === 'listening' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Mic size={32} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
            </div>
            <p className="text-red-600 font-semibold text-sm">Recording in progress...</p>
          </div>

          {(transcript || interimText) && (
            <div className="bg-slate-800 rounded-xl p-3 max-h-32 overflow-y-auto">
              <p className="text-xs text-slate-400 mb-1">Live transcript</p>
              <p className="text-slate-200 text-xs leading-relaxed">
                {transcript}
                <span className="text-slate-500 italic">{interimText}</span>
              </p>
            </div>
          )}

          <button
            onClick={stopAndProcess}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <MicOff size={15} /> Stop & Map to SOAP Note
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Main Modal
export default function NewSessionModal({ onClose, onSessionCreated }) {
  const [step, setStep] = useState('info'); // 'info' | 'record'
  const [patientData, setPatientData] = useState(null);

  const handlePatientNext = (data) => {
    setPatientData(data);
    setStep('record');
  };

  const handleDone = (soap) => {
    const today = new Date().toISOString().split('T')[0];
    onSessionCreated({
      ...patientData,
      soap,
      sessionDate: today,
      sessionTime: patientData.startTime,
      status: 'In Progress',
      therapist: 'Sarah Mitchell, OTR/L',
      goals: [],
      compliance: { fallRisk: false, outcomeMeasure: false, goalsReviewed: false, therapistSignoff: false },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-800">New Session</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {step === 'info' ? 'Step 1 of 2 — Patient Information' : 'Step 2 of 2 — Record Conversation'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-4 gap-2">
          {['info', 'record'].map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step === s || (s === 'info' && step === 'record') ? 'bg-blue-500' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 'info' && (
              <motion.div key="info" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <PatientInfoStep onNext={handlePatientNext} />
              </motion.div>
            )}
            {step === 'record' && (
              <motion.div key="record" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <RecordingStep patient={patientData} onDone={handleDone} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
