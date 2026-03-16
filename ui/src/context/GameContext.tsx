import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
const AUTH_STORAGE_KEY = 'game-track-uid';
const AUTH_TOKEN_KEY = 'game-track-token';
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

const getAuthHeader = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface Game {
  id: string;
  name: string;
  duration: number;
  date: string;
  xpEarned: number;
  levelAchieved?: number;
  remark?: string;
  userId: string;
}

interface Achievement {
  id: string;
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
  userId: string;
}

interface User {
  uid: string;
  username: string;
  displayName?: string;
  email?: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  age: number | null;
  favoriteGame: string;
  role?: string;
}

interface GameContextType {
  user: User | null;
  games: Game[];
  achievements: Achievement[];
  isMuted: boolean;
  toggleMute: () => void;
  addGame: (name: string, duration: number, levelAchieved?: number, remark?: string) => Promise<void>;
  playSound: (type: 'hover' | 'click' | 'unlock' | 'levelUp' | 'notification') => void;
  login: (login: string, password: string) => Promise<void>;
  register: (payload: {
    username: string;
    email: string;
    displayName: string;
    favoriteGame: string;
    avatar?: string;
    password: string;
    dob?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoggedIn: boolean;
  isAuthReady: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_USER_DATA: User = {
  uid: 'local-user',
  username: 'New Explorer',
  displayName: 'New Explorer',
  email: 'local@user',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  level: 1,
  xp: 0,
  nextLevelXp: 1000,
  age: 10,
  favoriteGame: 'Minecraft',
  role: 'client'
};

const INITIAL_ACHIEVEMENTS_TEMPLATES = [
  { achievementId: '1', name: 'First Game Played', description: 'Log your first gaming session', icon: '🎮' },
  { achievementId: '2', name: '5 Hours Played', description: 'Reach 300 minutes of total playtime', icon: '⏳' },
  { achievementId: '3', name: 'Level Up', description: 'Reach level 2 for the first time', icon: '⭐' },
  { achievementId: '4', name: 'Top Player', description: 'Reach rank 1 on the leaderboard', icon: '🏆' },
  { achievementId: '5', name: 'Marathon Gamer', description: 'Play for 2 hours in one session', icon: '🔥' },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Sound system
  const playSound = useCallback((type: 'hover' | 'click' | 'unlock' | 'levelUp' | 'notification') => {
    if (isMuted) return;
    
    const sounds: Record<string, string> = {
      hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      unlock: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
      levelUp: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
      notification: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
    };

    const audio = new Audio(sounds[type]);
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }, [isMuted]);

  // Data Fetching
  const fetchUserData = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${uid}`, {
        headers: {
          ...getAuthHeader()
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, []);

  const fetchGames = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/games/${uid}`, {
        headers: {
          ...getAuthHeader()
        }
      });
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  }, []);

  const fetchAchievements = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/achievements/${uid}`, {
        headers: {
          ...getAuthHeader()
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  }, []);

  // Auth Listener
  useEffect(() => {
    const uid = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!uid) {
      setIsLoggedIn(false);
      setUser(null);
      setGames([]);
      setAchievements([]);
      setIsAuthReady(true);
      return;
    }

    setIsLoggedIn(true);
    Promise.all([fetchUserData(uid), fetchGames(uid), fetchAchievements(uid)])
      .catch((error) => {
        console.error('Session restore failed:', error);
      })
      .finally(() => {
        setIsAuthReady(true);
      });
  }, [fetchUserData, fetchGames, fetchAchievements]);

  const toggleMute = () => setIsMuted(!isMuted);
  const refreshUser = async () => {
    if (!user?.uid) return;
    await fetchUserData(user.uid);
  };

  const addGame = async (name: string, duration: number, levelAchieved?: number, remark?: string) => {
    if (!user) return;

    const xpEarned = Math.floor(duration * 1.5);
    const uid = user.uid;

    try {
      // Add Game Session to MySQL
      await fetch(`${API_BASE_URL}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          userId: uid,
          name,
          duration,
          date: new Date().toISOString().split('T')[0],
          xpEarned,
          levelAchieved,
          remark
        })
      });

      // Update User XP and Level in MySQL
      let newXp = user.xp + xpEarned;
      let newLevel = user.level;
      let newNextLevelXp = user.nextLevelXp;

      if (newXp >= newNextLevelXp) {
        newLevel += 1;
        newXp = newXp - newNextLevelXp;
        newNextLevelXp = Math.floor(newNextLevelXp * 1.2);
        playSound('levelUp');
      } else {
        playSound('notification');
      }

      await fetch(`${API_BASE_URL}/api/users/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          xp: newXp,
          level: newLevel,
          nextLevelXp: newNextLevelXp
        })
      });

      // Refresh local state
      await fetchUserData(uid);
      await fetchGames(uid);

      // Check for achievements
      const totalPlaytime = games.reduce((acc, g) => acc + g.duration, 0) + duration;
      if (totalPlaytime >= 300) {
        await unlockAchievement('2');
      }
      if (newLevel >= 2) {
        await unlockAchievement('3');
      }
      if (games.length === 0) {
        await unlockAchievement('1');
      }

    } catch (error) {
      console.error('Add game failed:', error);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user) return;
    const uid = user.uid;

    const existing = achievements.find(a => a.achievementId === achievementId);
    if (existing) return;

    const template = INITIAL_ACHIEVEMENTS_TEMPLATES.find(t => t.achievementId === achievementId);
    if (!template) return;

    try {
      await fetch(`${API_BASE_URL}/api/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          userId: uid,
          ...template,
          unlocked: true,
          date: new Date().toISOString().split('T')[0]
        })
      });
      await fetchAchievements(uid);
      playSound('unlock');
    } catch (error) {
      console.error('Unlock achievement failed:', error);
    }
  };

  const login = async (loginValue: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginValue, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      const userData = data?.data?.user || data?.user;
      const token = data?.data?.token || data?.token;
      if (!userData?.uid) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem(AUTH_STORAGE_KEY, userData.uid);
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      setIsLoggedIn(true);
      setUser(userData);
      await fetchGames(userData.uid);
      await fetchAchievements(userData.uid);
      playSound('click');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (payload: {
    username: string;
    email: string;
    displayName: string;
    favoriteGame: string;
    avatar?: string;
    password: string;
    dob?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      const userData = data?.data?.user || data?.user;
      const token = data?.data?.token || data?.token;
      if (!userData?.uid) {
        throw new Error('Invalid registration response');
      }

      localStorage.setItem(AUTH_STORAGE_KEY, userData.uid);
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      setIsLoggedIn(true);
      setUser(userData);
      await fetchGames(userData.uid);
      await fetchAchievements(userData.uid);
      playSound('click');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsLoggedIn(false);
    setUser(null);
    setGames([]);
    setAchievements([]);
    playSound('click');
  };

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const interval = setInterval(() => {
      setUser((prev) => {
        if (!prev) return prev;
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

        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          nextLevelXp: newNextLevelXp
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [isLoggedIn, user?.xp, playSound]);

  return (
    <GameContext.Provider value={{ 
      user, games, achievements, isMuted, toggleMute, addGame, playSound, login, register, logout, refreshUser, isLoggedIn, isAuthReady 
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
