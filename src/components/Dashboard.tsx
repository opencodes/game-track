import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { 
  TrendingUp, Clock, Gamepad2, Zap, 
  ChevronRight, Calendar, History, Star
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, games, playSound } = useGame();
  const [displayedXp, setDisplayedXp] = useState(user.xp);

  // Animate XP counter
  useEffect(() => {
    if (displayedXp < user.xp) {
      const timer = setTimeout(() => setDisplayedXp(prev => prev + 1), 20);
      return () => clearTimeout(timer);
    } else if (displayedXp > user.xp) {
      setDisplayedXp(user.xp);
    }
  }, [user.xp, displayedXp]);

  const stats = [
    { label: 'Games Today', value: 3, icon: Gamepad2, color: 'text-gaming-accent' },
    { label: 'Weekly Playtime', value: '12.5h', icon: Clock, color: 'text-gaming-secondary' },
    { label: 'Favorite Game', value: user.favoriteGame, icon: Star, color: 'text-gaming-warning' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hud-panel p-6 hud-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="text-xs font-bold text-gaming-accent/40 uppercase tracking-widest">Status: Active</div>
            </div>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl border-2 border-gaming-accent p-1 bg-black/40">
                  <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-xl" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gaming-accent rounded-lg flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_#00f2ff]">
                  {user.level}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">{user.username}</h2>
                <p className="text-gaming-accent text-sm font-bold uppercase tracking-widest">Elite Explorer</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span>XP Progress</span>
                <span className="text-gaming-accent">{displayedXp} / {user.nextLevelXp}</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-gaming-accent to-gaming-secondary shadow-[0_0_10px_#00f2ff]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(displayedXp / user.nextLevelXp) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hud-panel p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-default"
              >
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
                  <p className="text-xl font-display font-bold">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Activity & Live Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live XP Counter Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hud-panel p-6 bg-gradient-to-r from-gaming-accent/10 to-transparent border-l-4 border-l-gaming-accent flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gaming-accent/20 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-6 h-6 text-gaming-accent" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">LIVE XP STREAM</h3>
                <p className="text-white/40 text-xs">Passive experience accumulation active</p>
              </div>
            </div>
            <div className="text-4xl font-display font-black text-gaming-accent italic neon-glow">
              +{displayedXp} XP
            </div>
          </motion.div>

          {/* Activity Feed */}
          <div className="hud-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gaming-accent" />
                <h3 className="font-display font-bold text-xl uppercase tracking-tight">Recent Activity</h3>
              </div>
              <button className="text-xs text-gaming-accent hover:underline font-bold uppercase tracking-widest">View All</button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {games.map((game, i) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-gaming-accent/30 transition-all cursor-pointer"
                    onMouseEnter={() => playSound('hover')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-gaming-accent/50 transition-colors">
                        <Gamepad2 className="w-6 h-6 text-white/60 group-hover:text-gaming-accent transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold">{game.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {game.duration}m</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {game.date}</span>
                          {game.levelAchieved && (
                            <span className="flex items-center gap-1 text-gaming-accent font-bold">
                              <TrendingUp className="w-3 h-3" /> LVL {game.levelAchieved}
                            </span>
                          )}
                        </div>
                        {game.remark && (
                          <p className="text-[11px] text-white/60 italic mt-2 line-clamp-1 group-hover:line-clamp-none transition-all">
                            "{game.remark}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gaming-success font-bold text-sm">+{game.xpEarned} XP</div>
                      <div className="text-[10px] text-white/20 uppercase font-bold mt-1">Verified</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
