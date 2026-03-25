import {config} from 'dotenv';

const result = config();

if (result.error) {
  console.error('Error loading .env file', result.error);
}

import '@/ai/flows/ai-chord-progression-tool.ts';
import '@/ai/flows/chord-sheet-transposer-flow.ts';