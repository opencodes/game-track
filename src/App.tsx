/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Background } from './components/Background';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { GameTracker } from './components/GameTracker';
import { Achievements } from './components/Achievements';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { AnimatePresence, motion } from 'motion/react';

const AppContent: React.FC = () => {
  const { isLoggedIn, playSound } = useGame();
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    if (!isLoggedIn && activeTab !== 'home' && activeTab !== 'leaderboard') {
      return <Login onLogin={() => setActiveTab('dashboard')} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <Home 
            onStart={() => {
              if (isLoggedIn) setActiveTab('dashboard');
              else setActiveTab('login');
            }} 
            onViewLeaderboard={() => setActiveTab('leaderboard')}
          />
        );
      case 'login':
        return <Login onLogin={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'tracker':
        return <GameTracker />;
      case 'achievements':
        return <Achievements />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onStart={() => setActiveTab('login')} onViewLeaderboard={() => setActiveTab('leaderboard')} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <Background />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global HUD Elements */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
        <div className="hud-panel px-4 py-2 border-white/5 bg-black/40 flex items-center gap-3">
          <div className="w-2 h-2 bg-gaming-accent rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Neural Link Stable</span>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 pointer-events-none hidden md:block">
        <div className="hud-panel px-4 py-2 border-white/5 bg-black/40 flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">v1.0.4-BETA</span>
          <div className="w-2 h-2 bg-gaming-secondary rounded-full animate-pulse shadow-[0_0_8px_#7000ff]" />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
