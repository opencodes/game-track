import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Trophy, Award, Star } from 'lucide-react';

export const FloatingScene: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
      {/* Central Glow */}
      <div className="absolute w-64 h-64 bg-gaming-accent/20 blur-[80px] rounded-full animate-pulse" />
      
      {/* Floating Controller */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateY: [0, 360],
          rotateX: [10, -10, 10]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10"
      >
        <div className="w-32 h-32 bg-gaming-card backdrop-blur-xl border border-gaming-accent/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)]">
          <Gamepad2 className="w-16 h-16 text-gaming-accent" />
        </div>
      </motion.div>

      {/* Orbiting Elements */}
      <OrbitingElement delay={0} radius={140} duration={15}>
        <div className="w-12 h-12 bg-gaming-secondary/20 backdrop-blur-lg border border-gaming-secondary/40 rounded-full flex items-center justify-center">
          <Trophy className="w-6 h-6 text-gaming-secondary" />
        </div>
      </OrbitingElement>

      <OrbitingElement delay={2} radius={120} duration={12} reverse>
        <div className="w-10 h-10 bg-gaming-success/20 backdrop-blur-lg border border-gaming-success/40 rounded-full flex items-center justify-center">
          <Award className="w-5 h-5 text-gaming-success" />
        </div>
      </OrbitingElement>

      <OrbitingElement delay={4} radius={160} duration={18}>
        <div className="w-8 h-8 bg-gaming-warning/20 backdrop-blur-lg border border-gaming-warning/40 rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 text-gaming-warning" />
        </div>
      </OrbitingElement>

      {/* XP Orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gaming-accent rounded-full shadow-[0_0_10px_#00f2ff]"
          animate={{
            x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
            y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
};

const OrbitingElement: React.FC<{ 
  children: React.ReactNode; 
  radius: number; 
  duration: number; 
  delay?: number;
  reverse?: boolean;
}> = ({ children, radius, duration, delay = 0, reverse = false }) => {
  return (
    <motion.div
      className="absolute"
      animate={{
        rotate: reverse ? -360 : 360
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay
      }}
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ transform: `rotate(${reverse ? 360 : -360}deg)` }}
      >
        <motion.div
          animate={{ rotate: reverse ? 360 : -360 }}
          transition={{ duration, repeat: Infinity, ease: "linear", delay }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};
