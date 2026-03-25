'use client';
import { useState, useMemo } from 'react';
import { songs, getAllChords } from '@/lib/songs';
import SongCard from '@/components/song-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/app-provider';
import { Search } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const { knownChords, toggleKnownChord } = useApp();
  const [filterByKnownChords, setFilterByKnownChords] = useState(false);

  const availableChords = useMemo(() => getAllChords(), []);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesChords = !filterByKnownChords || (knownChords.length > 0 && song.chords.every(chord => knownChords.includes(chord)));

      return matchesSearch && matchesChords;
    });
  }, [searchTerm, knownChords, filterByKnownChords]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by song title or artist..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="filter-known-chords" 
            checked={filterByKnownChords}
            onCheckedChange={setFilterByKnownChords}
          />
          <Label htmlFor="filter-known-chords">Filter by my chords</Label>
        </div>
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Select Chords I Know ({knownChords.length})</span>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 pt-4">
            {availableChords.map((chord) => (
                <Button
                key={chord}
                variant={knownChords.includes(chord) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleKnownChord(chord)}
                >
                {chord}
                </Button>
            ))}
            </div>
        </CollapsibleContent>
      </Collapsible>

      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-lg">No songs found.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
