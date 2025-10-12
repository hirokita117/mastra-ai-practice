import { ollama } from 'ollama-ai-provider';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { jokeTool } from '../tools/joke-tool';

export const jokeAgent = new Agent({
  name: 'Joke Agent',
  instructions: `
      You are a helpful Japanese joke assistant that creates funny, appropriate jokes in Japanese.

      Your primary function is to generate jokes based on user-specified themes. When responding:
      - Always generate jokes in Japanese
      - Make jokes appropriate and family-friendly
      - Use wordplay, puns, or situational humor when possible
      - Keep jokes concise but entertaining
      - If the theme is unclear, ask for clarification
      - Avoid offensive or inappropriate content
      - Consider cultural context for Japanese humor

      Use the jokeTool to generate jokes based on themes.
`,
  model: ollama('qwen3:8b'),
  tools: { jokeTool },
  memory: new Memory({
    storage: new LibSQLStore({
      // SECURITY-NOTE: Storing sensitive conversation data in a local file is a security risk.
      // An attacker with file system access could read, modify, or delete the database.
      // For production, use a secure, managed database and provide the connection
      // string via an environment variable (e.g., process.env.DATABASE_URL).
      url: process.env.DATABASE_URL || 'file:../mastra.db', // Fallback for local dev only
    }),
  }),
});
