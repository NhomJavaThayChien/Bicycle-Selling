import 'dotenv/config';
import { Version3Client } from 'jira.js';

async function listUsers() {
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

  try {
    const users = await jira.userSearch.findUsers({ query: '' });
    console.log('--- Jira Users found ---');
    for (const u of users) {
      if (u.accountType === 'atlassian') {
        console.log(`- ${u.displayName} : ${u.accountId}`);
      }
    }
  } catch (e) {
    console.error('Failed to list users:', e.message);
  }
}

listUsers();
