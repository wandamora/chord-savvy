import { AIChordProgressionTool } from '@/components/ai-chord-progression';

export default function AIChordToolPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-2">AI Chord Progression Tool</h1>
      <p className="text-muted-foreground mb-6">Generate harmonious chord progressions based on your criteria.</p>
      <AIChordProgressionTool />
    </div>
  );
}
