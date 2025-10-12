import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

type FilePatch = {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  raw_url?: string;
};

type PullRequestFilesResponse = FilePatch[];

// Very small helper to fetch PR files via GitHub API without auth (public repos only)
// Note: Rate-limited. For production, add a token via headers.
async function fetchPrFiles(url: string): Promise<PullRequestFilesResponse> {
  // Accept forms:
  // - https://github.com/{owner}/{repo}/pull/{number}
  // - https://api.github.com/repos/{owner}/{repo}/pulls/{number}/files
  const match = url.match(/github.com\/(.+?)\/(.+?)\/pull\/(\d+)/);
  let apiUrl = url;
  if (match) {
    const [, owner, repo, number] = match;
    apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}/files`;
  }
  if (!apiUrl.includes('/pulls/') || !apiUrl.endsWith('/files')) {
    // Try to coerce api url if someone pasted PR api root
    if (apiUrl.includes('/pulls/')) apiUrl = apiUrl.replace(/\/pulls\/(\d+)(?!\/files).*$/, '/pulls/$1/files');
  }

  const res = await fetch(apiUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      // ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch PR files: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as PullRequestFilesResponse;
  return data;
}

export const githubPrDiffTool = createTool({
  id: 'github-pr-diff',
  description:
    'Fetch GitHub public Pull Request changed files and unified patches. Input: a PR URL like https://github.com/owner/repo/pull/123 or the API files endpoint.',
  inputSchema: z.object({
    prUrl: z.string().url().describe('Public GitHub PR URL'),
  }),
  outputSchema: z.object({
    files: z.array(
      z.object({
        filename: z.string(),
        status: z.string(),
        additions: z.number(),
        deletions: z.number(),
        changes: z.number(),
        patch: z.string().optional(),
        raw_url: z.string().optional(),
      }),
    ),
  }),
  execute: async ({ context }) => {
    const files = await fetchPrFiles(context.prUrl);
    return {
      files: files.map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes,
        patch: f.patch,
        raw_url: f.raw_url,
      })),
    };
  },
});


