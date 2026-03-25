import React from 'react';

const Chord: React.FC<{ name: string }> = ({ name }) => (
  <span className="font-bold text-primary">{name}</span>
);

const ChordSegment: React.FC<{ chord?: string; lyric: string }> = ({ chord, lyric }) => (
  <div className="inline-block relative align-top -mb-4">
    {chord && <div className="h-5 text-sm"><Chord name={chord} /></div>}
    <div className={!chord ? 'mt-5' : ''}>{lyric}</div>
  </div>
);

export function ChordSheet({ content }: { content: string }) {
  return (
    <div className="font-code text-base whitespace-pre-wrap leading-8">
      {content.split('\n').map((line, index) => {
        if (!line.trim() || !line.includes('[')) {
          return <div key={index}>{line || <br />}</div>;
        }

        const segments: { chord?: string; lyric: string }[] = [];
        const regex = /\[([^\]]+)\]([^\[]*)/g;
        
        let match;

        // Check for lyrics before the first chord
        const firstChordIndex = line.indexOf('[');
        if (firstChordIndex > 0) {
            segments.push({ lyric: line.substring(0, firstChordIndex) });
        } else if (firstChordIndex === -1) {
            // Line has no chords
            return <div key={index}>{line}</div>
        }

        while ((match = regex.exec(line)) !== null) {
          segments.push({
            chord: match[1],
            lyric: match[2],
          });
          lastIndex = match.index + match[0].length;
        }
        
        // This handles cases where a line might only have chords and no lyrics after the first chord
        if (segments.length === 0 && line.includes('[')) {
            const chordOnlyRegex = /\[([^\]]+)\]/g;
            while((match = chordOnlyRegex.exec(line)) !== null) {
                segments.push({ chord: match[1], lyric: ' ' });
            }
        }


        return (
          <div key={index} className="flex flex-wrap items-end">
            {segments.map((seg, i) => (
              <ChordSegment key={i} chord={seg.chord} lyric={seg.lyric} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
