import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BADGES = [
  { id: 'first_scan', name: 'Premier Scan', icon: '🔍', desc: 'Scannez votre premier déchet', xp: 50 },
  { id: 'streak_3', name: 'Trieur Régulier', icon: '🔥', desc: '3 jours de suite', xp: 100 },
  { id: 'streak_7', name: 'Éco-Warrior', icon: '⚡', desc: '7 jours de suite', xp: 250 },
  { id: 'streak_30', name: 'Maître du Tri', icon: '👑', desc: '30 jours de suite', xp: 1000 },
  { id: 'scans_10', name: 'Curieux', icon: '🧐', desc: '10 déchets scannés', xp: 150 },
  { id: 'scans_50', name: 'Expert', icon: '🎓', desc: '50 déchets scannés', xp: 500 },
  { id: 'scans_100', name: 'Encyclopédie', icon: '📚', desc: '100 déchets scannés', xp: 1000 },
  { id: 'all_bins', name: 'Arc-en-ciel', icon: '🌈', desc: 'Trouvez chaque type de bac', xp: 200 },
  { id: 'compost_5', name: 'Composteur', icon: '🌱', desc: '5 biodéchets identifiés', xp: 150 },
  { id: 'special_3', name: 'Citoyen Responsable', icon: '🏅', desc: '3 déchets spéciaux (piles, médicaments…)', xp: 200 },
];

const LEVELS = [
  { level: 1, name: 'Débutant', minXp: 0 },
  { level: 2, name: 'Apprenti Trieur', minXp: 100 },
  { level: 3, name: 'Trieur Confirmé', minXp: 300 },
  { level: 4, name: 'Éco-Citoyen', minXp: 600 },
  { level: 5, name: 'Expert du Tri', minXp: 1000 },
  { level: 6, name: 'Maître Recycleur', minXp: 1500 },
  { level: 7, name: 'Champion Vert', minXp: 2500 },
  { level: 8, name: 'Héros Écologique', minXp: 4000 },
  { level: 9, name: 'Légende du Tri', minXp: 6000 },
  { level: 10, name: 'Gardien de la Planète', minXp: 10000 },
];

const STORAGE_KEY = 'triscan_gamification';

function getDefaultState() {
  return {
    xp: 0,
    totalScans: 0,
    streak: 0,
    lastScanDate: null,
    unlockedBadges: [],
    binsSeen: [],
    compostCount: 0,
    specialCount: 0,
    scanHistory: [],
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...getDefaultState(), ...JSON.parse(saved) };
  } catch {}
  return getDefaultState();
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const getLevel = useCallback(() => {
    let current = LEVELS[0];
    for (const level of LEVELS) {
      if (state.xp >= level.minXp) current = level;
      else break;
    }
    const nextLevel = LEVELS.find(l => l.minXp > state.xp);
    const progress = nextLevel
      ? (state.xp - current.minXp) / (nextLevel.minXp - current.minXp)
      : 1;
    return { ...current, progress, nextLevel };
  }, [state.xp]);

  const recordScan = useCallback((result) => {
    setState(prev => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const yesterday = new Date(now - 86400000).toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (prev.lastScanDate === today) {
        // Already scanned today, no streak change
      } else if (prev.lastScanDate === yesterday) {
        newStreak = prev.streak + 1;
      } else {
        newStreak = 1;
      }

      const bins = result?.items?.map(i => i.bin) || [];
      const newBinsSeen = [...new Set([...prev.binsSeen, ...bins])];
      const compostCount = prev.compostCount + bins.filter(b => b === 'compost').length;
      const specialCount = prev.specialCount + bins.filter(b => b === 'special' || b === 'dechetterie').length;

      const newState = {
        ...prev,
        totalScans: prev.totalScans + 1,
        xp: prev.xp + 25, // base XP per scan
        streak: newStreak,
        lastScanDate: today,
        binsSeen: newBinsSeen,
        compostCount,
        specialCount,
      };

      // Check badges
      const newBadges = [];
      for (const badge of BADGES) {
        if (prev.unlockedBadges.includes(badge.id)) continue;
        let earned = false;
        switch (badge.id) {
          case 'first_scan': earned = newState.totalScans >= 1; break;
          case 'streak_3': earned = newState.streak >= 3; break;
          case 'streak_7': earned = newState.streak >= 7; break;
          case 'streak_30': earned = newState.streak >= 30; break;
          case 'scans_10': earned = newState.totalScans >= 10; break;
          case 'scans_50': earned = newState.totalScans >= 50; break;
          case 'scans_100': earned = newState.totalScans >= 100; break;
          case 'all_bins': earned = newBinsSeen.length >= 5; break;
          case 'compost_5': earned = compostCount >= 5; break;
          case 'special_3': earned = specialCount >= 3; break;
        }
        if (earned) {
          newBadges.push(badge);
          newState.xp += badge.xp;
        }
      }

      if (newBadges.length > 0) {
        newState.unlockedBadges = [...prev.unlockedBadges, ...newBadges.map(b => b.id)];
        // Show the first new badge (we'll show a toast)
        setTimeout(() => setNewBadge(newBadges[0]), 300);
      }

      return newState;
    });
  }, []);

  const dismissBadge = useCallback(() => setNewBadge(null), []);

  const value = {
    ...state,
    getLevel,
    recordScan,
    newBadge,
    dismissBadge,
    allBadges: BADGES,
    allLevels: LEVELS,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
}
