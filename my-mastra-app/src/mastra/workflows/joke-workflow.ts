import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const jokeSchema = z.object({
  joke: z.string(),
  theme: z.string(),
});

const evaluationSchema = z.object({
  score: z.number().min(1).max(10),
  reason: z.string(),
  joke: z.string(),
});

const generateJoke = createStep({
  id: 'generate-joke',
  description: 'Generates a Japanese joke based on a given theme',
  inputSchema: z.object({
    theme: z.string().describe('The theme for the joke'),
  }),
  outputSchema: jokeSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const agent = mastra?.getAgent('jokeAgent');
    if (!agent) {
      throw new Error('Joke agent not found');
    }

    const prompt = `テーマ「${inputData.theme}」に基づいて、面白い日本語のジョークを1つ生成してください。
    
    要件:
    - 日本語で書いてください
    - 家族向けで適切な内容にしてください
    - 語呂合わせや状況の面白さを活用してください
    - 簡潔で面白いものにしてください
    - 攻撃的でない内容にしてください`;

    const response = await agent.stream(
      [
        {
          role: 'user',
          content: prompt,
        },
      ],
      { toolChoice: 'none' },
    );

    let jokeText = '';

    for await (const chunk of response.textStream) {
      jokeText += chunk;
    }

    return {
      joke: jokeText.trim(),
      theme: inputData.theme,
    };
  },
});

const evaluateJoke = createStep({
  id: 'evaluate-joke',
  description: 'Evaluates the quality and humor of the generated joke',
  inputSchema: jokeSchema,
  outputSchema: evaluationSchema,
  execute: async ({ inputData, mastra }) => {
    const joke = inputData;

    if (!joke) {
      throw new Error('Joke data not found');
    }

    const agent = mastra?.getAgent('jokeAgent');
    if (!agent) {
      throw new Error('Joke agent not found');
    }

    const prompt = `以下のジョークを評価してください：

    ジョーク: "${joke.joke}"
    テーマ: "${joke.theme}"

    評価基準:
    - 面白さ (1-10点)
    - 適切さ (家族向けかどうか)
    - テーマとの関連性
    - 日本語としての自然さ

    以下の形式で回答してください：
    スコア: [1-10の数字]
    理由: [評価の詳細な理由]

    スコアが7点未満の場合は改善が必要とみなします。`;

    const response = await agent.stream(
      [
        {
          role: 'user',
          content: prompt,
        },
      ],
      { toolChoice: 'none' },
    );

    let evaluationText = '';

    for await (const chunk of response.textStream) {
      evaluationText += chunk;
    }

    // スコアを抽出（簡単な実装）
    const scoreMatch = evaluationText.match(/スコア[：:]\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

    return {
      score: score,
      reason: evaluationText.trim(),
      joke: joke.joke,
    };
  },
});

const improveJoke = createStep({
  id: 'improve-joke',
  description: 'Improves the joke if the evaluation score is below 7',
  inputSchema: evaluationSchema,
  outputSchema: z.object({
    finalJoke: z.string(),
    improved: z.boolean(),
  }),
  execute: async ({ inputData, mastra }) => {
    const evaluation = inputData;

    if (!evaluation) {
      throw new Error('Evaluation data not found');
    }

    // 一旦必ず改善するようにしておく
    /*
    if (evaluation.score >= 7) {
      return {
        finalJoke: evaluation.joke,
        improved: false,
      };
    }
    */

    // スコアが7未満なら改善
    const agent = mastra?.getAgent('jokeAgent');
    if (!agent) {
      throw new Error('Joke agent not found');
    }

    const prompt = `以下のジョークを改善してください：

    元のジョーク: "${evaluation.joke}"
    評価: ${evaluation.reason}
    スコア: ${evaluation.score}/10

    改善のポイント:
    - より面白くしてください
    - 語呂合わせや言葉遊びを活用してください
    - 状況をより面白くしてください
    - 日本語として自然にしてください
    - 家族向けで適切な内容にしてください

    改善されたジョークを1つ生成してください。`;

    const response = await agent.stream(
      [
        {
          role: 'user',
          content: prompt,
        },
      ],
      { toolChoice: 'none' },
    );

    let improvedJokeText = '';

    for await (const chunk of response.textStream) {
      improvedJokeText += chunk;
    }

    return {
      finalJoke: improvedJokeText.trim(),
      improved: true,
    };
  },
});

const jokeWorkflow = createWorkflow({
  id: 'joke-workflow',
  inputSchema: z.object({
    theme: z.string().describe('The theme for the joke'),
  }),
  outputSchema: z.object({
    finalJoke: z.string(),
    improved: z.boolean(),
  }),
})
  .then(generateJoke)
  .then(evaluateJoke)
  .then(improveJoke);

jokeWorkflow.commit();

export { jokeWorkflow };
