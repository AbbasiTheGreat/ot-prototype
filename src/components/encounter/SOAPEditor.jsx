import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Mic, MicOff, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';
import Button from '../ui/Button';
import { soapTemplates, aiSuggestions } from '../../data/mockData';

const sections = [
  { key: 'subjective', label: 'Subjective', short: 'S', color: 'blue', desc: 'Patient/caregiver reported information, home & school progress, concerns' },
  { key: 'objective', label: 'Objective', short: 'O', color: 'teal', desc: 'Activities performed and direct observations only — no interpretation here' },
  { key: 'assessment', label: 'Assessment', short: 'A', color: 'purple', desc: 'Clinical reasoning, progress analysis, emerging skills, barriers' },
  { key: 'plan', label: 'Plan', short: 'P', color: 'orange', desc: 'Next steps, frequency, home program, caregiver education' },
];

const sectionColors = {
  blue: { border: 'border-blue-300', bg: 'bg-blue-50', badge: 'bg-blue-500', text: 'text-blue-700', ring: 'focus:ring-blue-200' },
  teal: { border: 'border-teal-300', bg: 'bg-teal-50', badge: 'bg-teal-500', text: 'text-teal-700', ring: 'focus:ring-teal-200' },
  purple: { border: 'border-purple-300', bg: 'bg-purple-50', badge: 'bg-purple-500', text: 'text-purple-700', ring: 'focus:ring-purple-200' },
  orange: { border: 'border-orange-300', bg: 'bg-orange-50', badge: 'bg-orange-500', text: 'text-orange-700', ring: 'focus:ring-orange-200' },
};

export default function SOAPEditor({ patient, onComplete }) {
  const template = soapTemplates[patient.cptCode] || soapTemplates['97530'];
  const [notes, setNotes] = useState({
    subjective: patient.soap?.subjective || '',
    objective: patient.soap?.objective || '',
    assessment: patient.soap?.assessment || '',
    plan: patient.soap?.plan || '',
  });
  const [activeSection, setActiveSection] = useState('subjective');
  const [showSuggestions, setShowSuggestions] = useState({ subjective: false, objective: false, assessment: false, plan: false });
  const [recording, setRecording] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const handleApplyTemplate = (key) => {
    setNotes(prev => ({ ...prev, [key]: template[key] }));
  };

  const wordCount = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;

  const allFilled = sections.every(s => notes[s.key].trim().length > 20);

  return (
    <div className="space-y-4">
      {/* Template Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
          patient.cptCode === '97166' ? 'bg-blue-50 border-blue-200' :
          patient.cptCode === '96112' ? 'bg-purple-50 border-purple-200' :
          'bg-emerald-50 border-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={15} className={patient.cptCode === '97166' ? 'text-blue-500' : patient.cptCode === '96112' ? 'text-purple-500' : 'text-emerald-500'} />
          <span className="text-sm font-medium text-slate-700">
            Template auto-loaded: <strong>{template.label}</strong> (CPT {patient.cptCode})
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          sections.forEach(s => setNotes(prev => ({ ...prev, [s.key]: template[s.key] })));
        }}>
          Apply All Sections
        </Button>
      </motion.div>

      {/* SOAP Sections */}
      {sections.map((section, idx) => {
        const colors = sectionColors[section.color];
        const isActive = activeSection === section.key;
        const isCollapsed = collapsed[section.key];
        const suggestions = aiSuggestions[section.key];

        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className={`rounded-xl border-2 transition-all duration-200 ${isActive ? colors.border : 'border-slate-200'} bg-white overflow-hidden`}
          >
            {/* Section Header */}
            <div
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${isActive ? colors.bg : 'hover:bg-slate-50'}`}
              onClick={() => { setActiveSection(section.key); setCollapsed(prev => ({ ...prev, [section.key]: false })); }}
            >
              <div className={`w-7 h-7 rounded-lg ${colors.badge} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {section.short}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isActive ? colors.text : 'text-slate-700'}`}>{section.label}</p>
                <p className="text-xs text-slate-400">{section.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {wordCount(notes[section.key]) > 0 && (
                  <span className="text-xs text-slate-400">{wordCount(notes[section.key])} words</span>
                )}
                {notes[section.key].trim().length > 20 && (
                  <div className="w-2 h-2 rounded-full bg-emerald-400" title="Complete" />
                )}
                <button onClick={(e) => { e.stopPropagation(); setCollapsed(prev => ({ ...prev, [section.key]: !prev[section.key] })); }}>
                  {isCollapsed ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Section Body */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => handleApplyTemplate(section.key)}>
                        <Sparkles size={13} /> Use Template
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRecording(recording === section.key ? null : section.key)}
                        className={recording === section.key ? 'text-red-500 bg-red-50' : ''}
                      >
                        {recording === section.key ? <><MicOff size={13} /> Stop</> : <><Mic size={13} /> Voice</>}
                      </Button>
                      <button
                        onClick={() => setShowSuggestions(prev => ({ ...prev, [section.key]: !prev[section.key] }))}
                        className="ml-auto flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        <Lightbulb size={13} />
                        AI Tips {showSuggestions[section.key] ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* Voice indicator */}
                    {recording === section.key && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-red-600 font-medium">Recording... speak clearly</span>
                      </motion.div>
                    )}

                    {/* Textarea */}
                    <textarea
                      value={notes[section.key]}
                      onChange={e => setNotes(prev => ({ ...prev, [section.key]: e.target.value }))}
                      onFocus={() => setActiveSection(section.key)}
                      placeholder={`Document ${section.label.toLowerCase()} findings here...`}
                      rows={5}
                      className={`w-full text-sm text-slate-700 placeholder-slate-300 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent transition-all`}
                    />

                    {/* AI Suggestions */}
                    <AnimatePresence>
                      {showSuggestions[section.key] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1.5 overflow-hidden"
                        >
                          {suggestions.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                              <Info size={13} className="text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-amber-700">{tip}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Finalize */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-400">
          {allFilled ? '✓ All sections complete — ready to finalize' : 'Complete all sections before finalizing'}
        </p>
        <Button variant={allFilled ? 'success' : 'secondary'} disabled={!allFilled} onClick={onComplete}>
          Proceed to Compliance Check
        </Button>
      </div>
    </div>
  );
}
