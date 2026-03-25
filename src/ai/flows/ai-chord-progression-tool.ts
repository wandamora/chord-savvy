'use server';
/**
 * @fileOverview An AI tool for generating harmonious chord progressions.
 *
 * - aiChordProgressionTool - A function that generates chord progressions based on user input.
 * - AiChordProgressionToolInput - The input type for the aiChordProgressionTool function.
 * - AiChordProgressionToolOutput - The return type for the aiChordProgressionTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChordProgressionToolInputSchema = z.object({
  mood: z.string().optional().describe('The desired mood for the chord progression (e.g., happy, melancholic, epic).'),
  genre: z.string().optional().describe('The desired genre for the chord progression (e.g., pop, rock, jazz, classical).'),
  key: z.string().optional().describe('The desired musical key for the chord progression (e.g., C Major, A Minor, G Blues).'),
});
export type AiChordProgressionToolInput = z.infer<typeof AiChordProgressionToolInputSchema>;

const AiChordProgressionToolOutputSchema = z.object({
  chordProgression: z.array(z.string()).describe('An array of chords representing the harmonious progression.'),
});
export type AiChordProgressionToolOutput = z.infer<typeof AiChordProgressionToolOutputSchema>;

export async function aiChordProgressionTool(input: AiChordProgressionToolInput): Promise<AiChordProgressionToolOutput> {
  return aiChordProgressionToolFlow(input);
}

const aiChordProgressionToolPrompt = ai.definePrompt({
  name: 'aiChordProgressionToolPrompt',
  input: {schema: AiChordProgressionToolInputSchema},
  output: {schema: AiChordProgressionToolOutputSchema},
  prompt: `You are an expert music theorist and composer, skilled at creating harmonious chord progressions.

Generate a harmonious chord progression based on the following criteria. Provide the output as a JSON object with a single key 'chordProgression' containing an array of chord symbols (e.g., ["Cmaj7", "Am7", "Dm7", "G7"]).

{{#if mood}}
Mood: {{{mood}}}
{{/if}}
{{#if genre}}
Genre: {{{genre}}}
{{/if}}
{{#if key}}
Key: {{{key}}}
{{/if}}

Ensure the progression is musically sound and evokes the specified characteristics.
`,
});

const aiChordProgressionToolFlow = ai.defineFlow(
  {
    name: 'aiChordProgressionToolFlow',
    inputSchema: AiChordProgressionToolInputSchema,
    outputSchema: AiChordProgressionToolOutputSchema,
  },
  async input => {
    try {
      const {output} = await aiChordProgressionToolPrompt(input);
      if (!output) {
        throw new Error('AI did not return a chord progression.');
      }
      return output;
    } catch (error) {
      console.error('Error in aiChordProgressionToolFlow:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
);
