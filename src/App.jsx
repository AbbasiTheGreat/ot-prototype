import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopNav from './components/layout/TopNav';
import EncounterView from './pages/EncounterView';
import PatientsPage from './pages/PatientsPage';
import NewSessionPage from './pages/NewSessionPage';
import ConnectPage from './pages/ConnectPage';
import { patients } from './data/mockData';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [page, setPage] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [allPatients, setAllPatients] = useState(null); // lifted state

  if (!connected) {
    return <ConnectPage onConnect={() => setConnected(true)} />;
  }

  const handleSelectPatient = (patient) => setSelectedPatient(patient);
  const handleBack = () => setSelectedPatient(null);

  const handleSessionCreated = (newPatient) => {
    setAllPatients(prev => [newPatient, ...(prev || [])]);
    setSelectedPatient(newPatient);
    setPage('patients');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <TopNav activePage={page} onNavigate={(p) => { setPage(p); setSelectedPatient(null); }} />
      <main className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {page === 'new-session' && (
            <motion.div key="new-session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <NewSessionPage onBack={() => setPage('patients')} onSessionCreated={handleSessionCreated} />
            </motion.div>
          )}
          {page === 'patients' && !selectedPatient && (
            <motion.div key="patients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto scrollbar-thin">
              <PatientsPage
                onSelectPatient={handleSelectPatient}
                onNewSession={() => setPage('new-session')}
                extraPatients={allPatients}
              />
            </motion.div>
          )}
          {page === 'patients' && selectedPatient && (
            <motion.div key="encounter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
              <EncounterView
                patient={selectedPatient}
                onBack={handleBack}
                nextPatient={null}
                onNextPatient={null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
