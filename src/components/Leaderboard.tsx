import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { playSound } = useGame();

  const topPlayers = [
    { rank: 2, username: 'ShadowNinja', level: 42, xp: 12500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow', color: 'bg-slate-400' },
    { rank: 1, username: 'CyberQueen', level: 50, xp: 18900, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Queen', color: 'bg-yellow-400' },
    { rank: 3, username: 'PixelKnight', level: 38, xp: 9800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Knight', color: 'bg-amber-600' },
  ];

  const [players, setPlayers] = useState([
    { rank: 4, username: 'GamerX', level: 35, xp: 8500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=X', trend: 'up', games: 156, lastChange: null as 'up' | 'down' | null },
    { rank: 5, username: 'NeonBlast', level: 32, xp: 7200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neon', trend: 'down', games: 142, lastChange: null as 'up' | 'down' | null },
    { rank: 6, username: 'VoidWalker', level: 30, xp: 6800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Void', trend: 'stable', games: 128, lastChange: null as 'up' | 'down' | null },
    { rank: 7, username: 'StarDust', level: 28, xp: 5900, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Star', trend: 'up', games: 115, lastChange: null as 'up' | 'down' | null },
    { rank: 8, username: 'FrostByte', level: 25, xp: 5100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frost', trend: 'stable', games: 98, lastChange: null as 'up' | 'down' | null },
  ]);

  // Simulate rank changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => {
        const next = [...prev];
        // Pick two adjacent players to swap
        const idx = Math.floor(Math.random() * (next.length - 1));
        
        // Swap ranks
        const tempRank = next[idx].rank;
        next[idx].rank = next[idx+1].rank;
        next[idx+1].rank = tempRank;

        // Set change indicators
        next[idx].lastChange = next[idx].rank < tempRank ? 'up' : 'down';
        next[idx+1].lastChange = next[idx+1].rank < next[idx].rank ? 'up' : 'down'; // This logic is slightly flawed but good for demo

        // Simple swap for demo: idx moves up, idx+1 moves down
        next[idx].lastChange = 'up';
        next[idx+1].lastChange = 'down';

        playSound('notification');

        // Sort by rank
        return next.sort((a, b) => a.rank - b.rank);
      });

      // Clear indicators after 3 seconds
      setTimeout(() => {
        setPlayers(prev => prev.map(p => ({ ...p, lastChange: null })));
      }, 3000);

    }, 8000);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-display font-black neon-glow uppercase tracking-tight mb-4">Global Leaderboard</h2>
        <p className="text-white/60">The elite ranks of the GAMELEVEL universe. Can you reach the summit?</p>
      </div>

      {/* 3D Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-20 px-4">
        {/* Rank 2 */}
        <PodiumBlock player={topPlayers[0]} height="h-48" delay={0.2} />
        {/* Rank 1 */}
        <PodiumBlock player={topPlayers[1]} height="h-64" delay={0} isGold />
        {/* Rank 3 */}
        <PodiumBlock player={topPlayers[2]} height="h-36" delay={0.4} />
      </div>

      {/* Leaderboard Table */}
      <div className="hud-panel overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 sm:col-span-4">Player</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-center">XP</div>
          <div className="col-span-2 hidden sm:block text-center">Games</div>
          <div className="col-span-2 sm:col-span-1 text-center">Trend</div>
        </div>

        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {players.map((player, i) => (
              <motion.div
                key={player.username}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  backgroundColor: player.lastChange === 'up' 
                    ? 'rgba(0, 255, 136, 0.1)' 
                    : player.lastChange === 'down' 
                    ? 'rgba(255, 0, 85, 0.1)' 
                    : 'transparent'
                }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  backgroundColor: { duration: 0.5 }
                }}
                onMouseEnter={() => playSound('hover')}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group relative"
              >
                <div className="col-span-1 text-center font-display font-bold text-white/60">
                  <motion.span
                    key={player.rank}
                    initial={{ scale: 1.5, color: '#00f2ff' }}
                    animate={{ scale: 1, color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    #{player.rank}
                  </motion.span>
                </div>
                <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 p-0.5 group-hover:border-gaming-accent transition-colors">
                    <img src={player.avatar} alt={player.username} className="w-full h-full rounded-md" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold truncate">{player.username}</span>
                    <AnimatePresence>
                      {player.lastChange && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded
                            ${player.lastChange === 'up' ? 'bg-gaming-success/20 text-gaming-success' : 'bg-gaming-danger/20 text-gaming-danger'}
                          `}
                        >
                          {player.lastChange === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {player.lastChange === 'up' ? 'RANK UP' : 'RANK DOWN'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-bold text-gaming-accent">LVL {player.level}</span>
                </div>
                <div className="col-span-2 text-center font-mono text-xs text-white/80">{player.xp.toLocaleString()}</div>
                <div className="col-span-2 hidden sm:block text-center text-xs text-white/40">{player.games}</div>
                <div className="col-span-2 sm:col-span-1 flex justify-center">
                  {player.trend === 'up' && <ArrowUp className="w-4 h-4 text-gaming-success" />}
                  {player.trend === 'down' && <ArrowDown className="w-4 h-4 text-gaming-danger" />}
                  {player.trend === 'stable' && <Minus className="w-4 h-4 text-white/20" />}
                </div>

                {/* Rank Change Sparkle Effect */}
                {player.lastChange === 'up' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                  >
                    <Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 text-gaming-success w-8 h-8 opacity-20" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const PodiumBlock: React.FC<{ player: any; height: string; delay: number; isGold?: boolean }> = ({ player, height, delay, isGold }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className="flex flex-col items-center w-full max-w-[200px]"
    >
      <div className="relative mb-4">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
          className={`w-20 h-20 rounded-2xl border-2 p-1 bg-black/40 relative z-10
            ${isGold ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]' : 'border-white/20'}
          `}
        >
          <img src={player.avatar} alt={player.username} className="w-full h-full rounded-xl" referrerPolicy="no-referrer" />
          {isGold && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </div>
          )}
        </motion.div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/20 rounded-lg flex items-center justify-center text-xs font-bold z-20">
          #{player.rank}
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p className="font-bold text-sm truncate w-32">{player.username}</p>
        <p className="text-[10px] text-gaming-accent font-bold uppercase tracking-widest">LVL {player.level}</p>
      </div>

      <div className={`w-full ${height} hud-panel rounded-t-2xl border-b-0 flex flex-col items-center justify-center gap-2 relative overflow-hidden
        ${isGold ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-white/5 border-white/10'}
      `}>
        {isGold && <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent" />}
        <Medal className={`w-8 h-8 ${isGold ? 'text-yellow-400' : 'text-white/20'}`} />
        <span className="font-mono text-xs font-bold">{player.xp.toLocaleString()} XP</span>
      </div>
    </motion.div>
  );
};
