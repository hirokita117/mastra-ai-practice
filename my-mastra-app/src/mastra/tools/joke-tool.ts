import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const jokeTool = createTool({
  id: 'generate-joke',
  description: 'Generate a Japanese joke based on a given theme',
  inputSchema: z.object({
    theme: z.string().describe('The theme or topic for the joke'),
  }),
  outputSchema: z.object({
    joke: z.string(),
  }),
  execute: async ({ context }) => {
    return await generateJoke(context.theme);
  },
});

const generateJoke = async (theme: string) => {
  // シンプルなジョーク生成ロジック
  // 実際のLLM呼び出しはエージェント側で行うため、ここでは基本的な構造のみ
  const joke = `テーマ「${theme}」に関するジョークを生成中...`;
  
  return {
    joke: joke,
  };
};
