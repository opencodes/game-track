import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { ChevronRight, User, Sparkles, Mail } from 'lucide-react';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const { login, playSound } = useGame();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username, avatars[selectedAvatar]);
      onLogin();
    }
  };

  const handleGoogleLogin = () => {
    playSound('click');
    // Simulate Google Login
    login('Google Player', avatars[Math.floor(Math.random() * avatars.length)]);
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md hud-panel p-8 hud-border bg-black/60"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gaming-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gaming-accent/40">
            <User className="w-8 h-8 text-gaming-accent" />
          </div>
          <h2 className="text-2xl font-display font-bold neon-glow">CREATE PLAYER</h2>
          <p className="text-white/60 text-sm mt-2">Initialize your gaming profile</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleGoogleLogin}
            onMouseEnter={() => playSound('hover')}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Sign in with Google
          </button>
          
          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">OR</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gaming-accent mb-2">
              Player Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gaming-accent transition-colors text-white placeholder:text-white/20"
                required
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gaming-accent/40" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gaming-accent mb-3">
              Select Avatar
            </label>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map((avatar, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedAvatar(index);
                    playSound('hover');
                  }}
                  className={`relative aspect-square rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white/5
                    ${selectedAvatar === index ? 'border-gaming-accent shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'border-white/10 hover:border-white/30'}
                  `}
                >
                  <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {selectedAvatar === index && (
                    <div className="absolute inset-0 bg-gaming-accent/10 pointer-events-none" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            onMouseEnter={() => playSound('hover')}
            className="w-full glass-button bg-gaming-accent/20 border-gaming-accent/40 text-gaming-accent font-bold uppercase tracking-widest py-4 group"
          >
            Enter Game Dashboard
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
