'use client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import type { Song } from '@/lib/types';
import { useApp } from '@/context/app-provider';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { favoriteSongs, toggleFavoriteSong } = useApp();
  const isFavorite = favoriteSongs.includes(song.id);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleFavoriteSong(song.id);
  };

  return (
    <Card className="flex flex-col hover:border-primary/50 transition-colors duration-300">
      <Link href={`/songs/${song.id}`} className="flex flex-col flex-grow">
        <CardHeader>
          <CardTitle className="font-headline text-xl">{song.title}</CardTitle>
          <CardDescription>{song.artist}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {song.chords.slice(0, 5).map((chord) => (
              <Badge key={chord} variant="secondary">{chord}</Badge>
            ))}
            {song.chords.length > 5 && <Badge variant="outline">...</Badge>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            {/* The wrapping Link handles navigation. The button is just for styling. */}
        </CardFooter>
      </Link>
      <div className="flex justify-between items-center p-6 pt-0">
          <Button asChild variant="outline">
            <Link href={`/songs/${song.id}`}>View Song</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFavoriteClick} aria-label={isFavorite ? 'Unfavorite song' : 'Favorite song'}>
            <Heart className={`transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </Button>
      </div>
    </Card>
  );
}
