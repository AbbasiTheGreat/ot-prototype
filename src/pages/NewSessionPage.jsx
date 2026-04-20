import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Sparkles, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

const encounterTypes = [
  { label: 'Initial Evaluation', cpt: '97166' },
  { label: 'Standardized Assessment', cpt: '96112' },
  { label: 'Follow-Up', cpt: '97530' },
];

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

function PatientInfoStep({ onNext }) {
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
    onNext({ ...form, cptCode: cpt, avatar: initials, avatarColor: 'bg-blue-500', age, id: Date.now(), sessionDate: form.visitDate });
  };

  return (
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

      <div className="flex flex-col gap-3">
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
          Continue to Recording <ChevronRight size={15} />
        </button>
        <button
          type="button"
          onClick={() => {
            const errs = {};
            if (!form.name.trim()) errs.name = 'Required';
            if (!form.dob) errs.dob = 'Required';
            if (Object.keys(errs).length) { setErrors(errs); return; }
            const initials = form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const age = new Date().getFullYear() - new Date(form.dob).getFullYear();
            onNext({ ...form, cptCode: encounterTypes.find(e => e.label === form.encounterType)?.cpt || '97166', avatar: initials, avatarColor: 'bg-blue-500', age, id: Date.now(), sessionDate: form.visitDate, inputMode: 'manual' });
          }}
          className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Manual Typing
        </button>
      </div>
    </form>
  );
}

function RecordingStep({ patient, onDone }) {
  const [phase, setPhase] = useState('prompt');
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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 space-y-1">
        <p><span className="font-medium text-slate-700">Patient:</span> {patient.name}</p>
        <p><span className="font-medium text-slate-700">Encounter:</span> {patient.encounterType} · CPT {patient.cptCode}</p>
        <p><span className="font-medium text-slate-700">Visit Date:</span> {patient.visitDate}</p>
      </div>

      {phase === 'prompt' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5 py-8">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200">
            <Mic size={36} className="text-blue-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-800 text-lg">Activate microphone</p>
            <p className="text-slate-500 text-sm mt-1">
              {supported ? 'Click below to start recording the session conversation.' : 'Speech recognition not supported. Use Chrome or Edge.'}
            </p>
          </div>
          <button
            disabled={!supported}
            onClick={startListening}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Mic size={15} /> Start Recording
          </button>
        </motion.div>
      )}

      {phase === 'listening' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Mic size={36} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
            </div>
            <p className="text-red-600 font-semibold">Recording in progress...</p>
          </div>
          {(transcript || interimText) && (
            <div className="bg-slate-800 rounded-xl p-4 max-h-40 overflow-y-auto">
              <p className="text-xs text-slate-400 mb-1">Live transcript</p>
              <p className="text-slate-200 text-sm leading-relaxed">
                {transcript}<span className="text-slate-500 italic">{interimText}</span>
              </p>
            </div>
          )}
          <button onClick={stopAndProcess} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
            <MicOff size={15} /> Stop & Map to SOAP Note
          </button>
        </motion.div>
      )}

      {phase === 'processing' && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Loader2 size={40} className="text-blue-500 animate-spin" />
          <p className="text-slate-600 font-medium">Mapping voice transcript to SOAP note...</p>
        </div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 py-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-800 text-lg">Recording complete</p>
            <p className="text-slate-500 text-sm mt-1">Voice transcript has been mapped to SOAP sections.</p>
          </div>
          {transcript && (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-32 overflow-y-auto">
              <p className="text-xs text-slate-400 mb-1 font-medium">Recorded transcript</p>
              <p className="text-xs text-slate-600 leading-relaxed">{transcript}</p>
            </div>
          )}
          <button
            onClick={() => onDone(buildSoapFromVoice(transcriptRef.current))}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={15} /> Open SOAP Note
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function NewSessionPage({ onBack, onSessionCreated }) {
  const [step, setStep] = useState('info'); // 'info' | 'record' | 'manual'
  const [patientData, setPatientData] = useState(null);

  const handleDone = (soap) => {
    const today = new Date().toISOString().split('T')[0];
    onSessionCreated({
      ...patientData,
      soap,
      sessionDate: patientData.visitDate || today,
      sessionTime: patientData.startTime,
      status: 'In Progress',
      therapist: 'Sarah Mitchell, OTR/L',
      goals: [],
      compliance: { fallRisk: false, outcomeMeasure: false, goalsReviewed: false, therapistSignoff: false },
    });
  };

  const handlePatientNext = (data) => {
    setPatientData(data);
    setStep(data.inputMode === 'manual' ? 'manual' : 'record');
  };

  const stepLabel = {
    info:   'Step 1 of 2 — Patient Information',
    record: 'Step 2 of 2 — Voice Recording',
    manual: 'Step 2 of 2 — Manual Entry',
  };

  return (
    <div className="min-h-full bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => step === 'info' ? onBack() : setStep('info')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <div>
          <p className="font-bold text-slate-800">New Session</p>
          <p className="text-xs text-slate-400 mt-0.5">{stepLabel[step]}</p>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-2 px-8 pt-6 max-w-xl mx-auto">
        {['info', 'next'].map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${step === 'info' && i === 0 ? 'bg-blue-500' : step !== 'info' ? 'bg-blue-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="px-8 py-8">
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
          {step === 'manual' && (
            <motion.div key="manual" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <div className="max-w-xl mx-auto space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 space-y-1">
                  <p><span className="font-medium text-slate-700">Patient:</span> {patientData?.name}</p>
                  <p><span className="font-medium text-slate-700">Encounter:</span> {patientData?.encounterType} · CPT {patientData?.cptCode}</p>
                </div>
                <p className="text-sm text-slate-500 text-center">The SOAP note editor will open with empty sections ready for manual input.</p>
                <button
                  onClick={() => handleDone({ subjective: '', objective: '', assessment: '', plan: '' })}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Open SOAP Note Editor
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
