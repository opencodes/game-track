import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Gamepad2, Clock, Calendar, Plus, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

export const GameTracker: React.FC = () => {
  const { addGame, playSound } = useGame();
  const [gameName, setGameName] = useState('');
  const [duration, setDuration] = useState('30');
  const [levelAchieved, setLevelAchieved] = useState('');
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    setIsSubmitting(true);
    playSound('click');

    // Simulate processing
    setTimeout(() => {
      addGame(gameName, parseInt(duration), levelAchieved ? parseInt(levelAchieved) : undefined, remark);
      setIsSubmitting(false);
      setShowSuccess(true);
      setGameName('');
      setLevelAchieved('');
      setRemark('');
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const gameSuggestions = ['Minecraft', 'Roblox', 'Fortnite', 'Among Us', 'Rocket League', 'Animal Crossing'];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hud-panel p-8 hud-border bg-black/60"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gaming-accent/20 rounded-xl flex items-center justify-center border border-gaming-accent/40">
            <Plus className="w-6 h-6 text-gaming-accent" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold neon-glow uppercase tracking-tight">Log Game Session</h2>
            <p className="text-white/60 text-sm">Record your playtime and earn XP rewards</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gaming-accent mb-2">
                  Game Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="What did you play?"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gaming-accent transition-colors text-white placeholder:text-white/20"
                    required
                  />
                  <Gamepad2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {gameSuggestions.map(game => (
                    <button
                      key={game}
                      type="button"
                      onClick={() => {
                        setGameName(game);
                        playSound('hover');
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 hover:bg-gaming-accent/20 hover:text-gaming-accent rounded border border-white/10 hover:border-gaming-accent/40 transition-all"
                    >
                      {game}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gaming-accent mb-2">
                  Playtime Duration (Minutes)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gaming-accent"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span>5m</span>
                    <span className="text-gaming-accent text-sm">{duration} Minutes</span>
                    <span>180m</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gaming-accent mb-2">
                  Session Date
                </label>
                <div className="relative">
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/60 flex items-center justify-between">
                    <span>Today, {new Date().toLocaleDateString()}</span>
                    <Calendar className="w-4 h-4 text-white/20" />
                  </div>
                </div>
              </div>

              <div className="hud-panel p-4 bg-gaming-accent/5 border-gaming-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-4 h-4 text-gaming-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gaming-accent">Estimated Rewards</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black">+{Math.floor(parseInt(duration) * 1.5)}</span>
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">XP Points</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gaming-accent mb-2">
                  Level Achieved (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={levelAchieved}
                    onChange={(e) => setLevelAchieved(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gaming-accent transition-colors text-white placeholder:text-white/20"
                  />
                  <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gaming-accent mb-2">
                  Remarks / Notes
                </label>
                <div className="relative">
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="How was the session?"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gaming-accent transition-colors text-white placeholder:text-white/20 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={() => playSound('hover')}
              className={`w-full glass-button py-4 font-bold uppercase tracking-widest text-lg transition-all
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'bg-gaming-accent/20 border-gaming-accent/40 text-gaming-accent hover:bg-gaming-accent/30'}
              `}
            >
              {isSubmitting ? 'Processing Session...' : 'Log Game Session'}
            </button>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute -top-16 left-0 right-0 flex justify-center"
                >
                  <div className="bg-gaming-success/20 border border-gaming-success/40 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-2 text-gaming-success font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    Session Logged Successfully!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
