import 'dotenv/config';
import { Version3Client, AgileClient } from 'jira.js';

async function cleanup() {
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
  const projectKey = 'BS';

  console.log('Cleaning up project BS...');

  try {
    // 1. Delete all issues
    const search = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({ jql: `project = ${projectKey}`, maxResults: 100 });
    if (search.issues && search.issues.length > 0) {
      console.log(`Deleting ${search.issues.length} issues...`);
      for (const issue of search.issues) {
        await jira.issues.deleteIssue({ issueIdOrKey: issue.key });
        console.log(`  Deleted ${issue.key}`);
      }
    }

    // 2. Delete sprints
    const boards = await agile.board.getAllBoards({ projectKeyOrId: projectKey });
    const board = boards.values[0];
    if (board) {
      const sprints = await agile.board.getAllSprints({ boardId: board.id });
      for (const sprint of sprints.values) {
        if (sprint.state === 'future' || sprint.name.includes('Sprint')) {
          console.log(`Deleting Sprint: ${sprint.name} (ID: ${sprint.id})`);
          // Note: jira.js might have deleteSprint
          await agile.sprint.deleteSprint({ sprintId: sprint.id });
        }
      }
    }

    console.log('Cleanup complete.');
  } catch (error) {
    console.error('Cleanup failed:', error.message);
  }
}

cleanup();
