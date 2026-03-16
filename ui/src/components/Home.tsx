import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { FloatingScene } from './FloatingScene';
import { ChevronRight, Play, Trophy } from 'lucide-react';

export const Home: React.FC<{ onStart: () => void; onViewLeaderboard: () => void }> = ({ onStart, onViewLeaderboard }) => {
  const { playSound } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gaming-accent/10 border border-gaming-accent/20 text-gaming-accent text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gaming-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gaming-accent"></span>
            </span>
            System Online
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black leading-tight mb-6">
            TRACK YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-accent to-gaming-secondary neon-glow">
              GAMING JOURNEY
            </span>
          </h1>
          
          <p className="text-white/60 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            The ultimate command center for young legends. Play games, earn XP, unlock holographic achievements, and climb the global leaderboard.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onStart}
              onMouseEnter={() => playSound('hover')}
              className="glass-button bg-gaming-accent text-black font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:shadow-[0_0_50px_rgba(0,242,255,0.6)]"
            >
              <Play className="w-5 h-5 fill-current" />
              START TRACKING
            </button>
            
            <button
              onClick={onViewLeaderboard}
              onMouseEnter={() => playSound('hover')}
              className="glass-button font-bold text-lg px-8 py-4 rounded-xl"
            >
              <Trophy className="w-5 h-5" />
              VIEW LEADERBOARD
            </button>
          </div>

          {/* Stats Preview */}
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-2xl font-display font-bold text-gaming-accent">10K+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Active Players</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-gaming-secondary">500+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Achievements</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-gaming-success">1M+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">XP Earned</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:block"
        >
          <FloatingScene />
        </motion.div>
      </div>
    </div>
  );
};
