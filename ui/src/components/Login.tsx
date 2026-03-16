import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { User, Mail, Lock } from 'lucide-react';

export const Login: React.FC<{ onLogin: () => void; onRegister: () => void }> = ({ onLogin, onRegister }) => {
  const { login, playSound } = useGame();

  const [error, setError] = React.useState<string | null>(null);
  const [loginValue, setLoginValue] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleApiLogin = async () => {
    playSound('click');
    setError(null);
    setIsSubmitting(true);
    try {
      await login(loginValue, password);
      onLogin();
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err?.message || 'Login failed. Please try again.');
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
          <h2 className="text-2xl font-display font-bold neon-glow uppercase">Initialize Profile</h2>
          <p className="text-white/60 text-sm mt-2">Connect your account to save progress</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gaming-danger/10 border border-gaming-danger/40 rounded-lg">
            <p className="text-xs text-gaming-danger font-bold text-center">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="email"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="Email or Username"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gaming-accent text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleApiLogin}
            onMouseEnter={() => playSound('hover')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-gaming-accent text-black font-bold py-4 rounded-lg hover:bg-gaming-accent/90 transition-colors shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <User className="w-5 h-5" />
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <button
            onClick={onRegister}
            className="w-full text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            New here? Create an account
          </button>

          <div className="p-4 bg-gaming-accent/5 border border-gaming-accent/20 rounded-lg">
            <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed text-center">
              By signing in, your game sessions, levels, and achievements will be securely stored in the cloud.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
