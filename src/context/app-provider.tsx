"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  favoriteSongs: string[];
  toggleFavoriteSong: (songId: string) => void;
  knownChords: string[];
  toggleKnownChord: (chord: string) => void;
  setKnownChords: (chords: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [knownChords, setKnownChords] = useState<string[]>(['C', 'G', 'Am', 'F']);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('chordSavvy_favorites');
      if (storedFavorites) {
        setFavoriteSongs(JSON.parse(storedFavorites));
      }
      const storedKnownChords = localStorage.getItem('chordSavvy_knownChords');
      if (storedKnownChords) {
        setKnownChords(JSON.parse(storedKnownChords));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('chordSavvy_favorites', JSON.stringify(favoriteSongs));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
    }
  }, [favoriteSongs, isMounted]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('chordSavvy_knownChords', JSON.stringify(knownChords));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
    }
  }, [knownChords, isMounted]);

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

  const contextValue = {
    favoriteSongs,
    toggleFavoriteSong,
    knownChords,
    toggleKnownChord,
    setKnownChords,
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
