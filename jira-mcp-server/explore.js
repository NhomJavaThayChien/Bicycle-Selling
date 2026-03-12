import 'dotenv/config';
import { Version3Client, AgileClient } from 'jira.js';

async function explore() {
  const config = {
    host: process.env.JIRA_HOST.startsWith('http') ? process.env.JIRA_HOST : `https://${process.env.JIRA_HOST}`,
    authentication: {
      basic: {
        email: process.env.JIRA_EMAIL,
        apiToken: process.env.JIRA_API_TOKEN,
      },
    },
  };

  const agile = new AgileClient(config);

  console.log('Agile Board prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(agile.board)));
  console.log('Agile Sprint prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(agile.sprint)));
}

explore();
