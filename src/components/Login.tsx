import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { User, Mail } from 'lucide-react';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const { login, playSound } = useGame();

  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleLogin = async () => {
    playSound('click');
    setError(null);
    try {
      await login();
      onLogin();
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Firebase Auth. Please add it to Authorized Domains in the Firebase Console.');
      } else {
        setError('Login failed. Please try again.');
      }
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
          <button
            onClick={handleGoogleLogin}
            onMouseEnter={() => playSound('hover')}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-lg hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Mail className="w-5 h-5" />
            Sign in with Google
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
