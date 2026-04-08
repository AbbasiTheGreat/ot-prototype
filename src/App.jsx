import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import EncounterView from './pages/EncounterView';
import PatientsPage from './pages/PatientsPage';
import NotesPage from './pages/NotesPage';
import ConnectPage from './pages/ConnectPage';
import { patients } from './data/mockData';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [page, setPage] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(null);

  if (!connected) {
    return <ConnectPage onConnect={() => setConnected(true)} />;
  }

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBack = () => {
    setSelectedPatient(null);
  };

  const getNextPatient = () => {
    if (!selectedPatient) return null;
    const idx = patients.findIndex(p => p.id === selectedPatient.id);
    return patients[idx + 1] || null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar activePage={page} onNavigate={(p) => { setPage(p); setSelectedPatient(null); }} />
      <main className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {page === 'patients' && !selectedPatient && (
            <motion.div key="patients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <PatientsPage onSelectPatient={handleSelectPatient} />
            </motion.div>
          )}
          {page === 'patients' && selectedPatient && (
            <motion.div key="encounter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
              <EncounterView
                patient={selectedPatient}
                onBack={handleBack}
                nextPatient={getNextPatient()}
                onNextPatient={handleSelectPatient}
              />
            </motion.div>
          )}
          {page === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <NotesPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
