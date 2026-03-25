'use client';
import { useMemo } from 'react';
import { songs } from '@/lib/songs';
import SongCard from '@/components/song-card';
import { useApp } from '@/context/app-provider';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favoriteSongs } = useApp();

  const favoriteSongDetails = useMemo(() => {
    if (!favoriteSongs) return [];
    return songs.filter(song => favoriteSongs.includes(song.id));
  }, [favoriteSongs]);

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">My Favorite Songs</h1>
      {favoriteSongDetails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteSongDetails.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-24 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-12 w-12" />
          <h2 className="mt-4 text-xl font-semibold">No favorites yet</h2>
          <p className="mt-2">Browse songs and click the heart to add them to your favorites.</p>
        </div>
      )}
    </div>
  );
}
