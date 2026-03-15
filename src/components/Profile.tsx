import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { User, Settings, Shield, Star, Edit2, Save, Sparkles, LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, playSound, logout } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [age, setAge] = useState(user.age.toString());
  const [favoriteGame, setFavoriteGame] = useState(user.favoriteGame);

  const handleSave = () => {
    setIsEditing(false);
    playSound('click');
    // In a real app, we'd update the context here
  };

  const handleLogout = () => {
    logout();
  };

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 space-y-6"
        >
          <div className="hud-panel p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <div className="w-32 h-32 rounded-3xl border-2 border-gaming-accent p-1 bg-black/40">
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-2xl" referrerPolicy="no-referrer" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-gaming-accent rounded-xl flex items-center justify-center text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-display font-bold">{user.username}</h3>
            <p className="text-gaming-accent text-xs font-bold uppercase tracking-widest mt-1">Level {user.level} Player</p>
            
            <div className="w-full h-px bg-white/10 my-6" />
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <p className="text-lg font-display font-bold">12</p>
                <p className="text-[10px] text-white/40 uppercase font-bold">Achievements</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-display font-bold">#42</p>
                <p className="text-[10px] text-white/40 uppercase font-bold">Global Rank</p>
              </div>
            </div>
          </div>

          <div className="hud-panel p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold">
              <Settings className="w-4 h-4 text-white/40" /> Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold">
              <Shield className="w-4 h-4 text-white/40" /> Privacy
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gaming-danger/10 hover:bg-gaming-danger/20 transition-colors text-sm font-bold text-gaming-danger border border-gaming-danger/20"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </motion.div>

        {/* Profile Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="hud-panel p-8 hud-border">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-gaming-accent" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Player Profile</h2>
              </div>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gaming-accent hover:text-white transition-colors"
              >
                {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Username</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gaming-accent text-sm"
                    />
                  ) : (
                    <p className="text-lg font-bold">{user.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Age</label>
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gaming-accent text-sm"
                    />
                  ) : (
                    <p className="text-lg font-bold">{user.age} Years</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Favorite Game</label>
                {isEditing ? (
                  <select 
                    value={favoriteGame} 
                    onChange={(e) => setFavoriteGame(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-gaming-accent text-sm"
                  >
                    <option value="Minecraft">Minecraft</option>
                    <option value="Roblox">Roblox</option>
                    <option value="Fortnite">Fortnite</option>
                    <option value="Among Us">Among Us</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gaming-warning fill-gaming-warning" />
                    <p className="text-lg font-bold">{user.favoriteGame}</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gaming-accent mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Progress Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-2xl font-display font-bold">156</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Sessions</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-2xl font-display font-bold">42h</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Playtime</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-2xl font-display font-bold">8.5k</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Total XP</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-2xl font-display font-bold">12</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Badges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
