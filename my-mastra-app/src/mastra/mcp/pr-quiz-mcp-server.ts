import { MCPServer } from '@mastra/mcp';
import { prQuizWorkflow } from '../workflows/pr-quiz-workflow';

// Expose workflow as MCP tool: run_pr-quiz-workflow
export const prQuizMcpServer = new MCPServer({
  name: 'pr-quiz-mcp-server',
  version: '1.0.0',
  workflows: { prQuizWorkflow },
});

// If executed directly via tsx, start stdio MCP server
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await prQuizMcpServer.startStdio();
    // eslint-disable-next-line no-console
    console.log('MCPServer started on stdio: pr-quiz-mcp-server');
  })().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
}


