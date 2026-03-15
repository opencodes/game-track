import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Game {
  id: string;
  name: string;
  duration: number;
  date: string;
  xpEarned: number;
  levelAchieved?: number;
  remark?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

interface User {
  username: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  age: number;
  favoriteGame: string;
}

interface GameContextType {
  user: User;
  games: Game[];
  achievements: Achievement[];
  isMuted: boolean;
  toggleMute: () => void;
  addGame: (name: string, duration: number, levelAchieved?: number, remark?: string) => void;
  playSound: (type: 'hover' | 'click' | 'unlock' | 'levelUp' | 'notification') => void;
  login: (username: string, avatar: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_USER: User = {
  username: 'Player One',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  level: 5,
  xp: 420,
  nextLevelXp: 1000,
  age: 10,
  favoriteGame: 'Minecraft'
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'First Game Played', description: 'Log your first gaming session', icon: '🎮', unlocked: true, date: '2024-03-10' },
  { id: '2', name: '5 Hours Played', description: 'Reach 300 minutes of total playtime', icon: '⏳', unlocked: false },
  { id: '3', name: 'Level Up', description: 'Reach level 2 for the first time', icon: '⭐', unlocked: true, date: '2024-03-12' },
  { id: '4', name: 'Top Player', description: 'Reach rank 1 on the leaderboard', icon: '🏆', unlocked: false },
  { id: '5', name: 'Marathon Gamer', description: 'Play for 2 hours in one session', icon: '🔥', unlocked: false },
];

const INITIAL_GAMES: Game[] = [
  { id: '1', name: 'Minecraft', duration: 45, date: '2024-03-14', xpEarned: 50 },
  { id: '2', name: 'Roblox', duration: 30, date: '2024-03-14', xpEarned: 35 },
  { id: '3', name: 'Fortnite', duration: 20, date: '2024-03-13', xpEarned: 25 },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sound system
  const playSound = useCallback((type: 'hover' | 'click' | 'unlock' | 'levelUp' | 'notification') => {
    if (isMuted) return;
    
    const sounds: Record<string, string> = {
      hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft digital click
      click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Confirmation
      unlock: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // Celebratory
      levelUp: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Dramatic power-up
      notification: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', // Notification
    };

    const audio = new Audio(sounds[type]);
    audio.volume = 0.2;
    audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
  }, [isMuted]);

  const toggleMute = () => setIsMuted(!isMuted);

  const addGame = (name: string, duration: number, levelAchieved?: number, remark?: string) => {
    const xpEarned = Math.floor(duration * 1.5);
    const newGame: Game = {
      id: Date.now().toString(),
      name,
      duration,
      date: new Date().toISOString().split('T')[0],
      xpEarned,
      levelAchieved,
      remark
    };

    setGames(prev => [newGame, ...prev]);
    
    // Update User XP and Level
    setUser(prev => {
      let newXp = prev.xp + xpEarned;
      let newLevel = prev.level;
      let newNextLevelXp = prev.nextLevelXp;

      if (newXp >= newNextLevelXp) {
        newLevel += 1;
        newXp = newXp - newNextLevelXp;
        newNextLevelXp = Math.floor(newNextLevelXp * 1.2);
        playSound('levelUp');
      } else {
        playSound('notification');
      }

      return { ...prev, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp };
    });

    // Check for achievements
    const totalPlaytime = games.reduce((acc, g) => acc + g.duration, 0) + duration;
    if (totalPlaytime >= 300) {
      unlockAchievement('2');
    }
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === id && !ach.unlocked) {
        playSound('unlock');
        return { ...ach, unlocked: true, date: new Date().toISOString().split('T')[0] };
      }
      return ach;
    }));
  };

  const login = (username: string, avatar: string) => {
    setUser(prev => ({ ...prev, username, avatar }));
    setIsLoggedIn(true);
    playSound('click');
  };

  const logout = () => {
    setIsLoggedIn(false);
    playSound('click');
  };

  // Simulated XP trickle
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(() => {
      setUser(prev => {
        const xpGain = 1;
        let newXp = prev.xp + xpGain;
        let newLevel = prev.level;
        let newNextLevelXp = prev.nextLevelXp;

        if (newXp >= newNextLevelXp) {
          newLevel += 1;
          newXp = 0;
          newNextLevelXp = Math.floor(newNextLevelXp * 1.2);
          playSound('levelUp');
        }

        return { ...prev, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoggedIn, playSound]);

  return (
    <GameContext.Provider value={{ 
      user, games, achievements, isMuted, toggleMute, addGame, playSound, login, logout, isLoggedIn 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
