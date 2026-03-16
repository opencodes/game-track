import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { User, Mail, Lock, Gamepad2, Calendar } from 'lucide-react';

export const Register: React.FC<{ onRegistered: () => void; onGoLogin: () => void }> = ({ onRegistered, onGoLogin }) => {
  const { register, playSound } = useGame();

  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [favoriteGame, setFavoriteGame] = React.useState('Minecraft');
  const [avatar, setAvatar] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [dob, setDob] = React.useState('');

  const handleRegister = async () => {
    playSound('click');
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        username,
        email,
        displayName: displayName || username,
        favoriteGame,
        avatar: avatar || undefined,
        password,
        dob: dob || undefined
      });
      onRegistered();
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-2xl font-display font-bold neon-glow uppercase">Create Account</h2>
          <p className="text-white/60 text-sm mt-2">Start tracking your gaming progress</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gaming-danger/10 border border-gaming-danger/40 rounded-lg">
            <p className="text-xs text-gaming-danger font-bold text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (e.g. @player_one)"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
            />
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
            />
          </div>
          <div className="relative">
            <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
            />
          </div>
          <div className="relative">
            <Gamepad2 className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={favoriteGame}
              onChange={(e) => setFavoriteGame(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
            >
              <option value="Minecraft">Minecraft</option>
              <option value="Roblox">Roblox</option>
              <option value="Fortnite">Fortnite</option>
              <option value="Among Us">Among Us</option>
            </select>
          </div>
          <div className="relative">
            <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Avatar URL (optional)"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
            />
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
            />
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <button
            onClick={handleRegister}
            onMouseEnter={() => playSound('hover')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-gaming-accent text-black font-bold py-4 rounded-lg hover:bg-gaming-accent/90 transition-colors shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <User className="w-5 h-5" />
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          <button
            onClick={onGoLogin}
            className="w-full text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
};
