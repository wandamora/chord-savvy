import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

if (!process.env.GOOGLE_GENAI_API_KEY) {
  console.error(
    'GOOGLE_GENAI_API_KEY is not set. Please set it in your .env file.'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GOOGLE_GENAI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
});
