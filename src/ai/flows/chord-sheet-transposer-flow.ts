'use server';
/**
 * @fileOverview A Genkit flow for transposing guitar chord sheets.
 *
 * - transposeChordSheet - A function that handles the chord sheet transposition process.
 * - ChordSheetTransposerInput - The input type for the transposeChordSheet function.
 * - ChordSheetTransposerOutput - The return type for the transposeChordSheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChordSheetTransposerInputSchema = z.object({
  chordSheet: z.string().describe('The full content of the original chord sheet, including lyrics and chord notations.'),
  originalKey: z.string().describe('The original musical key of the song (e.g., "C", "Am", "G#", "F#m").'),
  targetKey: z.string().describe('The desired musical key to transpose the song to (e.g., "D", "Bbm", "Eb").'),
  suggestCapo: z.boolean().optional().default(false).describe('If true, the AI should suggest a capo position to play the song in the target key using simpler chord shapes.'),
});
export type ChordSheetTransposerInput = z.infer<typeof ChordSheetTransposerInputSchema>;

const ChordSheetTransposerOutputSchema = z.object({
  transposedChordSheet: z.string().describe('The chord sheet with all musical chords transposed. If a capo is suggested, these are the chord shapes to be played relative to the capo to achieve the target key. Otherwise, these are the chords played directly in the `targetKey`. All other text (lyrics, formatting) should remain unchanged.'),
  suggestedCapoPosition: z.number().nullable().describe('The suggested capo position (fret number) if a capo is recommended. Null if no capo is suggested or if `suggestCapo` was false.'),
  capoKey: z.string().nullable().describe('The key in which the chords are effectively played (the sounding key) when using the suggested capo position. This should match the `targetKey`. Null if no capo is suggested.'),
});
export type ChordSheetTransposerOutput = z.infer<typeof ChordSheetTransposerOutputSchema>;

export async function transposeChordSheet(input: ChordSheetTransposerInput): Promise<ChordSheetTransposerOutput> {
  return chordSheetTransposerFlow(input);
}

const chordSheetTransposerPrompt = ai.definePrompt({
  name: 'chordSheetTransposerPrompt',
  input: {schema: ChordSheetTransposerInputSchema},
  output: {schema: ChordSheetTransposerOutputSchema},
  prompt: `You are an expert music theory assistant specialized in transposing guitar chord sheets.
Your task is to transpose a given chord sheet from its original key to a target key.

Instructions:
1.  Identify all musical chords in the provided \`chordSheet\`. Chords can appear anywhere in the text, usually as capitalized letters with optional suffixes (e.g., C, Am, G7, F#m, Bbmaj7).
2.  Transpose only these identified chords from the \`originalKey\` to the \`targetKey\`.
3.  Preserve all other text, including lyrics, formatting, and non-chord annotations exactly as they appear in the \`chordSheet\`.
4.  Maintain the relative positioning and structure of the original \`chordSheet\`.
5.  If \`suggestCapo\` is true, determine if a capo can be used to play the song in the \`targetKey\` using simpler or more common chord shapes. If a capo is suggested:
    *   Calculate the \`suggestedCapoPosition\` (fret number, 0 for no capo if still simple chords).
    *   The \`transposedChordSheet\` should then contain the chord *shapes* to be played *relative to the capo*.
    *   The \`capoKey\` should represent the *sounding* key of the song with the capo applied, which should match the \`targetKey\`.
6.  If \`suggestCapo\` is false or no suitable capo position is found, transpose the chords directly to the \`targetKey\` without a capo, set \`suggestedCapoPosition\` to null, and \`capoKey\` to null.

Original Chord Sheet (Key: {{{originalKey}}}):
{{{chordSheet}}}

Target Key: {{{targetKey}}}
Suggest Capo: {{{suggestCapo}}}`,
});

const chordSheetTransposerFlow = ai.defineFlow(
  {
    name: 'chordSheetTransposerFlow',
    inputSchema: ChordSheetTransposerInputSchema,
    outputSchema: ChordSheetTransposerOutputSchema,
  },
  async input => {
    try {
      const {output} = await chordSheetTransposerPrompt(input);
      if (!output) {
        throw new Error('AI did not return a transposed chord sheet.');
      }
      return output;
    } catch (error) {
      console.error('Error in chordSheetTransposerFlow:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
);
