import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Version3Client, AgileClient } from 'jira.js';

// Initialize Jira clients
const config = {
  host: process.env.JIRA_HOST.startsWith('http') ? process.env.JIRA_HOST : `https://${process.env.JIRA_HOST}`,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    },
  },
};

const jira = new Version3Client(config);
const agile = new AgileClient(config);

// Create the MCP server
const server = new McpServer({
  name: 'jira-mcp',
  version: '1.0.0',
});

// Tool: Get issues by JQL
server.tool(
  'getIssuesByJQL',
  'Fetch Jira issues using a JQL query',
  {
    jql: { type: 'string', description: 'JQL string (e.g., project = TEST)' },
    maxResults: { type: 'number', description: 'Limit results', default: 50 },
  },
  async ({ jql, maxResults }) => {
    console.error(`Running JQL: ${jql}`);
    const response = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({ jql, maxResults });
    console.error(`Found ${response.issues?.length || 0} issues`);
    return {
      content: [{ type: 'text', text: JSON.stringify(response.issues, null, 2) }],
    };
  }
);

// Tool: Create new Jira issue
server.tool(
  'createIssue',
  'Create a new Jira issue',
  {
    projectKey: { type: 'string', description: 'Project key (e.g., TEST)' },
    summary: { type: 'string', description: 'Issue title' },
    description: { type: 'string', description: 'Issue details' },
    issueType: { type: 'string', description: 'Type (Task, Bug, etc.)' },
  },
  async ({ projectKey, summary, description, issueType = 'Task' }) => {
    console.error(`Creating issue in ${projectKey}`);
    const issue = await jira.issues.createIssue({
      fields: {
        project: { key: projectKey },
        summary,
        description,
        issuetype: { name: issueType },
      },
    });
    console.error(`Created issue: ${issue.key}`);
    return {
      content: [{ type: 'text', text: JSON.stringify(issue, null, 2) }],
    };
  }
);

// Tool: Get Boards
server.tool(
  'getBoards',
  'List all boards',
  {},
  async () => {
    const boards = await agile.board.getAllBoards();
    return {
      content: [{ type: 'text', text: JSON.stringify(boards, null, 2) }],
    };
  }
);

// Tool: Create Sprint
server.tool(
  'createSprint',
  'Create a new sprint on a board',
  {
    boardId: { type: 'number', description: 'ID of the board' },
    name: { type: 'string', description: 'Sprint name' },
    startDate: { type: 'string', description: 'ISO date string' },
    endDate: { type: 'string', description: 'ISO date string' },
    goal: { type: 'string', description: 'Sprint goal' },
  },
  async ({ boardId, name, startDate, endDate, goal }) => {
    const sprint = await agile.sprint.createSprint({
      originBoardId: boardId,
      name,
      startDate,
      endDate,
      goal,
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(sprint, null, 2) }],
    };
  }
);

// Tool: Move issues to sprint
server.tool(
  'moveIssuesToSprint',
  'Move issues to a specific sprint',
  {
    sprintId: { type: 'number' },
    issues: { type: 'array', items: { type: 'string' }, description: 'List of issue keys' },
  },
  async ({ sprintId, issues }) => {
    await agile.sprint.moveIssuesToSprint({ sprintId, issues });
    return {
      content: [{ type: 'text', text: `Successfully moved ${issues.length} issues to sprint ${sprintId}` }],
    };
  }
);

// Start the MCP server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Jira MCP Server is running');
}

main().catch((err) => console.error('Error:', err));
