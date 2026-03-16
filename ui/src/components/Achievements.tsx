import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { achievements, playSound } = useGame();

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-black neon-glow uppercase tracking-tight mb-4">Achievement Gallery</h2>
        <p className="text-white/60 max-w-2xl mx-auto">Complete challenges to unlock exclusive holographic badges and boost your global reputation.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {achievements.map((ach, i) => (
          <AchievementCard key={ach.id} achievement={ach} index={i} onHover={() => playSound('hover')} />
        ))}
      </div>
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: any; index: number; onHover: () => void }> = ({ achievement, index, onHover }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={onHover}
      className={`group relative perspective-1000 h-64`}
    >
      <motion.div
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full transition-all duration-500 preserve-3d"
      >
        {/* Front Side */}
        <div className={`absolute inset-0 backface-hidden hud-panel p-6 flex flex-col items-center justify-center text-center border-2 transition-colors
          ${achievement.unlocked ? 'border-gaming-accent/40 bg-gaming-accent/5' : 'border-white/5 bg-white/5 grayscale opacity-60'}
        `}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]
            ${achievement.unlocked ? 'bg-gaming-accent/20 animate-float' : 'bg-white/10'}
          `}>
            {achievement.icon}
          </div>
          <h3 className="font-display font-bold text-lg mb-1">{achievement.name}</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
            {achievement.unlocked ? (
              <span className="text-gaming-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Unlocked</span>
            ) : (
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
            )}
          </div>
        </div>

        {/* Back Side */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 hud-panel p-6 flex flex-col items-center justify-center text-center border-2
          ${achievement.unlocked ? 'border-gaming-accent/40 bg-gaming-accent/10' : 'border-white/5 bg-white/10'}
        `}>
          <Award className={`w-10 h-10 mb-4 ${achievement.unlocked ? 'text-gaming-accent' : 'text-white/20'}`} />
          <p className="text-sm text-white/80 mb-4">{achievement.description}</p>
          {achievement.unlocked && (
            <div className="text-[10px] font-bold uppercase tracking-widest text-gaming-accent">
              Unlocked on: {achievement.date}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
