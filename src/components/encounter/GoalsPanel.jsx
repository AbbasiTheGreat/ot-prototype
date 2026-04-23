import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, CheckCircle2, Edit3, Trash2, Plus, Clock, PenLine } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { smartGoalSuggestions } from '../../data/mockData';

export default function GoalsPanel({ patient, onComplete }) {
  const [goals, setGoals] = useState(patient.goals || []);
  const [suggestions, setSuggestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [addingManual, setAddingManual] = useState(false);
  const [manualText, setManualText] = useState('');

  const generateSuggestions = () => {
    setGenerating(true);
    setTimeout(() => {
      setSuggestions(smartGoalSuggestions.slice(0, 3));
      setGenerating(false);
    }, 1400);
  };

  const addGoal = (text) => {
    const newGoal = { id: Date.now(), text, status: 'active', approved: false };
    setGoals(prev => [...prev, newGoal]);
    setSuggestions(prev => prev.filter(s => s !== text));
  };

  const approveGoal = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, approved: !g.approved } : g));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const startEdit = (goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, text: editText } : g));
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-blue-500" />
          <h3 className="font-semibold text-slate-800">Therapy Goals</h3>
          <Badge variant="blue">{goals.length} active</Badge>
          <Badge variant="blue">{goals.filter(g => g.approved).length} approved</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setAddingManual(true)}>
            <PenLine size={13} /> Add Manually
          </Button>
          <Button variant="outline" size="sm" onClick={generateSuggestions} disabled={generating}>
            {generating ? <><Sparkles size={13} className="animate-pulse" /> Generating...</> : <><Sparkles size={13} /> AI Suggest</>}
          </Button>
        </div>
      </div>

      {/* Manual add form */}
      <AnimatePresence>
        {addingManual && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-4 border-blue-200 bg-blue-50/40">
              <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5"><PenLine size={12} /> Write a custom goal</p>
              <textarea
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="Patient will [action] to [measurable outcome] with [accuracy/frequency] within 6 months..."                rows={3}
                className="w-full text-xs text-slate-700 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none bg-white"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => { if (manualText.trim()) { addGoal(manualText.trim()); setManualText(''); setAddingManual(false); } }}>Add Goal</Button>
                <Button size="sm" variant="secondary" onClick={() => { setAddingManual(false); setManualText(''); }}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SMART info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
        <Clock size={13} className="text-blue-500 shrink-0" />
        <p className="text-xs text-blue-600">All goals use a standardised 6-month timeframe. Review and edit before approving.</p>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-4 border-dashed border-2 border-blue-200 bg-blue-50/50">
              <p className="text-xs font-semibold text-blue-600 mb-3 flex items-center gap-1.5">
                <Sparkles size={13} /> AI-Suggested SMART Goals — review and add
              </p>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 bg-white border border-blue-100 rounded-lg px-3 py-2.5"
                  >
                    <p className="text-xs text-slate-600 flex-1 leading-relaxed">{s}</p>
                    <Button variant="outline" size="sm" onClick={() => addGoal(s)} className="shrink-0">
                      <Plus size={12} /> Add
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Goals */}
      {goals.length === 0 ? (
        <Card className="p-8 text-center">
          <Target size={32} className="text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No goals yet. Use AI suggestions or add manually.</p>        </Card>
      ) : (
        <div className="space-y-2">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className={`p-4 ${goal.approved ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 cursor-pointer" onClick={() => approveGoal(goal.id)}>
                    {goal.approved
                      ? <CheckCircle2 size={18} className="text-green-500" />
                      : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 hover:border-blue-400 transition-colors" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === goal.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          rows={3}
                          className="w-full text-xs text-slate-700 border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(goal.id)}>Save</Button>
                          <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-700 leading-relaxed">{goal.text}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={goal.approved ? 'blue' : 'gray'}>
                        {goal.approved ? 'Approved' : 'Pending Review'}
                      </Badge>
                      <span className="text-xs text-slate-400">6-month goal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {editingId !== goal.id && (
                      <Button variant="ghost" size="sm" onClick={() => startEdit(goal)}>
                        <Edit3 size={14} />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)} className="text-red-400 hover:bg-red-50">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Proceed button */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-400">
          {goals.some(g => g.approved) ? '✓ At least one goal approved — ready to proceed' : 'Approve at least one goal before proceeding'}
        </p>
        <Button variant={goals.some(g => g.approved) ? 'success' : 'secondary'} disabled={!goals.some(g => g.approved)} onClick={onComplete}>
          Proceed to Compliance Check
        </Button>
      </div>
    </div>
  );
}
