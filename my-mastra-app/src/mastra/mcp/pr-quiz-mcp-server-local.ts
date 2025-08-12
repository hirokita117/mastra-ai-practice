import { MCPServer } from '@mastra/mcp';
import { prQuizWorkflowLocal } from '../workflows/pr-quiz-workflow-local';

// Expose workflow as MCP tool: run_pr-quiz-workflow-local
export const prQuizMcpServerLocal = new MCPServer({
  name: 'pr-quiz-mcp-server-local',
  version: '1.0.0',
  tools: {},
  workflows: { prQuizWorkflowLocal },
});

// If executed directly via tsx, start stdio MCP server
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await prQuizMcpServerLocal.startStdio();
    // eslint-disable-next-line no-console
    console.log('MCPServer started on stdio: pr-quiz-mcp-server-local');
  })().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
}