'use client';
import { useParams } from 'next/navigation';
import { songs } from '@/lib/songs';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/app-provider';
import { ChordSheet } from '@/components/chord-sheet';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function SongPage() {
  const params = useParams();
  const songId = params.id as string;
  const song = songs.find(s => s.id === songId);
  const { favoriteSongs, toggleFavoriteSong } = useApp();

  if (!song) {
    return (
        <div className="text-center">
            <h1 className="font-headline text-2xl mb-4">Song not found</h1>
            <Link href="/">
                <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to library
                </Button>
            </Link>
        </div>
    );
  }

  const isFavorite = favoriteSongs?.includes(song.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
        </Link>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="font-headline text-4xl font-bold">{song.title}</h1>
                <p className="text-xl text-muted-foreground mt-1">{song.artist}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                    {song.chords.map((chord) => (
                        <Badge key={chord} variant="secondary">{chord}</Badge>
                    ))}
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => toggleFavoriteSong(song.id)} aria-label={isFavorite ? 'Unfavorite song' : 'Favorite song'}>
              <Heart className={`transition-colors h-6 w-6 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            </Button>
        </div>
      </div>
      
      <div className="bg-card p-4 sm:p-6 rounded-lg">
        <ChordSheet content={song.content} />
      </div>
    </div>
  );
}
