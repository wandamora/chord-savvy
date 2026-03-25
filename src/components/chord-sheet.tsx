import React from 'react';

const ChordSegment: React.FC<{ chord?: string; lyric: string }> = ({ chord, lyric }) => (
  <div className="inline-flex flex-col mb-2">
    <div className="h-5 text-sm font-bold text-primary">
      {chord ? chord : "\u00A0"}
    </div>
    <div className="text-base whitespace-pre">
      {lyric || (chord ? "\u00A0" : "")}
    </div>
  </div>
);

export function ChordSheet({ content }: { content: string }) {
  return (
    <div className="font-mono text-base whitespace-pre-wrap leading-relaxed p-4 bg-card rounded-lg border">
      {content.split('\n').map((line, index) => {
        if (!line.trim()) {
          return <div key={index} className="h-4" />;
        }

        if (!line.includes('[')) {
          return <div key={index} className="py-1">{line}</div>;
        }

        const segments: { chord?: string; lyric: string }[] = [];
        const regex = /\[([^\]]+)\]([^\[]*)/g;
        
        let match;

        // Check for lyrics before the first chord
        const firstChordIndex = line.indexOf('[');
        if (firstChordIndex > 0) {
            segments.push({ lyric: line.substring(0, firstChordIndex) });
        }

        while ((match = regex.exec(line)) !== null) {
          segments.push({
            chord: match[1],
            lyric: match[2],
          });
        }
        
        return (
          <div key={index} className="flex flex-wrap items-end py-2">
            {segments.map((seg, i) => (
              <ChordSegment key={i} chord={seg.chord} lyric={seg.lyric} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
