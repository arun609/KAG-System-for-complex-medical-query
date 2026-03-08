import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Database, Network, Activity, Brain, Stethoscope, Dna, Clock, ArrowRight } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './components/LandingPage';
import QueryPage from './components/QueryPage';
import ErrorBoundary from './components/ErrorBoundary';
import Background from './components/ui/Background';
import ThemeToggle from './components/ui/ThemeToggle';
import Logo from './components/ui/Logo';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import StatsCard from './components/dashboard/StatsCard';
import ActivityGraph from './components/dashboard/ActivityGraph';

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
    >
      <Logo size="xl" animated />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-medical-primary font-serif italic text-xl tracking-wider"
      >
        Loading System Interface...
      </motion.p>
    </motion.div>
  );
}

// Inner App to use Auth Context
function AppContent() {
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false); // Fixed: Add state for transition
  const [viewState, setViewState] = useState('dashboard'); // dashboard, queryquery
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    // Check Backend
    fetch('http://localhost:8000/')
      .then(res => res.ok ? setBackendStatus('Online') : setBackendStatus('Offline'))
      .catch(() => setBackendStatus('Offline'));
  }, []);

  useEffect(() => {
    // Fetch user history if logged in
    if (user?.id) {
      fetch(`http://localhost:8000/history/${user.id}`)
        .then(res => res.json())
        .then(data => setRecentHistory(data))
        .catch(console.error);
    } else {
      setRecentHistory([]);
    }
  }, [user]);

  // Handle Login Transition
  useEffect(() => {
    if (user && !showLanding) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLandingEnter = () => {
    // Trigger loading screen transition
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(false);
      setIsTransitioning(false);
    }, 1500);
  };

  // Handle Loading State (Initial or Transition)
  if (loading || isTransitioning) return <LoadingScreen />;

  // Landing Page Flow
  if (showLanding) {
    return (
      <AnimatePresence>
        <motion.div exit={{ opacity: 0, y: -50 }} className="w-full">
          <LandingPage onEnter={handleLandingEnter} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Authentication Flow
  if (!user) return <LoginPage />;

  // Navigation Handler
  const navigateTo = (view) => {
    setViewState(view);
  };

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-500">Welcome back, {user?.username || 'User'}. Here is your system analysis.</p>
        </div>
        <button
          onClick={() => navigateTo('query')}
          className="px-6 py-3 bg-medical-primary hover:bg-medical-accent text-white rounded-xl shadow-lg shadow-medical-primary/25 font-semibold flex items-center gap-2 transition-all"
        >
          <Brain className="w-5 h-5" /> Start New Query
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="System Status"
          value={backendStatus}
          icon={Activity}
          color={backendStatus === 'Online' ? 'green' : 'red'}
          label="Backend Connectivity"
        />
        <StatsCard
          title="Total Queries"
          value={recentHistory.length}
          icon={Database}
          color="blue"
          trend={12}
          label="Lifetime queries logged"
        />
        <StatsCard
          title="Active Nodes"
          value="4.2M"
          icon={Network}
          color="purple"
          label="Knowledge Graph Entities"
        />
        <StatsCard
          title="Avg. Confidence"
          value="88%"
          icon={Stethoscope}
          color="orange"
          trend={2.4}
          label="AI Reasoning Accuracy"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Activity Graph */}
        <div className="lg:col-span-2 h-full">
          <ActivityGraph />
        </div>

        {/* Recent History List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden flex flex-col h-full">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" /> Recent Queries
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {recentHistory.length > 0 ? (
              recentHistory.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{item.query}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-medical-primary -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <Brain className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">No recent queries found.</p>
                <button onClick={() => navigateTo('query')} className="text-sm text-medical-primary mt-2 hover:underline">Start your first query</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout activeTab={viewState} onNavigate={navigateTo}>
      <AnimatePresence mode="wait">
        {viewState === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <DashboardView />
          </motion.div>
        )}

        {viewState === 'query' && (
          <motion.div
            key="query"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ErrorBoundary>
              <QueryPage />
            </ErrorBoundary>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}