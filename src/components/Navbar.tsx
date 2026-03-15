import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, LayoutDashboard, Gamepad2, Trophy, Award, User, Home, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isMuted, toggleMute, playSound, user, isLoggedIn, logout } = useGame();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Game Tracker', icon: Gamepad2 },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    playSound('click');
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between hud-panel px-6 py-2 border-white/5 bg-black/40">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-8 h-8 bg-gaming-accent rounded-sm rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Gamepad2 className="-rotate-45 text-black w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter neon-glow">
            GAME<span className="text-gaming-accent">LEVEL</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={() => playSound('hover')}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 rounded-md
                ${activeTab === item.id ? 'text-gaming-accent bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gaming-accent shadow-[0_0_10px_#00f2ff]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            onMouseEnter={() => playSound('hover')}
            className="p-2 text-white/60 hover:text-gaming-accent transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          {isLoggedIn && user && (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleNavClick('profile')}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold leading-none">{user.username}</p>
                  <p className="text-[10px] text-gaming-accent leading-none mt-1">LVL {user.level}</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-gaming-accent/50 p-0.5 group-hover:border-gaming-accent transition-colors">
                  <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full bg-white/10" referrerPolicy="no-referrer" />
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                onMouseEnter={() => playSound('hover')}
                className="p-2 text-white/40 hover:text-gaming-danger transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
