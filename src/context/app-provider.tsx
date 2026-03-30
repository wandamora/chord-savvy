"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/auth-provider';
import { getUserData, updateUserData } from '@/lib/firebase/db';

interface AppContextType {
  favoriteSongs: string[];
  toggleFavoriteSong: (songId: string) => void;
  knownChords: string[];
  toggleKnownChord: (chord: string) => void;
  setKnownChords: (chords: string[]) => void;
  reminderSettings: {
    enabled: boolean;
    hour: number;
    timezone: string;
  };
  updateReminderSettings: (settings: Partial<{ enabled: boolean; hour: number; timezone: string }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [knownChords, setKnownChords] = useState<string[]>(['C', 'G', 'Am', 'F']);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<{
    enabled: boolean;
    hour: number;
    timezone: string;
  }>({
    enabled: false,
    hour: 9,
    timezone: 'UTC'
  });

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          if (data) {
            setFavoriteSongs(data.favoriteSongs || []);
            setKnownChords(data.knownChords || ['C', 'G', 'Am', 'F']);
            if (data.reminderSettings) {
              setReminderSettings(data.reminderSettings);
            }
          } else {
            const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            await updateUserData(user.uid, {
              favoriteSongs: [],
              knownChords: ['C', 'G', 'Am', 'F'],
              reminderSettings: {
                enabled: false,
                hour: 9,
                timezone: detectedTimezone
              }
            });
            setReminderSettings({
              enabled: false,
              hour: 9,
              timezone: detectedTimezone
            });
          }
        } catch (error) {
          console.error("Failed to load user data from Firestore", error);
        }
      } else {
        try {
          const storedFavorites = localStorage.getItem('chordSavvy_favorites');
          if (storedFavorites) {
            setFavoriteSongs(JSON.parse(storedFavorites));
          } else {
            setFavoriteSongs([]);
          }
          const storedKnownChords = localStorage.getItem('chordSavvy_knownChords');
          if (storedKnownChords) {
            setKnownChords(JSON.parse(storedKnownChords));
          } else {
            setKnownChords(['C', 'G', 'Am', 'F']);
          }
          const storedReminderSettings = localStorage.getItem('chordSavvy_reminderSettings');
          if (storedReminderSettings) {
            setReminderSettings(JSON.parse(storedReminderSettings));
          } else {
            setReminderSettings({
              enabled: false,
              hour: 9,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
          }
        } catch (error) {
          console.error("Failed to read from localStorage", error);
        }
      }
      setIsDataLoaded(true);
    }
    
    loadData();
    setIsMounted(true);
  }, [user]);

  useEffect(() => {
    if (!isDataLoaded || !isMounted) return;

    if (user) {
      updateUserData(user.uid, { favoriteSongs }).catch(error => {
        console.error("Failed to update favoriteSongs in Firestore", error);
      });
    } else {
      try {
        localStorage.setItem('chordSavvy_favorites', JSON.stringify(favoriteSongs));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
    }
  }, [favoriteSongs, isDataLoaded, isMounted, user]);

  useEffect(() => {
    if (!isDataLoaded || !isMounted) return;

    if (user) {
      updateUserData(user.uid, { knownChords }).catch(error => {
        console.error("Failed to update knownChords in Firestore", error);
      });
    } else {
      try {
        localStorage.setItem('chordSavvy_knownChords', JSON.stringify(knownChords));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
    }
  }, [knownChords, isDataLoaded, isMounted, user]);

  useEffect(() => {
    if (!isDataLoaded || !isMounted) return;

    if (user) {
      updateUserData(user.uid, { reminderSettings }).catch(error => {
        console.error("Failed to update reminderSettings in Firestore", error);
      });
    } else {
      try {
        localStorage.setItem('chordSavvy_reminderSettings', JSON.stringify(reminderSettings));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
    }
  }, [reminderSettings, isDataLoaded, isMounted, user]);

  const toggleFavoriteSong = (songId: string) => {
    setFavoriteSongs(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const toggleKnownChord = (chord: string) => {
    setKnownChords(prev =>
      prev.includes(chord)
        ? prev.filter(c => c !== chord)
        : [...prev, chord]
    );
  };

  const updateReminderSettings = (settings: Partial<{ enabled: boolean; hour: number; timezone: string }>) => {
    setReminderSettings(prev => ({ ...prev, ...settings }));
  };

  const contextValue = {
    favoriteSongs,
    toggleFavoriteSong,
    knownChords,
    toggleKnownChord,
    setKnownChords,
    reminderSettings,
    updateReminderSettings,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
