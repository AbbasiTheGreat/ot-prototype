import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import EncounterView from './pages/EncounterView';
import PatientsPage from './pages/PatientsPage';
import NotesPage from './pages/NotesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { patients } from './data/mockData';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setPage('encounter');
  };

  const handleBack = () => {
    setPage('dashboard');
    setSelectedPatient(null);
  };

  const getNextPatient = () => {
    if (!selectedPatient) return null;
    const idx = patients.findIndex(p => p.id === selectedPatient.id);
    return patients[idx + 1] || null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar activePage={page === 'encounter' ? 'dashboard' : page} onNavigate={(p) => { setPage(p); setSelectedPatient(null); }} />
      <main className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {page === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <Dashboard onSelectPatient={handleSelectPatient} />
            </motion.div>
          )}
          {page === 'encounter' && selectedPatient && (
            <motion.div key="encounter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
              <EncounterView
                patient={selectedPatient}
                onBack={handleBack}
                nextPatient={getNextPatient()}
                onNextPatient={handleSelectPatient}
              />
            </motion.div>
          )}
          {page === 'patients' && (
            <motion.div key="patients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <PatientsPage onSelectPatient={handleSelectPatient} />
            </motion.div>
          )}
          {page === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <NotesPage />
            </motion.div>
          )}
          {page === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <ReportsPage />
            </motion.div>
          )}
          {page === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <SettingsPage />
            </motion.div>
          )}
          {!['dashboard', 'encounter', 'patients', 'notes', 'reports', 'settings'].includes(page) && (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-3">🚧</p>
                <p className="text-slate-500 font-medium capitalize">{page} — coming soon</p>
                <p className="text-slate-400 text-sm mt-1">This section is part of the next phase</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
