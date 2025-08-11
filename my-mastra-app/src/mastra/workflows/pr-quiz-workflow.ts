import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Step1: fetch PR diffs using the tool indirectly via agent later, but here we only pass URL.
const inputSchema = z.object({
  prUrl: z.string().url().describe('Public GitHub Pull Request URL'),
});

const quizSchema = z.object({
  multipleChoice: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctOptionIndex: z.number().int().min(0).max(3),
      rationale: z.string(),
    }),
  ),
  shortAnswer: z.array(
    z.object({
      question: z.string(),
      expectedPoint: z.string(),
    }),
  ),
  reflection: z.object({
    prompt: z.string(),
  }),
});

const generateQuiz = createStep({
  id: 'generate-quiz',
  description: 'Generate a quiz from a public GitHub PR diff',
  inputSchema,
  outputSchema: quizSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('PR Quiz Agent');
    if (!agent) throw new Error('PR Quiz Agent not found');

    const system = `以下のGitHub PRからクイズを作成してください。PR URL: ${inputData.prUrl}`;
    const response = await agent.generate(
      [
        { role: 'user', content: system },
      ],
      {
        experimental_output: quizSchema,
        toolChoice: 'auto',
        maxSteps: 5,
      },
    );

    return response.object as z.infer<typeof quizSchema>;
  },
});

export const prQuizWorkflow = createWorkflow({
  id: 'pr-quiz-workflow',
  description: 'Create comprehension quizzes from a GitHub PR',
  inputSchema,
  outputSchema: quizSchema,
})
  .then(generateQuiz)
  .commit();


