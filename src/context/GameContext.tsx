import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc,
  orderBy,
  getDoc,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';

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
  username: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  age: number;
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
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isAuthReady: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_USER_DATA: User = {
  username: 'New Explorer',
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
      const res = await fetch(`/api/users/${uid}`);
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
      const res = await fetch(`/api/games/${uid}`);
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
      const res = await fetch(`/api/achievements/${uid}`);
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        const uid = firebaseUser.uid;
        
        // Sync user to MySQL
        try {
          const checkRes = await fetch(`/api/users/${uid}`);
          if (!checkRes.ok) {
            // Create user if not exists
            await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...INITIAL_USER_DATA,
                uid,
                username: firebaseUser.displayName || INITIAL_USER_DATA.username,
                avatar: firebaseUser.photoURL || INITIAL_USER_DATA.avatar,
              })
            });
          }
          await fetchUserData(uid);
          await fetchGames(uid);
          await fetchAchievements(uid);
        } catch (error) {
          console.error('Auth sync failed:', error);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setGames([]);
        setAchievements([]);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [fetchUserData, fetchGames, fetchAchievements]);

  const toggleMute = () => setIsMuted(!isMuted);

  const addGame = async (name: string, duration: number, levelAchieved?: number, remark?: string) => {
    if (!auth.currentUser || !user) return;

    const xpEarned = Math.floor(duration * 1.5);
    const uid = auth.currentUser.uid;

    try {
      // Add Game Session to MySQL
      await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      await fetch(`/api/users/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    const existing = achievements.find(a => a.achievementId === achievementId);
    if (existing) return;

    const template = INITIAL_ACHIEVEMENTS_TEMPLATES.find(t => t.achievementId === achievementId);
    if (!template) return;

    try {
      await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      playSound('click');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      playSound('click');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Simulated XP trickle (optional, keep it but update Firestore)
  useEffect(() => {
    if (!isLoggedIn || !user || !auth.currentUser) return;
    const interval = setInterval(async () => {
      const uid = auth.currentUser!.uid;
      const xpGain = 1;
      let newXp = user.xp + xpGain;
      let newLevel = user.level;
      let newNextLevelXp = user.nextLevelXp;

      if (newXp >= newNextLevelXp) {
        newLevel += 1;
        newXp = 0;
        newNextLevelXp = Math.floor(newNextLevelXp * 1.2);
        playSound('levelUp');
      }

      try {
        await updateDoc(doc(db, 'users', uid), {
          xp: newXp,
          level: newLevel,
          nextLevelXp: newNextLevelXp
        });
      } catch (error) {
        // Silent fail for trickle
      }
    }, 10000); // Slower trickle for cloud sync

    return () => clearInterval(interval);
  }, [isLoggedIn, user?.xp]);

  return (
    <GameContext.Provider value={{ 
      user, games, achievements, isMuted, toggleMute, addGame, playSound, login, logout, isLoggedIn, isAuthReady 
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
